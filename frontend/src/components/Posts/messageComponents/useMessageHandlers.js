import { useState, useEffect } from "react";
import { likeMessage, fetchReactions, replyToMessage } from "../../../api/reactions";
import { deleteMessage, repostMessage } from "../../../api/messages";
import { BASE_URL } from "../../../api/config";

export default function useMessageHandlers(message, token, onMessageDeleted, onMessageReposted) {
    const [likes, setLikes] = useState(message.likes || 0);
    const [repostCount, setRepostCount] = useState(message.reposts || 0);
    const [reactions, setReactions] = useState([]);

    useEffect(() => {
        const loadReactions = async () => {
            try {
                const res = await fetchReactions(message._id);
                setReactions(res.data || []);
            } catch (err) {
                console.error("Failed to fetch reactions", err);
            }
        };
        loadReactions();
    }, [message._id]);

    const handleLike = async () => {
        if (!token) return alert("You must be logged in to like messages");
        try {
            await likeMessage(message._id, token);
            setLikes((prev) => prev + 1);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!token) return alert("You must be logged in to delete messages");
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await deleteMessage(message._id, token);
            onMessageDeleted(message._id);
        } catch (err) {
            console.error(err);
            alert("Could not delete the message");
        }
    };

    const handleRepost = async () => {
        if (!token) return alert("You must be logged in to repost");
        if (!window.confirm("Are you sure you want to repost this message?")) return;
        try {
            const res = await repostMessage(message._id, token);
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
            const res = await replyToMessage(message._id, author, text, token);
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
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete reaction");
            setReactions((prev) => prev.filter((r) => r._id !== reactionId));
            if (isLike) setLikes((prev) => Math.max(prev - 1, 0));
        } catch (err) {
            console.error(err);
            alert("Could not delete this reaction");
        }
    };

    return {
        likes,
        repostCount,
        reactions,
        handleLike,
        handleDelete,
        handleRepost,
        handleReply,
        handleReactionDeleted,
        setReactions,
        setLikes,
        setRepostCount,
    };
}
