import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import Button from "../components/Button";
import styles from "../styles/userStudyPage.module.css";
import toast, { Toaster } from "react-hot-toast";
import CheckBox from "../components/CheckBox";
import StopWatch from "../components/StopWatch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TimeSeriesPlot from "../components/TimeSeriesPlot";
import ConnectedScatterPlot from "../components/ConnectedScatterPlot";
import Card from "../components/Card";
import RadioButton from "../components/RadioButton";
import { onAuthStateChanged } from "firebase/auth";

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { SyncProvider } from "../context/SyncContext";

import {
  initialiseStudyOrders,
  checkUserCompletion,
  assignOrderToUser,
} from "../firebase/caseStudySetUp";

function PracticePage() {
  const navigate = useNavigate();
  const [stockTickers, setStockTickers] = useState([]);
  const [stockData, setStockData] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [studyCompleted, setStudyCompleted] = useState(false);
  const dataPath = "/data/example_data.json";

  const tickerTrends = {
    "Q-1": "Positive",
    "Q-2": "Negative",
    "Q-3": "Neutral",
  };

  useEffect(() => {
    const fetchStockTickers = async () => {
      const response = await axios.get(dataPath);
      const tickers = Object.keys(response.data);
      setStockTickers(tickers);
      setStockData(response.data);
    };
    fetchStockTickers();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        const hasCompleted = await checkUserCompletion(user.uid);
        setStudyCompleted(hasCompleted);

        if (hasCompleted) {
          toast.error("You have already completed the study");
        }
      } else {
        toast.error("Please sign in to participate in the study");
        navigate("/SignIn");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const ConsentForm = () => {
    const link = document.createElement("a");
    link.href = "/data/consent_form.pdf";
    link.download = "consent_form.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Consent form downloaded successfully!");
  };

  const Continue = async () => {
    if (!isChecked) {
      toast.error(
        "Please read and agree to the consent form before continuing."
      );
      return;
    }

    if (studyCompleted) {
      toast.error("You have already completed the study.");
      navigate("/");
      return;
    }
    if (!userId) {
      toast.error("Please sign in to continue.");
      navigate("/SignIn");
      return;
    }

    try {
      await initialiseStudyOrders();

      const order = await assignOrderToUser(userId);

      if (!order) {
        toast.error("Could not assign visualization order. Please try again.");
        return;
      }

      const userRef = doc(db, "participants", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          currentStep: 1,
          flowStarted: true,
          lastActivity: new Date().toISOString(),
          order: order,
        });
      } else {
        await setDoc(userRef, {
          order: order,
          currentStep: 1,
          flowStarted: true,
          status: "in_progress",
          answers: {},
          timings: {},
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
        });
      }

      navigate("/Questions/1");
    } catch (error) {
      console.error("Error initialising study flow:", error);
      toast.error("Error updating user document. Please try again.");
    }
  };

  const handleConsentChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const renderExampleSet = (index) => {
    const ticker = stockTickers[index];
    if (!ticker || !stockData[ticker]) return null;

    const trend = tickerTrends[ticker] || "Unknown";

    return (
      <div className={styles.examples}>
        <div className={styles.exampleCard}>
          <h2 className={styles.exampleTitle}>
            Time Series plot - {trend} Trend Example
          </h2>
          <div className={styles.exampleContent}>
            <TimeSeriesPlot data={stockData[ticker]} ticker={ticker} />
          </div>
          <div className={styles.radioButtonsContainer}>
            <RadioButton
              text="Positive"
              name={`timeseries-trend-${index}`}
              value="positive"
            />
            <RadioButton
              text="Neutral"
              name={`timeseries-trend-${index}`}
              value="neutral"
            />
            <RadioButton
              text="Negative"
              name={`timeseries-trend-${index}`}
              value="negative"
            />
          </div>
        </div>
        <div className={styles.exampleCard}>
          <h2 className={styles.exampleTitle}>
            Connected Scatter Plot - {trend} Trend Example
          </h2>
          <div className={styles.exampleContent}>
            <ConnectedScatterPlot data={stockData[ticker]} ticker={ticker} />
          </div>
          <div className={styles.radioButtonsContainer}>
            <RadioButton
              text="Positive"
              name={`connected-scatter-${index}`}
              value="positive"
            />
            <RadioButton
              text="Neutral"
              name={`connected-scatter-${index}`}
              value="neutral"
            />
            <RadioButton
              text="Negative"
              name={`connected-scatter-${index}`}
              value="negative"
            />
          </div>
        </div>
        <div className={styles.glyphExample}>
          <h2 className={styles.exampleTitle}>
            Enhanced Glyph - {trend} Trend Example
          </h2>
          <div className={styles.exampleContent}>
            <Card
              className={styles.glyphCard}
              ticker={ticker}
              stockData={stockData[ticker]}
              index={0}
            />
          </div>
          <div className={styles.radioButtonsContainer}>
            <RadioButton
              text="Positive"
              name={`glyph-trend-${index}`}
              value="positive"
            />
            <RadioButton
              text="Neutral"
              name={`glyph-trend-${index}`}
              value="neutral"
            />
            <RadioButton
              text="Negative"
              name={`glyph-trend-${index}`}
              value="negative"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <SyncProvider>
        <Toaster position="bottom-left" reverseOrder={false}></Toaster>
        <div className={styles.content}>
          <p className={styles.description}>
            The following practice section will give you a series of different
            plots, Time series, Connected scatter and Enhanced Glyphs. You will
            be tasked to identify if the plots demonstrate a positive, negative
            or neutral trend. You will be given 3 sets of questions. Each set
            will consist of 15 questions. Each set will be either a time series,
            connected scatter or enhanced glyphs. The order of the set will be
            randomised. You will be assessed on your ability to identify the
            trends in the plots. Your data and all recorded information will be
            kept confidential and will not be shared with any third party. You
            can find more information in the consent form below. An example of
            the questions is given below with the timer.
          </p>
          <p className={styles.description}>
            Please take your time to familiarise yourself with the examples
            provided below. As a reminder to how the conected scatter plot and
            glyph works, you can refer back to the Tutorial page.
          </p>
          <p className={styles.description}>
            You are only able to complete this study once.
          </p>

          <div className={styles.stopWatchExample}>
            <StopWatch></StopWatch>
          </div>
          {stockTickers.length >= 3 ? (
            <>
              {renderExampleSet(0)}
              {renderExampleSet(1)}
              {renderExampleSet(2)}
            </>
          ) : (
            <p>Loading examples...</p>
          )}

          <div className={styles.continue}>
            <div className={styles.continueLeft}></div>
            <div className={styles.continueCenter}>
              <Button text="Consent Form" onClick={ConsentForm} />
              <CheckBox
                label="I have read and understood the consent form"
                onChange={handleConsentChange}
              ></CheckBox>
            </div>
            <div className={styles.continueRight}>
              <Button
                text="Continue"
                onClick={Continue}
                disabled={!isChecked}
              />
            </div>
          </div>
        </div>
      </SyncProvider>
    </div>
  );
}

export default PracticePage;
