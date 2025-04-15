import React from "react";
import Button from "../components/Button";
import styles from "../styles/tutorial.module.css";
import axios from "axios";
import TimeSeriesPlot from "../components/TimeSeriesPlot";
import Card from "../components/Card";
import ConnectedScatterPlot from "../components/ConnectedScatterPlot";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import CheckBox from "../components/CheckBox";
import { checkUserCompletion } from "../firebase/caseStudySetUp";
import { SyncProvider } from "../context/SyncContext";

function Tutorial() {
  const navigate = useNavigate();
  const [stockTickers, setStockTickers] = useState([]);
  const [stockData, setStockData] = useState({});
  const [selectedStock, setSelectedStock] = useState(null);
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

  const practice = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const hasCompleted = await checkUserCompletion(user.uid);
        if (hasCompleted) {
          toast.error("You have already completed the study");
          navigate("/");
          return;
        } else {
          navigate("/Practice");
        }
      } catch (error) {
        console.error("Error checking user completion:", error);
        toast.error("Error checking user completion");
      }
    } else {
      toast.error("Please sign in to access this page.");
      navigate("/SignIn");
      return;
    }
  };

  return (
    <SyncProvider>
      <div className={styles.container}>
        <Toaster
          position="bottom-left"
          reverseOrder={false}
          toastOptions={{ duration: 4000 }}
        />
        <div className={styles.titleDescription}>
          <h1>Welcome to the Tutorial</h1>
          <h2>
            This tutorial will help you understand and learn how to use the
            enhanced glyph component and how connected scatter plots work for
            time series data in stock analysis
          </h2>
        </div>
        <div className={styles.example}>
          <div className={styles.leftGraph}>
            {selectedStock && stockData[selectedStock] && (
              <TimeSeriesPlot
                data={stockData[selectedStock]}
                ticker={selectedStock}
              />
            )}
          </div>
          <div className={styles.rightText}>
            <h2>Time Series Plot</h2>
            <p>
              Time series plots, also called time series graphs, display data
              points collected in a time sequence. They are a simple way to
              represent time series data. The x-axis represents time and the
              y-axis represents the variable measured. In this instance, it
              would be end-of-day stock prices These plots help visualise trends
              and patterns.
            </p>
          </div>
        </div>
        <div className={styles.example}>
          <div className={styles.leftGraph}>
            {selectedStock && stockData[selectedStock] && (
              <ConnectedScatterPlot
                data={stockData[selectedStock]}
                ticker={selectedStock}
              />
            )}
          </div>
          <div className={styles.rightText}>
            <h2>Connected Scatter Plots</h2>
            <p>
              A connected scatter plot shows the relationship between two-time
              series data. The x-axis represents one time series data and the
              y-axis represents another time series data. The points are
              coloured using a colour gradient with red being the earliest and
              white being the latest. These plots help combine two time series
              plots into one, for this example, we take two technical indicators
              of simple moving averages of 10 days against 50 days (SMA10 vs
              SMA50)
            </p>
          </div>
        </div>
        <div className={styles.example}>
          <div>
            {selectedStock && stockData[selectedStock] && (
              <Card
                ticker={selectedStock}
                stockData={stockData[selectedStock]}
                index={0}
              />
            )}
          </div>
          <div className={styles.rightText}>
            <h2>Enhanced Glyph Component</h2>
            <p>
              The enhanced glyph component is a custom component that allows you
              to visualise different connected scatter plots with the ability to
              select various technical indicators. The enhanced glyph component
              also provides an RSI indicator under the connected scatter plot to
              help gather more insights on the stock data at a certain point. In
              addition, the enhanced glyph provides an expanding feature to
              better view the connected scatter plot and time series plots side
              by side with a synchronisation feature.
            </p>
          </div>
        </div>
        <div className={styles.practiceButton}>
          <Button text="Go to user study" onClick={practice}></Button>
        </div>
      </div>
    </SyncProvider>
  );
}

export default Tutorial;
