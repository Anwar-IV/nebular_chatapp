import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Welcome } from "../welcome/Welcome";
import styles from "./navbar.module.css";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect } from "react";

export function Navbar() {
  const location = useLocation();
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const signoutHandler = async () => {
    try {
      const response = await fetch("https://nebular-api.herokuapp.com/logout", {
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <>
      <div className={styles.navbarWrapper}>
        <div className={styles.logoWrapper}>
          <Link to="/">
            <h1 className={styles.logoText}>Nebular</h1>
          </Link>
          <img src="/planet.svg" alt="" className={styles.img} />
        </div>
        {user && (
          <button className={styles.signout} onClick={signoutHandler}>
            Sign Out
          </button>
        )}
      </div>
      {location.pathname === "/" ? <Welcome /> : <Outlet />}
    </>
  );
}
