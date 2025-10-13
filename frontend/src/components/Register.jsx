import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/config";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export default function Register({ onRegister }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/users/register`, {
                username,
                email,
                password,
            });
            alert("Registered successfully!");
            onRegister(res.data.response.token); // pass token to parent
        } catch (err) {
            alert(err.response?.data?.response || err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-6 border-2 rounded bg-white shadow-md w-full max-w-sm">
                <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit">Register</Button>
            </form>
        </div>
    );
}
