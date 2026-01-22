import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/config";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

// Register component
export default function Register({ onRegister }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            // Send registration data
            const res = await axios.post(`${BASE_URL}/users/register`, {
                username,
                email,
                password,
            });

            if (res.data?.response?.token) {
                onRegister(res.data.response.token); // Pass token to parent
            } else {
                setError(res.data.response || "Registration failed"); // Show backend error
            }
        } catch (err) {
            setError(err.response?.data?.response || "Network error. Please try again."); // Show error
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 p-6 border-2 rounded shadow-md w-full max-w-sm bg-gray-300"
            >
                <h2 className="text-red-600 font-bold">Register</h2>

                {error && (
                    <div className="text-red-600 font-medium text-sm p-2 bg-red-100 rounded">
                        {error}
                    </div>
                )}

                <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit">Register</Button>
            </form>
        </div>
    );
}
