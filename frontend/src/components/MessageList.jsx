import { useEffect, useState } from "react";
import { fetchMessages, createMessage } from "../api/messages";
import MessageCard from "./MessageCard";
import MessageForm from "./MessageForm";

export default function MessageList({ token, BASE_URL }) {
    const [messages, setMessages] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5); // show first 5 initially
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadMessages = async () => {
            setLoading(true);
            try {
                const res = await fetchMessages(token);
                const sorted = res.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setMessages(sorted);
            } catch (err) {
                console.error("Failed to load messages", err);
            } finally {
                setLoading(false);
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


    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 5); // load 5 more messages
    };


    return (
        <div className="flex justify-center w-full">
            <div className="w-full max-w-2xl p-4">
                <MessageForm onSubmitMessage={handleCreateMessage} />

                <h2 className="text-red-500 text-xl py-4">Messages</h2>

                {loading && <p>Loading messages...</p>}

                {messages.slice(0, visibleCount).map(msg => (
                    <MessageCard
                        key={msg._id}
                        BASE_URL={BASE_URL}
                        message={msg}
                        token={token}
                        onMessageDeleted={(id) => setMessages(prev => prev.filter(m => m._id !== id))}
                    />
                ))}

                {visibleCount < messages.length && (
                    <button
                        className="border p-2 bg-white rounded mt-4"
                        onClick={handleLoadMore}
                    >
                        Load More
                    </button>
                )}

                {messages.length === 0 && !loading && <p>No messages yet.</p>}
            </div>
        </div>
    );
}
