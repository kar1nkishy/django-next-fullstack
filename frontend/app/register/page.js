"use client";

import { useState } from "react";
import axios from "../../axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const register = async () => {
    try {
      await axios.post("/register/", {
        name,
        email,
        password,
      });

      router.push("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Register</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors({ ...errors, name: null });
          }}
          style={styles.input}
        />
        {errors.name && <div style={styles.error}>{errors.name.join(", ")}</div>}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors({ ...errors, email: null });
          }}
          style={styles.input}
        />
        {errors.email && <div style={styles.error}>{errors.email.join(", ")}</div>}

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors({ ...errors, password: null });
          }}
          style={styles.input}
        />
        {errors.password && <div style={styles.error}>{errors.password.join(", ")}</div>}

        <button onClick={register} style={styles.button}>
          Register
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
    background: "#f5f5f5",
  },
  card: {
    padding: "30px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
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
    fontSize: "12px",
    marginTop: "4px",
    textAlign: "left",
  },
};