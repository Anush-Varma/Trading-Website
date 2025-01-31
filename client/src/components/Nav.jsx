import Button from "./Button";
import SearchBar from "./SearchBar";

import "../styles/nav.css";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();

  const handleTutorialClick = () => {
    navigate("/Tutorial");
  };

  const handleHomeButtonClick = () => {
    navigate("/");
  };

  return (
    <div className="nav-bar">
      <div className="left">
        <Button text="StockSage" onClick={handleHomeButtonClick}></Button>
        <Button text="Watch List"></Button>
      </div>
      <div className="center-section">
        <SearchBar></SearchBar>
      </div>
      <div className="right">
        <Button text="Tutorial" onClick={handleTutorialClick}></Button>
        <Button text="Sign Up"></Button>
        <Button text="Profile"></Button>
      </div>
      {/* Have card like components where the cards can expand and 
      shrink depending on if gylph is clicked and expand with larger graphs
        */}
    </div>
  );
}

export default Nav;
