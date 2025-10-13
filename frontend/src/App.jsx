import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MessageList from "./components/MessageList";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar"; // ✅ import
import "./app.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const handleLogout = () => setToken(null);

  return (
    <div className="p-6 font-serif bg-[url(https://img.pikbest.com/origin/09/25/44/89upIkbEsT4yK.jpg!w700wp)]">
      <Navbar token={token} onLogout={handleLogout} />


      <main className="">
        <Routes>
          <Route path="/" element={<MessageList token={token} />} />
          <Route path="/login" element={<Login onLogin={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile token={token} />} />
        </Routes>
      </main>
    </div>
  );
}
