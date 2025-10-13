import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../api/config";
import { Button } from "../ui/Button.jsx";
import { useNavigate } from "react-router-dom";

export default function Profile({ token }) {
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        const loadProfile = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/messages/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Sort user's messages by date (newest first)
                const sortedMessages = [...res.data.response.messages].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setProfile({ ...res.data.response, messages: sortedMessages });
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };

        loadProfile();
    }, [token]);

    if (!profile) return <p>Loading...</p>;

    return (
        <div className="p-4">

            <h2 className="text-2xl font-bold mb-2">{profile.username}'s Profile</h2>
            <p className="mb-4">Email: {profile.email}</p>

            <h3 className="text-xl font-semibold mb-2">Your posts:</h3>
            {profile.messages.length === 0 && <p>No messages yet.</p>}

            {profile.messages.map((msg) => (
                <div
                    key={msg._id}
                    className="border border-gray-400 rounded-xl p-3 mb-3 bg-stone-100"
                >
                    <p className="mb-2">{msg.text}</p>

                    {msg.attachments?.map((att) => (
                        <div key={att.url} className="mb-2">
                            {att.type === "image" && (
                                <img src={att.url} alt="" width={200} className="rounded" />
                            )}
                            {att.type === "video" && (
                                <video src={att.url} controls width={200} />
                            )}
                            {att.type === "audio" && (
                                <audio src={att.url} controls />
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
