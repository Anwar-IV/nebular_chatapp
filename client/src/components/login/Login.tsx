import styles from "./login.module.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Login() {
  const { loginUser, user, loginError, setLoginError } = useAuthContext();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsername("");
    setPassword("");
    if (username.length < 4 || password.length < 8) {
      return setLoginError({ status: 400, message: "Incorrect Credentials" });
    }
    console.log("It got here :0");
    loginUser(username, password);
  };
  const handleError = () => {
    if (loginError && loginError.status < 504) {
      return loginError.message;
    } else if (loginError && loginError.status === 504) {
      return "Sorry, an unexpected Error has occured";
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (username.length > 2 || password.length > 2) {
      setLoginError(null);
    }
  }, [username, password]);

  useEffect(() => {
    if (user) {
      navigate(`/user/${user._id}`);
    }
  }, [user]);

  return (
    <div className={styles.wrapper}>
      {loginError && <div className={styles.error}>{handleError()}</div>}
      <form className={styles.form} onSubmit={handleLogin}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className={styles.registerBtn}
        >
          <Link to={"/register"}>Register instead</Link>
        </motion.div>
        <motion.div
          initial={{ x: -1500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 150 }}
          className={styles.formControl}
        >
          <input
            type="text"
            placeholder="Enter your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </motion.div>
        <motion.div
          className={styles.formControl}
          initial={{ x: 1500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.4,
            type: "spring",
            stiffness: 150,
          }}
        >
          <input
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </motion.div>
        {username.length > 0 && password.length > 0 ? (
          <button className={styles.btn}>Login</button>
        ) : null}
      </form>
    </div>
  );
}
