import { useEffect, useRef } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useMessageCtx } from "../../context/MessageContext";
import styles from "./nebulon.module.css";

export function Nebulon() {
  const { nebulonMessages, socket } = useMessageCtx();
  const { user } = useAuthContext();
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView();
  }, [nebulonMessages]);

  return (
    <>
      {nebulonMessages.length > 0 ? (
        nebulonMessages.map((msg) => (
          <div
            ref={messageRef}
            className={`${styles.message} ${
              msg.username === user?.username
                ? styles.sentByMe
                : styles.sentByNotMe
            }`}
            key={msg.id}
          >
            <p className={styles.date}>
              {new Intl.DateTimeFormat("en-GB", {
                timeStyle: "medium",
                dateStyle: "medium",
              }).format(new Date(msg.sentAt))}
            </p>
            <p className={styles.mainBody}>{msg.message}</p>

            <p className={styles.sender}>
              sent by {msg.username === user?.username ? "You" : msg.username}
            </p>
          </div>
        ))
      ) : (
        <div>No messages currently</div>
      )}
    </>
  );
}
