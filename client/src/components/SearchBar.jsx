import "../styles/SearchBar.css";

import SearchInput from "./SearchInput";

function SearchBar() {
  return (
    <form className="SearchBar">
      <SearchInput name="query" />
    </form>
  );
}

export default SearchBar;
