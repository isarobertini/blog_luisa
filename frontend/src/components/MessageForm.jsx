import { useState } from "react";
import { Button } from "../ui/Button";

export default function MessageForm({ onSubmitMessage }) {
    const [author, setAuthor] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("author", author);
        formData.append("text", text);
        if (file) formData.append("file", file);

        await onSubmitMessage(formData); // parent (MessageList) handles API + update

        setAuthor("");
        setText("");
        setFile(null);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center">
            <input
                type="text"
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="block w-full p-1 border-2 border-black bg-white rounded"
            />
            <textarea
                placeholder="Write a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="block w-full p-1 border-2 border-black bg-white rounded"
                rows={3}
            />
            <input
                type="file"
                accept=".jpg,.png,.webp,.mp4,.mp3"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full p-1 border-2 border-black bg-white rounded"
            />

            <Button type="submit" className="block">Post</Button>
        </form>

    );
}
