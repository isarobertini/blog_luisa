import { useState } from "react";
import { createMessage } from "../api/messages";
import { Button } from "../ui/Button";

export default function MessageForm({ onMessageCreated }) {
    const [author, setAuthor] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("author", author);
        formData.append("text", text);
        if (file) formData.append("file", file);

        const res = await createMessage(formData);
        onMessageCreated(res.data);
        setAuthor("");
        setText("");
        setFile(null);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="border-2 border-indigo-500"
            />
            <textarea
                placeholder="Write a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="border-2 border-indigo-500"
            />
            <input className="border-2 border-indigo-500" type="file" onChange={(e) => setFile(e.target.files[0])} />
            <Button type="submit">Post</Button>
        </form>
    );
}
