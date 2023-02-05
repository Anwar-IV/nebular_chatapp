import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import styles from "./dashboard.module.css";
import { FiSend } from "react-icons/fi";
import { useMessageCtx } from "../../context/MessageContext";
import { Nebulon } from "../nebulon/Nebulon";
import { Codex } from "../codex/Codex";

export type CodexMessageType = {
  sender?: "me" | "codex";
  msg: string;
};

export function Dashboard() {
  const navigate = useNavigate();
  const { socket, sendMessage } = useMessageCtx();
  const { getUser, user } = useAuthContext();
  const [message, setMessage] = useState<string>("");
  const [isNebulon, setIsNebulon] = useState<boolean>(true);
  const [codexMessages, setCodexMessages] = useState<CodexMessageType[]>([]);
  const [codexThinking, setCodexThinking] = useState<boolean>(false);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  const messageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isNebulon) {
      setMessage("");
      sendMessage(user?._id!, "Nebulon", message);
    } else {
      try {
        setCodexMessages((prev) => [...prev, { sender: "me", msg: message }]);
        setMessage("");
        setCodexThinking(true);
        setCodexMessages((prev) => [...prev, { msg: "load" }]);
        const payload = JSON.stringify({ prompt: message });
        const response = await fetch("http://localhost:5500/codex", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: payload,
        });
        const data = await response.json();
        setCodexThinking(false);
        setCodexMessages((prev) => prev.filter((msg) => msg.msg !== "load"));
        setCodexMessages((prev) => [...prev, { msg: data, sender: "codex" }]);
      } catch (error) {
        console.log(error);
        setCodexThinking(false);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.messageBox}>
          <div className={styles.messageControl}>
            <div className={styles.messageChoice}>
              <p
                className={`${styles.nebulon} ${
                  isNebulon ? styles.nebulonSelected : styles.notSelected
                }`}
                onClick={() => setIsNebulon(true)}
              >
                Nebulon
              </p>
              <p
                className={`${styles.codex} ${
                  isNebulon ? styles.notSelected : styles.codexSelected
                }`}
                onClick={() => setIsNebulon(false)}
              >
                Codex Corner
              </p>
            </div>
            <p className={styles.welcomeMsg}>Welcome {user?.username}</p>
          </div>
          <div
            className={`${styles.messageScreen} ${
              isNebulon ? styles.nebulonTurn : styles.codexTurn
            }`}
          >
            {isNebulon ? (
              <Nebulon />
            ) : (
              <Codex messages={codexMessages} codexThinking={codexThinking} />
            )}
          </div>
        </div>
        <form className={styles.form} onSubmit={messageHandler}>
          <input
            type="text"
            placeholder="Enter a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className={styles.btn}>
            <FiSend
              size={30}
              style={{ marginTop: "8px", marginRight: "5px" }}
              color="rgb(0, 255, 166)"
            />
          </button>
        </form>
      </div>
    </div>
  );
}
