import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../authContext.tsx";

import styles from "./index.module.css";

export default function Input() {
  const [message, setMessage] = useState<string>("");
  const { token } = useAuth();

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await axios.post(
        "/api/messages",
        {
          content: message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.main}>
      <input
        type="text"
        placeholder="Enter message..."
        value={message}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
          e.key === "Enter" && sendMessage()
        }
      />
    </div>
  );
}
