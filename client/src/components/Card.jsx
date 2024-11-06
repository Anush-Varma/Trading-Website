import "../styles/card.css";
import Gylph from "./Gylph";

function Card(props) {
  return (
    <div className="card">
      <h1 className="stock-symbol">Stock Name</h1>
      <Gylph id={props.index}></Gylph>
    </div>
  );
}

export default Card;
