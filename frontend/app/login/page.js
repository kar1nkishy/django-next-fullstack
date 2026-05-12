'use client';

import { useState } from "react";
import axios from "../../axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
  
    
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("login/", {
        email,
        password,
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
  
      router.push("/account");
    } catch (err) {
      console.log(err.response?.data);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } 
      else if (err.response?.data) {
        const firstError = Object.values(err.response.data).flat()[0];
        setError(firstError || "Invalid credentials");
      } 
      else {
        setError("Login failed. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={login} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#ddd",
  },
  card: {
    width: "300px",
    padding: "30px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
    background: "black",
    color: "white",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
}; 