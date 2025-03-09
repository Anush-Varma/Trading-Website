import Button from "./Button";
import SearchBar from "./SearchBar";

import "../styles/nav.css";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

function Nav() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleTutorialClick = () => {
    navigate("/Tutorial");
  };

  const handleHomeButtonClick = () => {
    navigate("/");
  };

  const handleSignInButtonClick = () => {
    navigate("/SignIn");
  };

  const handleSignOutButtonClick = () => {
    if (auth.currentUser) {
      signOut(auth)
        .then(() => {
          alert("Signed Out");
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate("/SignIn");
    }
  };

  return (
    <div className="nav-bar">
      <div className="left">
        <Button text="StockSage" onClick={handleHomeButtonClick}></Button>
        <Button text="Tutorial" onClick={handleTutorialClick}></Button>
      </div>
      <div className="center-section">
        <SearchBar></SearchBar>
      </div>
      <div className="right">
        <Button text="Sign In" onClick={handleSignInButtonClick}></Button>
        <Button text="Sign Out" onClick={handleSignOutButtonClick}></Button>
      </div>
    </div>
  );
}

export default Nav;
