import Card from "../components/Card";
import styles from "../styles/HomePage.module.css";
import axios from "axios";
import { useEffect, useState } from "react";

function HomePage() {
  const [stockTickers, setStockTickers] = useState([]);
  const [stockData, setStockData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const stocksPerPage = 50;

  // const dataPath = "/data/neutral_stock_trend_data.json";
  const dataPath = "/data/stocks_30.json";

  useEffect(() => {
    const fetchStockTickers = async () => {
      const response = await axios.get(dataPath);
      const tickers = Object.keys(response.data);
      setStockTickers(tickers);
      setStockData(response.data);
    };
    fetchStockTickers();
  }, []);

  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = stockTickers.slice(indexOfFirstStock, indexOfLastStock);

  return (
    <div>
      <div className={styles.cardsWrapper}>
        <div className={styles.cards}>
          {currentStocks.map((ticker, index) => (
            <Card
              key={ticker}
              index={index}
              ticker={ticker}
              stockData={stockData[ticker]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
