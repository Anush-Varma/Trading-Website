import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import styles from "../styles/layout.module.css";

function Layout() {
  return (
    <div>
      <Nav />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
