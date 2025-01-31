import { Outlet } from "react-router-dom";
import Nav from "./Nav";

function Layout() {
  return (
    <div>
      <Nav />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
