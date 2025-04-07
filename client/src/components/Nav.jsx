import Button from "./Button";
import SearchBar from "./SearchBar";

import styles from "../styles/nav.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  const isQuestionsPage = location.pathname.includes("/Questions");

  const handleNavigation = (action) => {
    if (isQuestionsPage) {
      toast.error("Please complete the case study.");
      return;
    }
    action();
  };

  const handleTutorialClick = () => {
    handleNavigation(() => navigate("/Tutorial"));
  };

  const handleHomeButtonClick = () => {
    handleNavigation(() => navigate("/"));
  };

  const handleSignInButtonClick = () => {
    handleNavigation(() => {
      navigate("/SignIn");
    });
  };

  const handleSignOutButtonClick = () => {
    if (isQuestionsPage) {
      toast.error("Please complete the case study.");
      return;
    }

    if (auth.currentUser) {
      signOut(auth)
        .then(() => {
          toast.success("Signed Out");
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
    <div className={styles.navBar}>
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className={styles.left}>
        <Button text="StockSage" onClick={handleHomeButtonClick}></Button>
        <Button text="Tutorial" onClick={handleTutorialClick}></Button>
      </div>
      <div className={styles.centerSection}>
        <SearchBar></SearchBar>
      </div>
      <div className={styles.right}>
        <Button text="Sign In" onClick={handleSignInButtonClick}></Button>
        <Button text="Sign Out" onClick={handleSignOutButtonClick}></Button>
      </div>
    </div>
  );
}

export default Nav;
