// src/components/Navbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ token, onLogout }) {
    const navigate = useNavigate();

    const linkClass = ({ isActive }) =>
        `p-2 ${isActive ? "underline" : ""}`;

    return (
        <div className="flex justify-center w-full">
            <div className="w-full max-w-2xl p-4">
                <header className="italic text-red-600 items-center">
                    <h1 className="text-5xl flex mb-5">
                        💬 Bitstream{" "}
                        <img
                            className="h-6"
                            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW1nNzV4MXF3aGtvMHVpYTQ0OHg1NjZvbGh1dWczMTY0aWI0bnV2biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mWnDeIKilkwDcrM2VT/giphy.gif"
                            alt=""
                        />
                    </h1>

                    <nav className="flex space-x-2">
                        <NavLink to="/" className={linkClass}>
                            Home
                        </NavLink>

                        {!token ? (
                            <>
                                <NavLink to="/login" className={linkClass}>
                                    Login
                                </NavLink>
                                <NavLink to="/register" className={linkClass}>
                                    Register
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/profile" className={linkClass}>
                                    Profile
                                </NavLink>
                                <button
                                    className="p-2"
                                    onClick={() => {
                                        onLogout();
                                        navigate("/login");
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </nav>
                </header>
            </div>
        </div>
    );
}
