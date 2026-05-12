"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 1. ИСПРАВЛЕНО: Добавлен импорт
import api from "../../axios"; // 2. ИСПРАВЛЕНО: Используем 'api', который мы настраивали

export default function UsersPage() {
  const router = useRouter(); // 3. ИСПРАВЛЕНО: Объявлен роутер
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Убираем начальные слэши, чтобы axios склеивал пути правильно
        const userRes = await api.get("account/", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (userRes.data.role !== "admin") {
          router.push("/account");
          return;
        }

        const usersRes = await api.get("users/", {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // DRF может возвращать массив напрямую или объект с results
        const data = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.results;
        setUsers(data || []);
        
      } catch (err) {
        console.error("Ошибка доступа:", err);
        router.push("/account"); // Если не админ, просто уводим отсюда
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <h1 style={{ textAlign: "center" }}>Loading users...</h1>;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Users list</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.id || index}>
              <td style={styles.td}>{u.id}</td>
              <td style={styles.td}>{u.name}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>{u.role}</td>
            </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  th: {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#000",
    color: "#fff"
  },
  td: {
    border: "1px solid #ddd",
    padding: "12px",
  },
};
