import { useEffect, useState } from "react";
import { fetchMessages, createMessage } from "../../api/messages";
import MessageCard from "./MessageCard";
import MessageForm from "./MessageForm";

export default function MessageList({ token }) {
    const [messages, setMessages] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);
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

    const handleLoadMore = () => setVisibleCount(prev => prev + 5);

    return (
        <div className="flex justify-center w-full px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="w-full max-w-3xl flex flex-col gap-4">
                <MessageForm onSubmitMessage={handleCreateMessage} />

                <h2 className="text-red-500 text-2xl font-bold py-2 text-center">Messages</h2>

                {loading && <p className="text-center text-gray-500">Loading messages...</p>}

                <div className="flex flex-col gap-4">
                    {messages.slice(0, visibleCount).map(msg => (
                        <MessageCard
                            key={msg._id}
                            message={msg}
                            token={token}
                            onMessageDeleted={(id) =>
                                setMessages(prev => prev.filter(m => m._id !== id))
                            }
                            onMessageReposted={(newRepost) =>
                                setMessages(prev => [newRepost, ...prev])
                            }
                        />
                    ))}
                </div>

                {visibleCount < messages.length && (
                    <button
                        className="mx-auto mt-4 px-4 py-2 bg-white border rounded shadow hover:bg-gray-100 transition"
                        onClick={handleLoadMore}
                    >
                        Load More
                    </button>
                )}

                {messages.length === 0 && !loading && (
                    <p className="text-center text-gray-500">No messages yet.</p>
                )}
            </div>
        </div>
    );
}
