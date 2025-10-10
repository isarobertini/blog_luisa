import { useEffect, useState } from "react";
import { fetchMessages } from "../api/messages";
import MessageCard from "./MessageCard";

export default function MessageList() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages().then((res) => setMessages(res.data));
    }, []);

    const addMessage = (msg) => setMessages((prev) => [msg, ...prev]);

    return (
        <div className="">
            <h2>Messages</h2>
            {messages.map((msg) => (
                <MessageCard key={msg._id} message={msg} />
            ))}
        </div>
    );
}
