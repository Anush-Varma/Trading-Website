import Button from "./Button";
import "../styles/nav.css";

function Nav() {
  return (
    <div className="nav-bar">
      <div className="left">
        <Button text="StockSage"></Button>
        <Button text="Tutorial"></Button>
        <Button text="Watch List"></Button>
      </div>
      <div className="right">
        <Button text="Login"></Button>
        <Button text="Sign Up"></Button>
      </div>
      {/*  */}
    </div>
  );
}

export default Nav;
