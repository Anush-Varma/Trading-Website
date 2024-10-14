import "../styles/searchButton.css";

function SearchButton(props) {
  return <button className="search-button">{props.text}</button>;
}

export default SearchButton;
