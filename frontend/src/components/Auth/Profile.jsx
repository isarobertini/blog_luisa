import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../api/config";
import MessageCard from "../Posts/MessageCard";

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
                const reposts = (res.data.response.reposts || []).map(r => ({
                    ...r.originalMessage,
                    _id: r._id || r.originalMessage._id,
                    repost: { originalAuthor: r.originalMessage.author },
                }));

                setProfile({
                    ...res.data.response,
                    messages: [...messages, ...reposts].sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    ),
                });
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

    if (!profile) return <p className="text-center mt-4">Loading profile...</p>;

    return (
        <div className="flex justify-center w-full px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="w-full max-w-3xl flex flex-col gap-4">
                <div className="text-center mb-4">
                    <h2 className="text-red-500 text-3xl font-bold">{profile.username}</h2>
                    <p className="text-red-500 text-sm">Email: {profile.email}</p>
                </div>

                <h3 className="text-red-500 text-xl font-semibold mb-2 text-center">Your posts:</h3>

                {profile.messages.length === 0 ? (
                    <p className="text-center text-gray-500">No messages yet.</p>
                ) : (
                    profile.messages.map(msg => (
                        <MessageCard
                            key={msg._id}
                            message={msg}
                            token={token}
                            onMessageDeleted={handleMessageDeleted}
                            onMessageReposted={handleMessageReposted}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
