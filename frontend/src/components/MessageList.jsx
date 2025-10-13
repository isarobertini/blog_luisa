import { useEffect, useState } from "react";
import { fetchMessages, createMessage } from "../api/messages";
import MessageCard from "./MessageCard";
import MessageForm from "./MessageForm";

export default function MessageList({ token }) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const res = await fetchMessages(token);
                const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setMessages(sorted);
            } catch (err) {
                console.error("Failed to load messages", err);
            }
        };
        loadMessages();
    }, [token]);

    const handleCreateMessage = async (formData) => {
        try {
            const res = await createMessage(formData, token);
            setMessages(prev => [res.data, ...prev]);
        } catch (err) {
            console.error("Failed to create message", err);
            alert("You must be logged in to post messages");
        }
    };

    return (
        <div className="">
            <MessageForm onSubmitMessage={handleCreateMessage} />
            <h2>Messages</h2>
            {messages.map(msg => (
                <MessageCard key={msg._id} message={msg} token={token} onMessageDeleted={(id) => setMessages(prev => prev.filter(m => m._id !== id))} />
            ))}
        </div>
    );
}
