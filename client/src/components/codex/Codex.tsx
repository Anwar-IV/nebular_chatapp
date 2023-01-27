import { useEffect, useRef } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useMessageCtx } from "../../context/MessageContext";
import { CodexMessageType } from "../dashboard/Dashboard";
import styles from "./codex.module.css";

type CodexProps = {
  messages: CodexMessageType[];
  codexThinking: boolean;
};
let loadInterval: any;
export function Codex({ messages, codexThinking }: CodexProps) {
  const loadRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const messageRef = useRef<HTMLDivElement>({} as HTMLDivElement);

  useEffect(() => {
    messages.length > 0 && messageRef.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    if (!codexThinking) return;
    loadRef.current!.textContent = "";

    loadInterval = setInterval(() => {
      if (loadRef.current!.textContent !== "...") {
        loadRef.current!.textContent += ".";
      } else {
        loadRef.current!.textContent = "";
      }
    }, 300);
    return () => clearInterval(loadInterval);
  }, [codexThinking]);

  return (
    <>
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index} ref={messageRef}>
            {msg.msg === "load" && codexThinking ? (
              <p ref={loadRef} className={styles.loader}></p>
            ) : (
              <div
                className={`${styles.message} ${
                  msg.sender === "me" ? styles.sentByMe : styles.sentByNotMe
                }`}
              >
                <p className={styles.date}>
                  {msg.sender === "me" ? "You" : "Codex"}
                </p>
                <p className={styles.mainBody}>{msg.msg}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className={styles.mainBody}>Ask Codex a question...</div>
      )}
    </>
  );
}
