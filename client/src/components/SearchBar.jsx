import styles from "../styles/searchBar.module.css";

import SearchInput from "./SearchInput";

function SearchBar() {
  return (
    <form className={styles.SearchBar}>
      <SearchInput name="query" />
    </form>
  );
}

export default SearchBar;
