import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const handleLogout = () => setToken(null);

  return (
    <div className="min-h-screen w-full bg-[url(https://img.pikbest.com/origin/09/25/44/89upIkbEsT4yK.jpg!w700wp)] bg-cover bg-center p-6 font-serif">
      <Navbar token={token} onLogout={handleLogout} />
      <main>
        <AppRoutes token={token} onLogin={setToken} />
      </main>
    </div>
  );
}
