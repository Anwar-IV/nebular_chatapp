import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./welcome.module.css";
import { anticipate, motion } from "framer-motion";

const welcomeTitle = `Welcome to Nebular`;

export function Welcome() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < welcomeTitle.length) {
        titleRef!.current!.textContent! += welcomeTitle[index];
        index++;
      }
    }, 100);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 1.9,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
  const item2 = {
    hidden: { opacity: 0, color: "#333333" },
    show: {
      opacity: 1,
      color: ["#11ffcc", "#ffffff", "#11ffcc", "#ffffff", "#11ffcc"],
      textShadow: [
        "0 0 5 rgb(0,225,220,)",
        "0 0 13px rgb(0, 255, 220)",
        "0 0 5px rgb(0,255,220,)",
        "0 0 13px rgb(0, 255, 220)",
      ],
    },
  };

  return (
    <div className={styles.wrapper}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={styles.card}
      >
        <motion.h1
          variants={item}
          ref={titleRef}
          className={styles.welcomeTitle}
        ></motion.h1>
        <motion.div>
          <motion.h1 variants={item2} className={styles.supplementaryTitle}>
            The Extraterrestrial Chat App
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.7 }}
            className={styles.options}
          >
            <p>
              Are you new here? <Link to="/register">Sign Up</Link>
            </p>
            <p>
              Have an account with us? <Link to="/login">Login</Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
