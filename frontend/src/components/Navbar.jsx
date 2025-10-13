// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ token, onLogout }) {
    const navigate = useNavigate();

    return (
        <header className="italic text-red-600 items-center">
            <h1 className="text-5xl flex mb-5">💬 Bitstream  <img className="h-6" src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW1nNzV4MXF3aGtvMHVpYTQ0OHg1NjZvbGh1dWczMTY0aWI0bnV2biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mWnDeIKilkwDcrM2VT/giphy.gif" alt="" />
            </h1>

            <button className="p-2" onClick={() => navigate("/")}>Home</button>

            {!token ? (
                <>
                    <button className="p-2" onClick={() => navigate("/login")}>Login</button>
                    <button className="p-2" onClick={() => navigate("/register")}>Register</button>
                </>
            ) : (
                <>
                    <button className="p-2" onClick={() => navigate("/profile")}>Profile</button>
                    <button className="p-2"
                        onClick={() => {
                            onLogout();
                            navigate("/login");
                        }}
                    >
                        Logout
                    </button>
                </>
            )}
        </header>
    );
}
