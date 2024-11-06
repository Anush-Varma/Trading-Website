import Nav from "./components/Nav";
import Card from "./components/Card";
import "./styles/homePage.css";
// TO DO: HJome page should kinda be siilar to Vijay page
// Make it more visually pleasing.

// Home page should have Login, Search bar, Tutorial,
// Favourites / WatchList, Ability to view and click each
// gylph to enlarge

function HomePage() {
  const cardCount = Array.from({ length: 5 });

  return (
    <div className="home-page">
      <Nav></Nav>
      <div className="cards-wrapper">
        <div className="cards">
          {cardCount.map((_, index) => (
            <Card key={index} index={index}></Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
