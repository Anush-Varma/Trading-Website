import React from "react";
import Button from "../components/Button";
import styles from "../styles/tutorial.module.css";
import axios from "axios";
import TimeSeriesPlot from "../components/TimeSeriesPlot";
import Card from "../components/Card";
import ConnectedScatterPlot from "../components/ConnectedScatterPlot";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

  const practice = () => {
    const user = auth.currentUser;
    if (user) {
      // navigate("/Practice");
    } else {
      alert("Please sign in or create an account to access the practice");
      navigate("/SignIn");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleDescription}>
        <h1>Welcome to the Tutorial</h1>
        <h2>
          This tutorial will help you understnad and learn how to use the
          enhnaced glyph component and how connected scatter plots work for time
          series data in stock analysis
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
            Time series data is a series of data points indexed in time order.
            Time series data is used in various fields such as finance, weather
            forecasting, and sales forecasting. Time series data is used to
            predict future values based on past data.
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
            A connected scatter plot shows the relashionship between two time
            series data. The The x-axis represents one time series data and the
            y-axis represents another time series data. The points are coloured
            using a colour gradient with red being the earliest and green being
            the latest.
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
            to visualise the connected scatter plot with the ability to get
            select vaiours technical indicators. The enhanced glyph component
            also provides an RSI indicator to help gather more insights on the
            stock data at a certain point. In addition, the enhanced glyph
            provides a expanding feature to better view the connected scatter
            plot.
          </p>
        </div>
      </div>
      <div className={styles.practiceButton}>
        <Button text="Practice" onClick={practice}></Button>
      </div>
    </div>
  );
}

export default Tutorial;
