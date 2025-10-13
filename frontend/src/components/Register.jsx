import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../api/config";

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border-2 rounded">
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Register</button>
        </form>
    );
}
