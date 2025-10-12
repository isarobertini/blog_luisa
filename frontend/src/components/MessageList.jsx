import { useEffect, useState } from "react";
import { fetchMessages, createMessage } from "../api/messages";
import MessageCard from "./MessageCard";
import MessageForm from "./MessageForm";

export default function MessageList() {
    const [messages, setMessages] = useState([]);

    // Fetch existing messages
    useEffect(() => {
        const loadMessages = async () => {
            const res = await fetchMessages();
            const sorted = res.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setMessages(sorted);
        };
        loadMessages();
    }, []);

    // Called when MessageForm submits
    const handleCreateMessage = async (formData) => {
        const res = await createMessage(formData);
        const newMessage = res.data;
        setMessages((prev) => [newMessage, ...prev]); // instantly add to list
    };

    return (
        <div>
            <MessageForm onSubmitMessage={handleCreateMessage} />
            <h2>Messages</h2>
            {messages.map((msg) => (
                <MessageCard key={msg._id} message={msg} />
            ))}
        </div>
    );
}
