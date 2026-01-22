import { useState, useEffect } from "react";
import { likeMessage, fetchReactions, replyToMessage } from "../../../api/reactions";
import { deleteMessage, repostMessage } from "../../../api/messages";
import { BASE_URL } from "../../../api/config";

// Custom hook to handle message interactions
export default function useMessageHandlers(message, token, onMessageDeleted, onMessageReposted) {
    const [likes, setLikes] = useState(message.likes || 0); // Like count
    const [repostCount, setRepostCount] = useState(message.reposts || 0); // Repost count
    const [reactions, setReactions] = useState([]); // List of reactions

    // Load reactions on mount or when message ID changes
    useEffect(() => {
        const loadReactions = async () => {
            try {
                const res = await fetchReactions(message._id);
                setReactions(res.data || []);
            } catch (err) {
                console.error("Failed to fetch reactions", err); // Log fetch errors
            }
        };
        loadReactions();
    }, [message._id]);

    // Handle liking a message
    const handleLike = async () => {
        if (!token) return alert("You must be logged in to like messages");
        try {
            await likeMessage(message._id, token);
            setLikes(prev => prev + 1); // Increment like count
        } catch (err) {
            console.error(err);
        }
    };

    // Handle deleting a message
    const handleDelete = async () => {
        if (!token) return alert("You must be logged in to delete messages");
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await deleteMessage(message._id, token);
            onMessageDeleted(message._id); // Notify parent
        } catch (err) {
            console.error(err);
            alert("Could not delete the message");
        }
    };

    // Handle reposting a message
    const handleRepost = async () => {
        if (!token) return alert("You must be logged in to repost");
        if (!window.confirm("Are you sure you want to repost this message?")) return;
        try {
            const res = await repostMessage(message._id, token);
            setRepostCount(prev => prev + 1); // Increment repost count
            if (onMessageReposted) onMessageReposted(res.data); // Notify parent
        } catch (err) {
            console.error(err);
            alert("Could not repost the message");
        }
    };

    // Handle replying to a message
    const handleReply = async (author, text) => {
        if (!token) return alert("You must be logged in to reply");
        try {
            const res = await replyToMessage(message._id, author, text, token);
            setReactions(prev => [...prev, res.data]); // Add new reaction
        } catch (err) {
            console.error(err);
            alert("Could not post your reply");
        }
    };

    // Handle deleting a reaction
    const handleReactionDeleted = async (reactionId, isLike) => {
        if (!token) return alert("You must be logged in to delete reactions");
        if (!window.confirm("Are you sure you want to delete this reaction?")) return;
        try {
            const res = await fetch(`${BASE_URL}/reactions/${reactionId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete reaction");
            setReactions(prev => prev.filter(r => r._id !== reactionId)); // Remove reaction
            if (isLike) setLikes(prev => Math.max(prev - 1, 0)); // Decrement likes if needed
        } catch (err) {
            console.error(err);
            alert("Could not delete this reaction");
        }
    };

    return {
        likes,
        setLikes,
        repostCount,
        setRepostCount,
        reactions,
        setReactions,
        handleLike,
        handleDelete,
        handleRepost,
        handleReply,
        handleReactionDeleted
    };
}
