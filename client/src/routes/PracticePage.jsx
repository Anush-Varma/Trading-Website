import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import Button from "../components/Button";
import styles from "../styles/practicePage.module.css";
import toast, { Toaster } from "react-hot-toast";
import CheckBox from "../components/CheckBox";
import StopWatch from "../components/StopWatch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TimeSeriesPlot from "../components/TimeSeriesPlot";
import ConnectedScatterPlot from "../components/ConnectedScatterPlot";
import Card from "../components/Card";
import RadioButton from "../components/RadioButton";

function PracticePage() {
  const navigate = useNavigate();
  const [stockTickers, setStockTickers] = useState([]);
  const [stockData, setStockData] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const dataPath = "/data/example_data.json";

  useEffect(() => {
    const fetchStockTickers = async () => {
      const response = await axios.get(dataPath);
      const tickers = Object.keys(response.data);
      setStockTickers(tickers);
      setStockData(response.data);
      setSelectedStock(tickers[0]);
    };
    fetchStockTickers();
  }, []);

  const ConsentForm = () => {
    const link = document.createElement("a");
    link.href = "/data/consent_form.pdf";
    link.download = "consent_form.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Consent form downloaded successfully!");
  };
  const Continue = () => {};

  const handleConsentChange = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className={styles.container}>
      <Toaster position="bottom-left" reverseOrder={false}></Toaster>
      <div className={styles.content}>
        <p className={styles.description}>
          The following practice section will give you a series of different
          plots, Time series, Connected scatter and Enhanced Glyphs. You will be
          tasked to identify if the plots are demonstrating a positive, negative
          or neutral trend.
        </p>
        <p className={styles.description}>
          Each page will be timed with a timer you are able to pause and resume.
          The timer will automatically start at the start of each question.
        </p>
        <p className={styles.description}>
          You will be assessed on your ability to identify the trends in the
          plots.
        </p>
        <p className={styles.description}>
          Your data and all recorded information will be kept confidential and
          will not be shared with any third party. You can find more information
          in the consent form below.
        </p>
        <p className={styles.description}>
          You are only able to complete this practice once
        </p>
        <p className={styles.description}>
          An examle of the quesions is given below with the timer. Please take
          your time to familiarise with the example.
        </p>
        <div className={styles.stopWatchExample}>
          <StopWatch></StopWatch>
        </div>

        <div className={styles.examples}>
          <div className={styles.exampleCard}>
            <h2 className={styles.exampleTitle}>
              Time Series plot example question
            </h2>
            <div className={styles.exampleContent}>
              {selectedStock && stockData[selectedStock] && (
                <TimeSeriesPlot
                  data={stockData[selectedStock]}
                  ticker={selectedStock}
                />
              )}
            </div>
            <div className={styles.radioButtonsContainer}>
              <RadioButton
                text="Positive"
                name="timeseries-trend"
                value="positive"
              />
              <RadioButton
                text="Neutral"
                name="timeseries-trend"
                value="neutral"
              />
              <RadioButton
                text="Negative"
                name="timeseries-trend"
                value="negative"
              />
            </div>
          </div>
          <div className={styles.exampleCard}>
            <h2 className={styles.exampleTitle}>
              Connected Scatter plot example question
            </h2>
            <div className={styles.exampleContent}>
              {selectedStock && stockData[selectedStock] && (
                <ConnectedScatterPlot
                  data={stockData[selectedStock]}
                  ticker={selectedStock}
                />
              )}
            </div>
            <div className={styles.radioButtonsContainer}>
              <RadioButton
                text="Positive"
                name="connected-scatter"
                value="positive"
              />
              <RadioButton
                text="Neutral"
                name="connected-scatter"
                value="neutral"
              />
              <RadioButton
                text="Negative"
                name="connected-scatter"
                value="negative"
              />
            </div>
          </div>
          <div className={styles.glyphExample}>
            <h2 className={styles.exampleTitle}>
              Enhanced glyph example Question
            </h2>
            <div className={styles.exampleContent}>
              {selectedStock && stockData[selectedStock] && (
                <Card
                  className={styles.glyphCard}
                  ticker={selectedStock}
                  stockData={stockData[selectedStock]}
                  index={0}
                />
              )}
            </div>
            <div className={styles.radioButtonsContainer}>
              <RadioButton
                text="Positive"
                name="glyph-trend"
                value="positive"
              />
              <RadioButton text="Neutral" name="glyph-trend" value="neutral" />
              <RadioButton
                text="Negative"
                name="glyph-trend"
                value="negative"
              />
            </div>
          </div>
        </div>
        <div className={styles.continue}>
          <div className={styles.continueLeft}></div>
          <div className={styles.continueCenter}>
            <Button text="Consent Form" onClick={ConsentForm} />
            <CheckBox
              label="tick to accept consent"
              onChange={handleConsentChange}
            ></CheckBox>
          </div>
          <div className={styles.continueRight}>
            <Button text="Continue" onClick={Continue} disabled={!isChecked} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PracticePage;
