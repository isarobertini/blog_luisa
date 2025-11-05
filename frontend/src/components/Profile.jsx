import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../api/config";
import MessageCard from "./MessageCard";


export default function Profile({ token }) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!token) return;

        const loadProfile = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/messages/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const messages = res.data.response.messages || [];
                const rawReposts = res.data.response.reposts || [];

                // Normalize reposts to have the same shape as messages
                const reposts = rawReposts.map(r => {
                    // r.originalMessage should be the full message object
                    const original = r.originalMessage;
                    return {
                        ...original,
                        _id: r._id || original._id, // use repost ID if available
                        repost: { originalAuthor: original.author },
                    };
                });

                const allMessages = [...messages, ...reposts].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setProfile({ ...res.data.response, messages: allMessages });
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };

        loadProfile();
    }, [token]);

    const handleMessageDeleted = (messageId) => {
        setProfile(prev => ({
            ...prev,
            messages: prev.messages.filter(msg => msg._id !== messageId),
        }));
    };

    const handleMessageReposted = (newRepost) => {
        setProfile(prev => ({
            ...prev,
            messages: [newRepost, ...prev.messages.filter(msg => msg._id !== newRepost._id)],
        }));
    };

    if (!profile) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h2 className="text-red-500 text-2xl font-bold mb-2">{profile.username}'s Profile</h2>
            <p className="text-red-500 mb-4">Email: {profile.email}</p>
            <h3 className="text-red-500 text-xl font-semibold mb-2">Your posts:</h3>
            {profile.messages.length === 0 && <p>No messages yet.</p>}
            {profile.messages.map(msg => (
                <MessageCard
                    key={msg._id}
                    message={msg}
                    token={token}
                    onMessageDeleted={handleMessageDeleted}
                    onMessageReposted={handleMessageReposted}
                />
            ))}
        </div>
    );
}
