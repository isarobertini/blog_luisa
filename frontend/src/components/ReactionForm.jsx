import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export default function ReactionForm({ onReply }) {
    const [author, setAuthor] = useState("");
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onReply(author, text);
        setAuthor("");
        setText("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="p-2 border-2 border-black bg-white"
            />
            <Input
                placeholder="Write a message..."
                value={text}                   // bind to text state
                onChange={(e) => setText(e.target.value)}
            />
            <Button type="submit">Post</Button>
        </form>
    );
}
