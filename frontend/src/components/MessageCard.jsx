import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { likeMessage, fetchReactions, replyToMessage } from "../api/reactions";
import { deleteMessage, repostMessage } from "../api/messages";
import ReactionForm from "./ReactionForm";
import ReactionList from "./ReactionList";
import { Button } from "../ui/Button";

export default function MessageCard({ message, onMessageDeleted, token }) {
    const [likes, setLikes] = useState(message.likes);
    const [reactions, setReactions] = useState([]);

    // ✅ Decode token at the very top of the component
    let currentUser = null;
    if (token) {
        try {
            currentUser = jwtDecode(token);
        } catch (err) {
            console.warn("Invalid token", err);
        }
    }

    // ✅ Check if the logged-in user is the author
    const isAuthor = currentUser && message.authorId === currentUser.id;

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

    const handleLike = async () => {
        if (!token) return alert("You must be logged in to like messages");
        await likeMessage(message._id, token);
        setLikes(prev => prev + 1);
    };

    const handleDelete = async () => {
        if (!token) return alert("You must be logged in to delete messages");
        const confirmDelete = window.confirm("Are you sure you want to delete this message?");
        if (!confirmDelete) return;

        try {
            await deleteMessage(message._id, token);
            onMessageDeleted(message._id);
        } catch (err) {
            console.error("Failed to delete message:", err);
            alert("Could not delete the message");
        }
    };

    const handleRepost = async () => {
        if (!token) return alert("You must be logged in to repost");
        const confirmRepost = window.confirm("Are you sure you want to repost this message?");
        if (!confirmRepost) return;

        try {
            await repostMessage(message._id, token);
            alert("Reposted!");
        } catch (err) {
            console.error("Failed to repost message:", err);
            alert("Could not repost the message");
        }
    };

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

    return (
        <div className="bg-stone-300 p-4 mb-4 rounded shadow">
            <p><strong>{message.author}</strong></p>
            <p>{message.text}</p>

            {message.attachments?.map(att =>
                att.type === "image" ? <img key={att.url} src={att.url} alt="" width={200} /> :
                    att.type === "video" ? <video key={att.url} src={att.url} controls width={200} /> :
                        att.type === "audio" ? <audio key={att.url} src={att.url} controls /> : null
            )}

            <div className="flex items-center gap-2 mt-2">
                <Button type="button" onClick={handleLike}>
                    {likes} Likes
                </Button>

                {isAuthor && (
                    <Button type="button" onClick={handleDelete} className="bg-red-600 text-white">
                        Delete
                    </Button>
                )}

                {token && (
                    <Button type="button" onClick={handleRepost}>
                        Repost
                    </Button>
                )}
            </div>

            {token && (
                <div className="mt-2">
                    <ReactionForm onReply={handleReply} />
                    <ReactionList reactions={reactions} token={token} />
                </div>
            )}
        </div>
    );
}
