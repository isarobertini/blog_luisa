import { Routes, Route } from "react-router-dom";
import MessageList from "./components/MessageList";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";

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
