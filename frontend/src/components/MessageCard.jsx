import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { likeMessage, fetchReactions, replyToMessage } from "../api/reactions";
import { deleteMessage, repostMessage } from "../api/messages";
import ReactionForm from "./ReactionForm";
import ReactionList from "./ReactionList";
import { Button } from "../ui/Button";

export default function MessageCard({ message, onMessageDeleted, onMessageReposted, token, BASE_URL }) {
    const [likes, setLikes] = useState(message.likes || 0);
    const [reactions, setReactions] = useState([]);
    const [repostCount, setRepostCount] = useState(message.reposts || 0);

    let currentUser = null;
    if (token) {
        try {
            currentUser = jwtDecode(token);
        } catch (err) {
            console.warn("Invalid token", err);
        }
    }

    const isAuthor = currentUser && message.authorId === currentUser.id;

    // Load reactions for this message
    useEffect(() => {
        const loadReactions = async () => {
            try {
                const res = await fetchReactions(message._id);
                setReactions(res.data);
            } catch (err) {
                console.error("Failed to fetch reactions", err);
            }
        };
        loadReactions();
    }, [message._id]);

    // Like handler
    const handleLike = async () => {
        if (!token) return alert("You must be logged in to like messages");
        try {
            await likeMessage(message._id, token);
            setLikes(prev => prev + 1);
        } catch (err) {
            console.error("Failed to like message:", err);
        }
    };

    // Delete message
    const handleDelete = async () => {
        if (!token) return alert("You must be logged in to delete messages");
        if (!window.confirm("Are you sure you want to delete this message?")) return;

        try {
            await deleteMessage(message._id, token);
            onMessageDeleted(message._id);
        } catch (err) {
            console.error("Failed to delete message:", err);
            alert("Could not delete the message");
        }
    };

    // Repost message
    const handleRepost = async () => {
        if (!token) return alert("You must be logged in to repost");
        if (!window.confirm("Are you sure you want to repost this message?")) return;

        try {
            const res = await repostMessage(message._id, token);
            setRepostCount(prev => prev + 1);

            if (onMessageReposted) {
                const repostMessageObj = {
                    ...res.data,
                    repost: { originalAuthor: message.author },
                    reposts: 0,
                };
                onMessageReposted(repostMessageObj);
            }
            alert("Reposted!");
        } catch (err) {
            console.error("Failed to repost message:", err);
            alert("Could not repost the message");
        }
    };

    // Reply handler
    const handleReply = async (author, text) => {
        if (!token) return alert("You must be logged in to reply");
        try {
            const res = await replyToMessage(message._id, author, text, token);
            setReactions(prev => [...prev, res.data]);
        } catch (err) {
            console.error("Failed to post reply:", err);
            alert("Could not post your reply");
        }
    };

    // Delete a reaction
    const handleReactionDeleted = async (reactionId, isLike) => {
        if (!token) return alert("You must be logged in to delete reactions");
        if (!window.confirm("Are you sure you want to delete this reaction?")) return;

        try {
            const res = await fetch(`${BASE_URL}/reactions/${reactionId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Failed to delete reaction");

            // Remove reaction from state
            setReactions(prev => prev.filter(r => r._id !== reactionId));

            // Update likes counter if needed
            if (isLike) setLikes(prev => Math.max(prev - 1, 0));

        } catch (err) {
            console.error("Failed to delete reaction:", err);
            alert("Could not delete this reaction");
        }
    };


    return (
        <div className="bg-stone-300 p-4 mb-4 rounded shadow">
            <p><strong>{message.author}</strong></p>

            {message.repost && (
                <p className="text-gray-600 italic text-sm">
                    Reposted from {message.repost.originalAuthor}
                </p>
            )}

            <p>{message.text}</p>

            {message.attachments?.map(att =>
                att.type === "image" ? (
                    <img key={att.url} src={att.url} alt="" width={200} />
                ) : att.type === "video" ? (
                    <video key={att.url} src={att.url} controls width={200} />
                ) : att.type === "audio" ? (
                    <audio key={att.url} src={att.url} controls />
                ) : null
            )}

            <div className="py-2 flex gap-4">
                <p>{likes} likes</p>
                <p>{repostCount} repost{repostCount !== 1 ? 's' : ''}</p>
            </div>

            <div className="flex items-center gap-2 mt-2">
                <Button type="button" onClick={handleLike}>
                    <img
                        src="https://img.icons8.com/emoji/48/000000/red-heart.png"
                        alt="heart"
                        className="w-5 h-5"
                    />
                </Button>

                {isAuthor && (
                    <Button type="button" onClick={handleDelete}>
                        Delete
                    </Button>
                )}

                {token && (
                    <Button type="button" onClick={handleRepost}>
                        <img
                            src="https://img.icons8.com/?size=100&id=h_LA1kaQQWR2&format=png&color=000000"
                            alt="repost"
                            className="w-5 h-5"
                        />{" "}
                        Repost
                    </Button>
                )}
            </div>

            <div className="mt-2">
                <ReactionList
                    reactions={reactions}
                    token={token}
                    currentUser={currentUser}
                    onReactionDeleted={handleReactionDeleted}
                />
                {token && <ReactionForm onReply={handleReply} />}
            </div>
        </div>
    );
}
