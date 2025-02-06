import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import "../styles/layout.css";

function Layout() {
  return (
    <div>
      <Nav />
      <main className="mainContent">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
