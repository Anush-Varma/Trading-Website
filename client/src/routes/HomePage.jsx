import Card from "../components/Card";
import styles from "../styles/HomePage.module.css";
import axios from "axios";
import { SyncProvider } from "../context/SyncContext";
import { useEffect, useState } from "react";
import SyncControl from "../components/syncControl";
import { useMemo } from "react";
import { useCallback } from "react";

function HomePage() {
  const [stockTickers, setStockTickers] = useState([]);
  const [stockData, setStockData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const stocksPerPage = 50;

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

  const { indexOfLastStock, indexOfFirstStock, currentStocks } = useMemo(() => {
    const lastStock = currentPage * stocksPerPage;
    const firstStock = lastStock - stocksPerPage;
    return {
      indexOfLastStock: lastStock,
      indexOfFirstStock: firstStock,
      currentStocks: stockTickers.slice(firstStock, lastStock),
    };
  }, [currentPage, stocksPerPage, stockTickers]);
  return (
    <SyncProvider>
      <div>
        <div className={styles.syncButton}>
          <SyncControl />
        </div>
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
    </SyncProvider>
  );
}

export default HomePage;
