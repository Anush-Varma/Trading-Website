import Nav from "./components/Nav";
import Card from "./components/Card";
import "./styles/homePage.css";

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
