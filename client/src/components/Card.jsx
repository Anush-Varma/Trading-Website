import * as React from "react";
import "../styles/card.css";
import Gylph from "./Gylph";

function Card(props) {
  return (
    <div className="card">
      <h1 className="stock-symbol">{props.ticker}</h1>
      <Gylph className="gylph" id={props.index} data={props.stockData}></Gylph>
    </div>
  );
}

export default Card;
