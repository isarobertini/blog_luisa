import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/config";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

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
            alert("Login successful!");
            navigate("/");
        } else {
            alert("Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="flex bg-gray-300 flex-col gap-2 p-6 border-2 rounded shadow-md w-full max-w-sm">
                <h2 className="text-red-600 font-bold">Login</h2>
                <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit">Login</Button>
            </form>
        </div>
    );
}
