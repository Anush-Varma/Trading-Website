import Nav from "./components/Nav";
import Card from "./components/Card";
// TO DO: HJome page should kinda be siilar to Vijay page
// Make it more visually pleasing.

// Home page should have Login, Search bar, Tutorial,
// Favourites / WatchList, Ability to view and click each
// gylph to enlarge

function HomePage() {
  return (
    <div className="home-page">
      <Nav></Nav>
      <div className="cards">
        <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card>
      </div>
    </div>
  );
}

export default HomePage;
