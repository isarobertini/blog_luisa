import { useState, useEffect } from "react";
import { likeMessage, fetchReactions, replyToMessage } from "../api/reactions";
import ReactionForm from "./ReactionForm";
import ReactionList from "./ReactionList";
import { deleteMessage, repostMessage } from "../api/messages.js";
import { jwtDecode } from "jwt-decode";

// Simple in-memory cache for reactions
const reactionsCache = {};

export default function MessageCard({ message, onMessageDeleted, token }) {
    const [likes, setLikes] = useState(message.likes);
    const [reactions, setReactions] = useState([]);

    useEffect(() => {
        const loadReactions = async () => {
            if (reactionsCache[message._id]) {
                setReactions(reactionsCache[message._id]);
            } else {
                try {
                    const res = await fetchReactions(message._id);
                    reactionsCache[message._id] = res.data;
                    setReactions(res.data);
                } catch (err) {
                    console.error("Failed to fetch reactions", err);
                }
            }
        };

        loadReactions();
    }, [message._id]);

    let currentUser = null;
    if (token) {
        try {
            currentUser = jwtDecode(token);
        } catch (err) {
            console.warn("Invalid token, ignoring auth features");
        }
    }

    const handleLike = async () => {
        if (!token) return alert("You must be logged in to like messages");
        await likeMessage(message._id, token);
        setLikes(prev => prev + 1);
    };

    const handleReply = async (author, text) => {
        if (!token) return alert("You must be logged in to reply");

        try {
            const res = await replyToMessage(message._id, author, text, token);
            const updatedReactions = [...reactions, res.data];
            reactionsCache[message._id] = updatedReactions;
            setReactions(updatedReactions);
        } catch (err) {
            console.error("Failed to post reply:", err);
            alert("Could not post your reply");
        }
    };

    const handleDelete = async () => {
        if (!token) return alert("You must be logged in to delete your messages");
        await deleteMessage(message._id, token);
        onMessageDeleted(message._id);
    };

    const handleRepost = async () => {
        if (!token) return alert("You must be logged in to repost");
        const res = await repostMessage(message._id, token);
        alert("Reposted!");
    };

    return (
        <div className="p-3 bg-stone-300">
            <p><strong>{message.author}</strong></p>
            <p>{message.text}</p>
            {message.attachments.map(att =>
                att.type === "image" ? <img key={att.url} src={att.url} alt="" width={200} /> :
                    att.type === "video" ? <video key={att.url} src={att.url} controls width={200} /> :
                        att.type === "audio" ? <audio key={att.url} src={att.url} controls /> : null
            )}

            <button onClick={handleLike}>
                <img className="h-6" src="https://img.icons8.com/?size=100&id=dKjAZULRJlO7&format=png&color=000000" alt="" />
                <p>{likes} Likes</p>
            </button>


            {token && currentUser?.username === message.author && <button className="bg-black" onClick={handleDelete}>Delete</button>}

            {token && <button onClick={handleRepost}>Repost</button>}

            <ReactionForm onReply={handleReply} />
            <ReactionList reactions={reactions} />
        </div>
    );
}
