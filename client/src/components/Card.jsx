import * as React from "react";
import styles from "../styles/card.module.css";
import Gylph from "./Glyph";

function Card(props) {
  return (
    <div className={styles.card}>
      <h1 className={styles.stockSymbol}>{props.ticker}</h1>
      <Gylph className="gylph" id={props.index} data={props.stockData} />
    </div>
  );
}

export default React.memo(Card);
