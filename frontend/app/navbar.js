"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [token, setToken] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    setToken(localStorage.getItem("access_token")); 
  }, [pathname]);

  const logout = () => {
    localStorage.clear();
    setToken(null);
    window.location.href = "/login";
  };

  const itemStyle = {
    padding: "8px 12px",
    margin: "0 5px",
    textDecoration: "none",
    color: "black",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "white",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
      <Link href="/" style={itemStyle}>Home</Link>

      {!token ? (
        <>
          <Link href="/login" style={itemStyle}>Login</Link>
          <Link href="/register" style={itemStyle}>Register</Link>
        </>
      ) : (
        <>
          <Link href="/account" style={itemStyle}>Account</Link>
          <button onClick={logout} style={itemStyle}>Logout</button>
        </>
      )}
    </div>
  );
}
