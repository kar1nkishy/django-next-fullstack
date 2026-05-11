"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AccountPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("Bearer_token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/account/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("Bearer_token");
        window.location.href = "/login";
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("Bearer_token");
    window.location.href = "/login";
  };

  if (!user) {
    return <h1 style={{ textAlign: "center" }}>Loading...</h1>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#ddd",
      }}
    >
      <div
        style={{
          padding: "30px",
          borderRadius: "12px",
          background: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h2>Account</h2>

        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
      </div>
    </div>
  );
}