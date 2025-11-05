import { Routes, Route } from "react-router-dom";
import MessageList from "./components/Posts/MessageList";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Profile from "./components/Auth/Profile";

export default function AppRoutes({ token, onLogin }) {
    return (
        <Routes>
            <Route path="/" element={<MessageList token={token} />} />
            <Route path="/login" element={<Login onLogin={onLogin} />} />
            <Route path="/register" element={<Register onRegister={onLogin} />} />
            <Route path="/profile" element={<Profile token={token} />} />
        </Routes>
    );
}
