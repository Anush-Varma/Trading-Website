import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StopWatch from "../components/StopWatch";
import TimeSeriesPlot from "../components/TimeSeriesPlot";
import Card from "../components/Card";
import toast, { Toaster } from "react-hot-toast";
import ConnectedScatterPlot from "../components/ConnectedScatterPlot";
import axios from "axios";
import styles from "../styles/questionsPage.module.css";
import Button from "../components/Button";
import RadioButton from "../components/RadioButton";

import { db, auth } from "../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  assignOrderToUser,
  checkUserCompletion,
} from "../firebase/caseStudySetUp";
import { onAuthStateChanged } from "firebase/auth";
import { use } from "react";
import { SyncProvider } from "../context/SyncContext";

const QuestionsPage = () => {
  const navigate = useNavigate();
  const { setId = "1" } = useParams();
  const currentSet = parseInt(setId);

  const [questionsData, setQuestionsData] = useState([]);
  const [stockTickers, setStockTickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [visulisationType, setVisulisationType] = useState("");
  const [userId, setUserId] = useState("");
  const [userOrder, setUserOrder] = useState(null);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(true);

  const [elapsedTime, setElapsedTime] = useState(0);
  const stopwatchRef = React.useRef(null);
  const startTimeRef = React.useRef(null);

  const questionSetPath = {
    1: "/case_study_data/practice_data_1.json",
    2: "/case_study_data/practice_data_2.json",
    3: "/case_study_data/practice_data_3.json",
  };

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.pathname);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.pathname);
      toast.error("You cannot go back to the previous page.");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const initialiseUser = async () => {
      const authChanges = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          setUserId(uid);

          const hasCompleted = await checkUserCompletion(uid);
          if (hasCompleted) {
            toast.error("You have already completed the study.");
            navigate("/");
            return;
          }

          const userRef = doc(db, "participants", uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            toast.error("User profile not found. Please sign in again.");
            navigate("/SignIn");
            return;
          }

          const userData = userDoc.data();

          if (!userData.flowStarted || userData.currentStep !== currentSet) {
            toast.error("You are not allowed to access this page.");
            navigate("/");
            return;
          }

          setUserOrder(userData.order);
          setAnswers({});

          if (userData.answers && userData.answers[`set${currentSet}`]) {
            setAnswers(userData.answers[`set${currentSet}`]);
          }
        } else {
          toast.error("You are not signed in. Please sign in to continue.");
          navigate("/SignIn");
        }
      });
      return () => authChanges();
    };

    initialiseUser();
  }, [navigate, currentSet]);

  useEffect(() => {
    const fetchQuestionData = async () => {
      if (!userId || !userOrder) return;

      try {
        setLoading(true);
        const response = await axios.get(questionSetPath[currentSet]);
        setQuestionsData(response.data);

        if (Object.keys(answers).length === 0) {
          const initialAnswers = {};
          Object.keys(response.data).forEach((ticker) => {
            initialAnswers[ticker] = "";
          });
          setAnswers(initialAnswers);
        }
        setStockTickers(Object.keys(response.data));

        setVisulisationType(userOrder[currentSet - 1]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions", error);
        setLoading(false);
        toast.error("Error fetching questions. Please try again.");
      }
    };

    if (userId && userOrder) {
      fetchQuestionData();
    }
  }, [currentSet, userId, userOrder, answers.length]);

  const saveAnswersToFirebase = async () => {
    if (!userId) return;
    try {
      const userRef = doc(db, "participants", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        toast.error("User profile not found. Please sign in again.");
        return;
      }

      const currentTime = Date.now();
      const startTime = startTimeRef.current;
      const timeSpentInSeconds = Math.floor((currentTime - startTime) / 1000);

      const stopwatchTime = stopwatchRef.current
        ? stopwatchRef.current
        : timeSpentInSeconds;

      await updateDoc(userRef, {
        [`answers.set${currentSet}`]: answers,
        [`timings.set${currentSet}`]: {
          completedAt: new Date().toISOString(),
          timeSpentInSeconds: stopwatchTime,
          visulisationType: visulisationType,
        },
        status: currentSet === 3 ? "completed" : "in_progress",
        lastUpdated: new Date().toISOString(),
        currentStep: currentSet,
        flowStarted: true,
      });

      console.log("Answers saved to Firebase:", answers);
    } catch (error) {
      console.error("Error saving answers to Firebase", error);
      toast.error("Error saving answers to database please try again.");
    }
  };

  const handleNext = async () => {
    const unasweredQuestions = Object.keys(questionsData).filter(
      (ticker) => !answers[ticker]
    );

    if (unasweredQuestions.length > 0) {
      toast.error("Please answer all questions before proceeding.");
      return;
    }

    try {
      await saveAnswersToFirebase();

      const nextSet = currentSet + 1;
      const userRef = doc(db, "participants", userId);

      if (currentSet < 3) {
        await updateDoc(userRef, {
          currentStep: nextSet,
          lastActivity: new Date().toISOString(),
        });
        startTimeRef.current = Date.now();
        navigate(`/Questions/${nextSet}`);
      } else {
        await updateDoc(userRef, {
          flowStarted: false,
          currentSet: null,
          status: "completed",
          lastActivity: new Date().toISOString(),
        });

        // change this to navigate to thank you / survery page
        navigate("/");
        toast.success("Thank you for completing the study!");
      }
    } catch (error) {
      console.error("Error updating user document", error);
      toast.error("Error updating user document. Please try again.");
    }
  };

  const updateStopwatchTime = (time) => {
    setElapsedTime(time);
    stopwatchRef.current = time;
  };

  const renderVisualisation = (ticker) => {
    switch (visulisationType) {
      case "Time Series":
        return <TimeSeriesPlot data={questionsData[ticker].data} ticker={""} />;
      case "Connected Scatter Plot":
        return (
          <ConnectedScatterPlot data={questionsData[ticker].data} ticker={""} />
        );
      case "Enhanced Glyph":
        return (
          <Card ticker={""} stockData={questionsData[ticker].data} index={0} />
        );
      default:
        return <div>No visulisastion Available</div>;
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading questions..</div>;
  }

  const handleAnswerChange = (ticker, value) => {
    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [ticker]: value,
      };
      return newAnswers;
    });
  };

  const handleStopwatchStateChange = (isRunning) => {
    setIsStopwatchRunning(isRunning);
  };

  const isGridLayout = visulisationType === "Enhanced Glyph";

  return (
    <SyncProvider>
      <div className={styles.pageContainer}>
        {!isStopwatchRunning && <div className={styles.blurOverlay}></div>}
        <div
          className={`${styles.fixedStopWatch} ${
            !isStopwatchRunning ? styles.activeStopWatch : ""
          }`}
        >
          <StopWatch
            autoStart={true}
            onStateChange={handleStopwatchStateChange}
            onTimeUpdate={updateStopwatchTime}
          />
        </div>

        <Toaster position="bottom-left" reverseOrder={false} />

        <div className={styles.textContainer}>
          <h1 className={styles.pageTitle}>{visulisationType} Question Set</h1>
          <p className={styles.instructions}>
            For each stock, determine if the trend is positive, neutral, or
            negative.
          </p>
        </div>
        <div className={styles.questionsContainer}>
          <div className={isGridLayout ? styles.gridContainer : undefined}>
            {stockTickers.map((ticker) => (
              <div key={ticker} className={styles.questionItem}>
                <h1 className={styles.tickerTitle}>{ticker}</h1>
                <div className={styles.visulisation}>
                  {renderVisualisation(ticker)}
                </div>
                <div className={styles.answerOptions}>
                  <RadioButton
                    text="Positive"
                    name={`answer-${ticker}`}
                    value="positive"
                    checked={answers[ticker] === "positive"}
                    onChange={() => {
                      handleAnswerChange(ticker, "positive");
                    }}
                  />
                  <RadioButton
                    text="Neutral"
                    name={`answer-${ticker}`}
                    value="neutral"
                    checked={answers[ticker] === "neutral"}
                    onChange={() => {
                      handleAnswerChange(ticker, "neutral");
                    }}
                  />
                  <RadioButton
                    text="Negative"
                    name={`answer-${ticker}`}
                    value="negative"
                    checked={answers[ticker] === "negative"}
                    onChange={() => {
                      handleAnswerChange(ticker, "negative");
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.nextpage}>
          <Button
            onClick={handleNext}
            text={currentSet < 3 ? "Next" : "Finish"}
          ></Button>
        </div>
      </div>
    </SyncProvider>
  );
};

export default QuestionsPage;
