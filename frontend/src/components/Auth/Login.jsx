import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/config";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

// Login component
export default function Login({ onLogin }) {
    const [username, setUsername] = useState(""); // Username or email
    const [password, setPassword] = useState(""); // Password
    const [error, setError] = useState(""); // Error message
    const navigate = useNavigate(); // Router navigation

    // Submit login form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            // Send login request to backend
            const res = await fetch(`${BASE_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usernameOrEmail: username, password }),
            });

            const data = await res.json();

            // If login successful, store token and navigate home
            if (res.ok && data.response?.token) {
                onLogin(data.response.token);
                navigate("/");
            } else {
                setError(data.response || "Login failed"); // Show backend error
            }
        } catch (err) {
            setError("Network error. Please try again."); // Show network error
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 p-6 border-2 rounded shadow-md w-full max-w-sm bg-gray-300"
            >
                <h2 className="text-red-600 font-bold">Login</h2>

                {error && (
                    <div className="text-red-600 font-medium text-sm p-2 bg-red-100 rounded">
                        {error}
                    </div>
                )}

                <Input
                    placeholder="Username or Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit">Login</Button>
            </form>
        </div>
    );
}
