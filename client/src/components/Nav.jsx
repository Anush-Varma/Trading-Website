import Button from "./Button";
import SearchBar from "./SearchBar";

import styles from "../styles/nav.module.css";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { RiAccountCircleLine } from "react-icons/ri";
import { useEffect, useState, useRef } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaBookOpenReader } from "react-icons/fa6";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  const isQuestionsPage = location.pathname.includes("/Questions");
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (action) => {
    if (isQuestionsPage) {
      toast.error("Please complete the case study.");
      return;
    }
    action();
  };

  const handleProfileClick = () => {
    handleNavigation(() => {
      if (isLoggedIn) {
        setDropdownOpen(!dropdownOpen);
      } else {
        navigate("/SignIn");
      }
    });
  };

  const handleTutorialClick = () => {
    handleNavigation(() => navigate("/Tutorial"));
  };

  const handleHomeButtonClick = () => {
    handleNavigation(() => navigate("/"));
  };

  const handleSignOut = () => {
    if (isQuestionsPage) {
      toast.error("Please complete the case study.");
      return;
    }

    signOut(auth)
      .then(() => {
        toast.success("Signed Out");
        setDropdownOpen(false);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error signing out");
      });
  };

  const handleSearch = (searchTerm) => {
    if (isHomePage) {
      if (searchTerm.trim() === "") {
        // If search is empty, remove the query parameter
        searchParams.delete("q");
      } else {
        // Otherwise set the query parameter
        searchParams.set("q", searchTerm);
      }

      setSearchParams(searchParams);
    } else {
      toast.error("Cannot search from this page.");
    }
  };

  return (
    <div className={styles.navBar}>
      <Toaster position="bottom-left" reverseOrder={false} />
      <div className={styles.left}>
        <button
          className={styles.logoButton}
          onClick={handleHomeButtonClick}
          aria-label="StockSage Home"
        >
          <FaArrowTrendUp size={40} />
          <span className={styles.logoText}>StockSage</span>
        </button>
        <button
          className={styles.navButton}
          onClick={handleTutorialClick}
          aria-label="Tutorial"
        >
          <FaBookOpenReader size={40} />
          <span className={styles.buttonText}>Tutorial</span>
        </button>
      </div>
      <div className={styles.centerSection}>
        <SearchBar
          onSearch={handleSearch}
          initialValue={searchTerm}
          disabled={!isHomePage}
        />
      </div>
      <div className={styles.right}>
        <div className={styles.profileContainer} ref={dropdownRef}>
          <button
            className={styles.profileButton}
            onClick={handleProfileClick}
            aria-label="Profile"
          >
            <RiAccountCircleLine size={24} />
          </button>
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <button className={styles.dropdownItem} onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
