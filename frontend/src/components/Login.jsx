import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/config";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

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
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-6 border-2 rounded bg-white shadow-md w-full max-w-sm">
                <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit">Login</Button>
            </form>
        </div>
    );
}
