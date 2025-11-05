import { useState } from "react";
import { Button } from "../../../ui/Button";
import { Input } from "../../../ui/Input";

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
            <Input
                placeholder="Write a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
            />
            <Button type="submit">Post</Button>
        </form>
    );
}
