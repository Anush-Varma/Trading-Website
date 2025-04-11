import styles from "../styles/searchBar.module.css";
import { FaSearch } from "react-icons/fa";
import React, { useState, useEffect } from "react";

function SearchBar({ onSearch, initialValue, disabled }) {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Call the onSearch prop as the user types
    onSearch(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This ensures the search is triggered on form submission as well
    onSearch(searchTerm);
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.searchBox}>
          <input
            type="text"
            className={`${styles.searchInput} ${
              disabled ? styles.disabledSearch : ""
            }`}
            placeholder="Search"
            value={searchTerm}
            disabled={disabled}
            onChange={handleChange}
          />
          <button
            type="submit"
            className={`${styles.searchButton} ${
              disabled ? styles.disabledButton : ""
            }`}
            disabled={disabled}
          >
            <FaSearch className={styles.searchIcon} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
