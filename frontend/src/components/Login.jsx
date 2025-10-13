import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/config";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usernameOrEmail: username, password }),
        });
        const data = await res.json();
        if (data.success && data.response?.token) {
            onLogin(data.response.token);
            navigate("/");
        } else {
            alert("Login failed");
        }
    };

    return (
        <div className="bg-white">
            <form onSubmit={handleSubmit}>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
