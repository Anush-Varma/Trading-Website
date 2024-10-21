import "../styles/card.css";
import Gylph from "./Gylph";

function Card() {
  return (
    <div className="card">
      <h1 className="stock-symbol">Stock Name</h1>
      <Gylph></Gylph>
    </div>
  );
}

export default Card;
