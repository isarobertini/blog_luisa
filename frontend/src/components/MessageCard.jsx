import { useState, useEffect } from "react";
import { likeMessage, fetchReactions, replyToMessage } from "../api/reactions";
import ReactionForm from "./ReactionForm";
import ReactionList from "./ReactionList";

export default function MessageCard({ message, onMessageDeleted }) {
    const [likes, setLikes] = useState(message.likes);
    const [reactions, setReactions] = useState([]);

    useEffect(() => {
        fetchReactions(message._id).then((res) => setReactions(res.data));
    }, [message._id]);

    const handleLike = async () => {
        await likeMessage(message._id, "Anonymous");
        setLikes((prev) => prev + 1);
    };

    const handleReply = async (author, text) => {
        const res = await replyToMessage(message._id, author, text);
        setReactions((prev) => [...prev, res.data]);
    };

    return (
        <div className="bg-stone-300" style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>{message.author}</strong></p>
            <p>{message.text}</p>
            {message.attachments.map((att) => (
                att.type === "image" ? <img key={att.url} src={att.url} alt="" width={200} /> :
                    att.type === "video" ? <video key={att.url} src={att.url} controls width={200} /> :
                        att.type === "audio" ? <audio key={att.url} src={att.url} controls /> : null
            ))}


            <button className="" onClick={handleLike}><img className="h-6" src="https://img.icons8.com/?size=100&id=dKjAZULRJlO7&format=png&color=000000" alt="" /> <p>{likes} Likes</p></button>

            <ReactionForm onReply={handleReply} />
            <ReactionList reactions={reactions} />
        </div>
    );
}
