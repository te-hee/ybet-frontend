import React, { useState } from "react";
import { useAuth } from "../../../authContext.tsx";

import styles from "./index.module.css";

interface LoginResponse {
  token: string;
}

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const { setToken } = useAuth();

  const login = async () => {
    console.log(username);
    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) throw new Error("Login failed.");

      const data: LoginResponse = await res.json();
      setToken(data.token);
      console.log("JTW: ", data.token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-card">
      <h2>Log in</h2>
      <input
        placeholder="Username"
        className="login-input"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUsername(e.target.value)
        }
      />
      <button id="login-button" onClick={login} className={styles.button}>
        Log in
      </button>
    </div>
  );
}
