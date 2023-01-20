import { Link, Outlet, useLocation } from "react-router-dom";
import { Welcome } from "../welcome/Welcome";
import styles from "./navbar.module.css";

export function Navbar() {
  const location = useLocation();
  console.log({ location });
  return (
    <>
      <div className={styles.navbarWrapper}>
        <div className={styles.logoWrapper}>
          <Link to="/">
            <h1 className={styles.logoText}>Nebular</h1>
          </Link>
          <img src="/planet.svg" alt="" className={styles.img} />
        </div>
      </div>
      {location.pathname === "/" ? <Welcome /> : <Outlet />}
    </>
  );
}
