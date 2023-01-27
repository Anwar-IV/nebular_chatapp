import styles from "./register.module.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function Register() {
  const { registerUser, registerError, setRegisterError, user } =
    useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    registerUser(username, password);
  };
  const handleError = () => {
    if (registerError && registerError.status < 504) {
      return registerError.message;
    } else if (registerError && registerError.status === 504) {
      return "Sorry, an unexpected Error has occured";
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (
      username.length > 2 ||
      password.length > 2 ||
      confirmPassword.length > 2
    ) {
      setRegisterError(null);
    }
  }, [username, password]);

  useEffect(() => {
    if (user) {
      navigate(`/user/${user._id}`);
    }
  }, [user]);

  const validate = () => {
    if (
      username.length > 3 &&
      password.length > 7 &&
      password === confirmPassword
    ) {
      return "VALID";
    } else if (
      username.length > 0 ||
      password.length > 0 ||
      confirmPassword.length > 0
    ) {
      return "WARN";
    }
  };
  return (
    <div className={styles.wrapper}>
      {registerError && <div className={styles.error}>{handleError()}</div>}
      <form className={styles.form} onSubmit={handleRegister}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className={styles.loginBtn}
        >
          <Link to={"/login"}>Login instead</Link>
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
        <motion.div
          className={styles.formControl}
          initial={{ x: -1500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.8,
            type: "spring",
            stiffness: 150,
          }}
        >
          <input
            type="password"
            placeholder="Confirm your password..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </motion.div>

        {validate() === "WARN" ? (
          <div className={styles.warning}>
            <p>
              Username length:{" "}
              <span className={username.length < 4 ? styles.red : styles.green}>
                {username.length}
              </span>
              /4
            </p>
            <p>
              Password length:{" "}
              <span className={password.length < 8 ? styles.red : styles.green}>
                {password.length}
              </span>
              /8
            </p>
            <p>
              Passwords' match:{" "}
              <span
                className={
                  password === confirmPassword ? styles.green : styles.red
                }
              >
                {password === confirmPassword ? "True" : "False"}
              </span>
            </p>
          </div>
        ) : validate() === "VALID" ? (
          <button className={styles.btn} type="submit">
            Register
          </button>
        ) : null}
      </form>
    </div>
  );
}
