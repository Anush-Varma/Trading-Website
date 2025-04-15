import Card from "../components/Card";
import styles from "../styles/homePage.module.css";
import axios from "axios";
import { SyncProvider } from "../context/SyncContext";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import SyncControl from "../components/syncControl";
import { useSearchParams } from "react-router-dom";

function HomePage() {
  const [stockTickers, setStockTickers] = useState([]);
  const [stockData, setStockData] = useState({});
  const [visibleStocks, setVisibleStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filteredTickers, setFilteredTickers] = useState([]);

  const observerRef = useRef(null);
  const cardRefs = useRef({});
  const containerRef = useRef(null);

  const initialBatchSize = 28;
  const batchSize = 28;

  const dataPath = "/data/stocks_200.json";

  const searchQuery = searchParams.get("q") || "";

  const setupObserver = () => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            visibleStocks.length < filteredTickers.length
          ) {
            const nextBatch = filteredTickers.slice(
              visibleStocks.length,
              visibleStocks.length + batchSize
            );
            setVisibleStocks((prev) => [...prev, ...nextBatch]);
          }
        });
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const lastCardIndex = visibleStocks.length - 1;
    if (lastCardIndex >= 0 && cardRefs.current[lastCardIndex]) {
      observerRef.current.observe(cardRefs.current[lastCardIndex]);
    }
  };

  useEffect(() => {
    if (!stockTickers.length) return;

    const filtered = searchQuery
      ? stockTickers.filter((ticker) =>
          ticker.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : stockTickers;

    setFilteredTickers(filtered);

    setVisibleStocks(filtered.slice(0, initialBatchSize));

    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, [stockTickers, searchQuery]);

  useEffect(() => {
    const fetchStockTickers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(dataPath);
        const tickers = Object.keys(response.data);
        setStockTickers(tickers);
        setFilteredTickers(tickers);
        setStockData(response.data);
      } catch (error) {
        console.error("Error fetching stock tickers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStockTickers();
  }, []);

  useEffect(() => {
    if (!filteredTickers.length) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    setupObserver();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleStocks, filteredTickers]);

  return (
    <SyncProvider>
      <div>
        <div className={styles.syncButton}>
          <SyncControl />
        </div>
        <div className={styles.cardsWrapper}>
          <div className={styles.cards} ref={containerRef}>
            {loading ? (
              <div className={styles.loading}>Loading stocks...</div>
            ) : (
              visibleStocks.map((ticker, index) => (
                <Card
                  key={ticker}
                  index={index}
                  ticker={ticker}
                  stockData={stockData[ticker]}
                  ref={(el) => {
                    if (el) cardRefs.current[index] = el;
                  }}
                  data-index={index}
                />
              ))
            )}
            {!loading && visibleStocks.length < stockTickers.length && (
              <div
                className={styles.loadingMore}
                ref={(el) => {
                  if (el && observerRef.current) {
                    observerRef.current.observe(el);
                  }
                }}
              ></div>
            )}
          </div>
        </div>
      </div>
    </SyncProvider>
  );
}

export default HomePage;
