// import "../styles/SearchBar.css";
import SearchButton from "./SearchButton";
import SearchInput from "./SearchInput";

function SearchBar() {
  return (
    <form className="SearchBar">
      <SearchInput name="query" />
      <SearchButton text="Search"></SearchButton>
    </form>
  );
}

export default SearchBar;
