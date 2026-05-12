"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Для редиректа
import api from "../../axios"; // Твой настроенный конфиг с baseURL и интерцепторами

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    // Запрашиваем данные через api (заголовок добавится сам, если настроен в axios.js, 
    // но для надежности можно передать вручную)
    api.get("account/", {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Ошибка:", err);
        router.push("/login");
      });
  }, [router]);

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
        background: "#ddd", // Твой серый фон
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

        {/* Твой ЮЗЕР ЛИСТ: показываем кнопку только админу */}
        {user.role === "admin" && (
          <button
            onClick={() => router.push("/users")} // Используем роутер вместо window.location
            style={{
              marginTop: "10px",
              padding: "10px",
              background: "black",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              width: "100%"
            }}
          >
            Manage Users
          </button>
        )}

        <button 
          onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}
          style={{
            marginTop: "10px",
            background: "none",
            color: "red",
            border: "none",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
