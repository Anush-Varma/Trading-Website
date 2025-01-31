import Nav from "../components/Nav";
import Card from "../components/Card";
import "../styles/homePage.css";
import axios from "axios";
import { useEffect, useState } from "react";

function HomePage() {
  const [stockTickers, setStockTickers] = useState([]);
  const [stockData, setStockData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const stocksPerPage = 30;

  useEffect(() => {
    const fetchStockTickers = async () => {
      const response = await axios.get("/data/stocks_30.json");
      const tickers = Object.keys(response.data);
      setStockTickers(tickers);
      setStockData(response.data);
    };
    fetchStockTickers();
  }, []);

  const getStockData = async (ticker) => {
    const response = await axios.get(`/data/stocks_30.json`);
    return response.data[ticker];
  };

  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = stockTickers.slice(indexOfFirstStock, indexOfLastStock);

  return (
    <div className="home-page">
      <Nav></Nav>
      <div className="cards-wrapper">
        <div className="cards">
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
