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

const QuestionsPage = () => {
  const navigate = useNavigate();
  const { setId = "1" } = useParams();
  const currentSet = parseInt(setId);

  const [questionsData, setQuestionsData] = useState([]);
  const [stockTickers, setStockTickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [visulisationType, setVisulisationType] = useState("");

  const questionSetPath = {
    1: "/case_study_data/practice_data_1.json",
    2: "/case_study_data/practice_data_2.json",
    3: "/case_study_data/practice_data_3.json",
  };

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(questionSetPath[currentSet]);
        setQuestionsData(response.data);
        const initialAnswers = {};
        Object.keys(response.data).forEach((ticker) => {
          initialAnswers[ticker] = "";
        });

        setStockTickers(Object.keys(response.data));
        setAnswers(initialAnswers);
        if (currentSet === 1) {
          setVisulisationType("Time Series");
        } else if (currentSet === 2) {
          setVisulisationType("Connected Scatter Plot");
        } else {
          setVisulisationType("Enhanced Glyph");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions", error);
        setLoading(false);
      }
    };
    fetchQuestionData();
  }, [currentSet]);

  const handleNext = () => {
    const unasweredQuestions = Object.keys(questionsData).filter(
      (ticker) => !answers[ticker]
    );

    if (unasweredQuestions.length > 0) {
      toast.error("Please answer all questions before proceeding.");
      return;
    }

    if (currentSet < 3) {
      navigate(`/questions/${currentSet + 1}`);
    } else {
      navigate("/results");
    }
  };

  const renderVisualization = (ticker) => {
    switch (visulisationType) {
      case "Time Series":
        return (
          <TimeSeriesPlot data={questionsData[ticker].data} ticker={ticker} />
        );
      case "Connected Scatter Plot":
        return (
          <ConnectedScatterPlot
            data={questionsData[ticker].data}
            ticker={ticker}
          />
        );
      case "Enhanced Glyph":
        return (
          <Card
            ticker={ticker}
            stockData={questionsData[ticker].data}
            index={0}
          />
        );
      default:
        return <div>No visulisastion Available</div>;
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading questions..</div>;
  }

  const handleAnswerChange = (ticker, value) => {
    setAnswers((prev) => ({
      ...prev,
      [ticker]: value,
    }));
  };

  return (
    <div className={styles.pageContainer}>
      <Toaster position="bottom-left" reverseOrder={false} />

      <div className={styles.contentContainer}>
        <h1 className={styles.pageTitle}>{visulisationType} Question Set</h1>
        <p className={styles.instructions}>
          For each stock, determine if the trend is positive, neutral, or
          negative.
        </p>
      </div>
      <div className={styles.questionsContainer}>
        {stockTickers.map((ticker) => (
          <div key={ticker} className={styles.questionItem}>
            <h1 className={styles.tickerTitle}>{ticker}</h1>
            <div className={styles.visulisation}>
              {renderVisualization(ticker)}
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

        <div className={styles.nextpage}>
          <Button
            onClick={handleNext}
            text={currentSet < 3 ? "Next" : "Finish"}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
