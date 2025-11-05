import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { likeMessage, fetchReactions, replyToMessage } from "../api/reactions";
import { deleteMessage, repostMessage } from "../api/messages";
import ReactionForm from "./ReactionForm";
import ReactionList from "./ReactionList";
import RepostInfo from "./RepostInfo"; // 👈 import the new component
import { Button } from "../ui/Button";
import { BASE_URL } from "../api/config";

export default function MessageCard({ message, onMessageDeleted, onMessageReposted, token }) {
    const [likes, setLikes] = useState(message.likes || 0);
    const [reactions, setReactions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(message.text);
    const [repostCount, setRepostCount] = useState(message.reposts || 0);
    const [currentMessage, setCurrentMessage] = useState(message);

    let currentUser = null;
    if (token) {
        try {
            currentUser = jwtDecode(token);
        } catch (err) {
            console.warn("Invalid token", err);
        }
    }

    const isAuthor =
        currentUser &&
        (currentMessage.authorId === currentUser.id || currentMessage.authorId === currentUser._id);

    // Load reactions on mount
    useEffect(() => {
        const loadReactions = async () => {
            try {
                const res = await fetchReactions(currentMessage._id);
                setReactions(res.data || []);
            } catch (err) {
                console.error("Failed to fetch reactions", err);
            }
        };
        loadReactions();
    }, [currentMessage._id]);

    // --- Handlers ---
    const handleLike = async () => {
        if (!token) return alert("You must be logged in to like messages");
        try {
            await likeMessage(currentMessage._id, token);
            setLikes((prev) => prev + 1);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!token) return alert("You must be logged in to delete messages");
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await deleteMessage(currentMessage._id, token);
            onMessageDeleted(currentMessage._id);
        } catch (err) {
            console.error(err);
            alert("Could not delete the message");
        }
    };

    const handleRepost = async () => {
        if (!token) return alert("You must be logged in to repost");
        if (!window.confirm("Are you sure you want to repost this message?")) return;
        try {
            const res = await repostMessage(currentMessage._id, token);
            setRepostCount((prev) => prev + 1);
            if (onMessageReposted) onMessageReposted(res.data);
            alert("Reposted!");
        } catch (err) {
            console.error(err);
            alert("Could not repost the message");
        }
    };

    const handleReply = async (author, text) => {
        if (!token) return alert("You must be logged in to reply");
        try {
            const res = await replyToMessage(currentMessage._id, author, text, token);
            setReactions((prev) => [...prev, res.data]);
        } catch (err) {
            console.error(err);
            alert("Could not post your reply");
        }
    };

    const handleReactionDeleted = async (reactionId, isLike) => {
        if (!token) return alert("You must be logged in to delete reactions");
        if (!window.confirm("Are you sure you want to delete this reaction?")) return;
        try {
            const res = await fetch(`${BASE_URL}/reactions/${reactionId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to delete reaction");
            setReactions((prev) => prev.filter((r) => r._id !== reactionId));
            if (isLike) setLikes((prev) => Math.max(prev - 1, 0));
        } catch (err) {
            console.error(err);
            alert("Could not delete this reaction");
        }
    };

    const handleSaveEdit = async () => {
        if (!token) return alert("You must be logged in to edit messages");
        try {
            const res = await fetch(`${BASE_URL}/messages/${currentMessage._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: editText }),
            });

            if (!res.ok) throw new Error("Failed to edit message");
            const updatedMessage = await res.json();
            setCurrentMessage(updatedMessage);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Could not save edits");
        }
    };

    // --- Render ---
    return (
        <div className="bg-gray-300 p-4 mb-4 rounded shadow">
            <p><strong>{currentMessage.author}</strong></p>

            {/* Message text */}
            {isEditing ? (
                <div className="flex flex-col gap-2">
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="border p-1 rounded w-full"
                        rows={3}
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleSaveEdit}>Save</Button>
                        <Button
                            onClick={() => {
                                setIsEditing(false);
                                setEditText(currentMessage.text);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <p>
                    {currentMessage.text}{" "}
                    {new Date(currentMessage.updatedAt).getTime() !==
                        new Date(currentMessage.createdAt).getTime() && (
                            <span className="text-gray-500 text-sm">(edited)</span>
                        )}
                </p>
            )}

            {/* Attachments */}
            {currentMessage.attachments?.map((att) =>
                att.type === "image" ? (
                    <img key={att.url} src={att.url} alt="" width={200} />
                ) : att.type === "video" ? (
                    <video key={att.url} src={att.url} controls width={200} />
                ) : att.type === "audio" ? (
                    <audio key={att.url} src={att.url} controls />
                ) : null
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-2">
                <Button onClick={handleLike} className="flex items-center gap-1">
                    <img
                        className="w-5 h-5"
                        src="https://img.icons8.com/emoji/48/000000/red-heart.png"
                        alt="heart"
                    />
                    <p>
                        {likes} like{likes !== 1 ? "s" : ""}
                    </p>
                </Button>

                {token && (
                    <Button onClick={handleRepost} className="flex items-center gap-1">
                        <img
                            src="https://img.icons8.com/?size=100&id=h_LA1kaQQWR2&format=png&color=000000"
                            alt="repost"
                            className="w-5 h-5"
                        />
                        <p>
                            {repostCount} repost{repostCount !== 1 ? "s" : ""}
                        </p>
                    </Button>
                )}

                {isAuthor && !isEditing && (
                    <>
                        <Button onClick={() => setIsEditing(true)}>
                            <img
                                className="w-5 h-5"
                                src="https://img.icons8.com/?size=100&id=MCdDfCTzd5GC&format=png&color=000000"
                                alt="edit"
                            />
                        </Button>
                        <Button onClick={handleDelete}>
                            <img
                                className="w-5 h-5"
                                src="https://img.icons8.com/?size=100&id=1941&format=png&color=000000"
                                alt="delete"
                            />
                        </Button>
                    </>
                )}

                <p className="text-gray-400 text-xs">
                    {new Date(currentMessage.updatedAt).toLocaleString()}
                </p>
            </div>

            {/* Reactions and replies */}
            <div className="mt-2">
                <ReactionList
                    reactions={reactions}
                    setReactions={setReactions}
                    token={token}
                    currentUser={currentUser}
                    onReactionDeleted={handleReactionDeleted}
                />
                {token && <ReactionForm onReply={handleReply} />}
            </div>
            {/* Repost information */}
            {currentMessage.repost && <RepostInfo repost={currentMessage.repost} />}

        </div>
    );
}
