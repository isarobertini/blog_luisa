import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { likeMessage, fetchReactions, replyToMessage } from "../../api/reactions";
import { deleteMessage, repostMessage } from "../../api/messages";
import ReactionForm from "./messageComponents/ReactionForm";
import ReactionList from "./messageComponents/ReactionList";
import RepostInfo from "./messageComponents/RepostInfo";
import MessageContent from "../Posts/messageComponents/MessageContent";
import MessageActions from "../Posts/messageComponents/MessageActions";
import { BASE_URL } from "../../api/config";

export default function MessageCard({ message, onMessageDeleted, onMessageReposted, token }) {
    const [likes, setLikes] = useState(message.likes || 0);
    const [reactions, setReactions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(message.text);
    const [repostCount, setRepostCount] = useState(message.reposts || 0);

    let currentUser = null;
    if (token) {
        try { currentUser = jwtDecode(token); }
        catch (err) { console.warn("Invalid token", err); }
    }

    const isAuthor = currentUser &&
        (message.authorId === currentUser.id || message.authorId === currentUser._id);

    useEffect(() => {
        const loadReactions = async () => {
            try {
                const res = await fetchReactions(message._id);
                setReactions(res.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        loadReactions();
    }, [message._id]);

    const handleLike = async () => {
        if (!token) return alert("You must be logged in to like messages");
        await likeMessage(message._id, token);
        setLikes((prev) => prev + 1);
    };

    const handleDelete = async () => {
        if (!token) return alert("You must be logged in to delete messages");
        if (!window.confirm("Are you sure?")) return;
        await deleteMessage(message._id, token);
        onMessageDeleted(message._id);
    };

    const handleRepost = async () => {
        if (!token) return alert("You must be logged in to repost");
        if (!window.confirm("Are you sure?")) return;
        const res = await repostMessage(message._id, token);
        setRepostCount(prev => prev + 1);
        if (onMessageReposted) onMessageReposted(res.data);
    };

    const handleReply = async (author, text) => {
        if (!token) return alert("You must be logged in to reply");
        const res = await replyToMessage(message._id, author, text, token);
        setReactions(prev => [...prev, res.data]);
    };

    const handleReactionDeleted = async (reactionId, isLike) => {
        if (!token) return;
        if (!window.confirm("Delete this reaction?")) return;
        const res = await fetch(`${BASE_URL}/reactions/${reactionId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to delete");
        setReactions(prev => prev.filter(r => r._id !== reactionId));
        if (isLike) setLikes(prev => Math.max(prev - 1, 0));
    };

    const handleSaveEdit = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${BASE_URL}/messages/${message._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ text: editText }),
            });
            if (!res.ok) throw new Error("Failed to edit message");
            const updatedMessage = await res.json();
            message.text = updatedMessage.text;
            setIsEditing(false);
        } catch (err) { console.error(err); alert("Could not save edits"); }
    };

    return (
        <div className="bg-gray-300 p-4 mb-4 rounded shadow">
            <p><strong>{message.author}</strong></p>

            <MessageContent
                text={message.text}
                isEditing={isEditing}
                editText={editText}
                setEditText={setEditText}
                handleSaveEdit={handleSaveEdit}
                originalDates={{ createdAt: message.createdAt, updatedAt: message.updatedAt }}
            />

            {message.attachments?.map(att =>
                att.type === "image" ? <img key={att.url} src={att.url} alt="" width={200} /> :
                    att.type === "video" ? <video key={att.url} src={att.url} controls width={200} /> :
                        att.type === "audio" ? <audio key={att.url} src={att.url} controls /> : null
            )}

            <MessageActions
                likes={likes}
                setLikes={setLikes}
                repostCount={repostCount}
                setRepostCount={setRepostCount}
                isAuthor={isAuthor}
                token={token}
                handleLike={handleLike}
                handleDelete={handleDelete}
                handleRepost={handleRepost}
                updatedAt={message.updatedAt}
                setIsEditing={setIsEditing}
            />

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

            {message.repost && <RepostInfo repost={message.repost} />}
        </div>
    );
}