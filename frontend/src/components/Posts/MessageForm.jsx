import { useState, useEffect, useRef } from "react";
import { Button } from "../../ui/Button";

export default function MessageForm({ onSubmitMessage }) {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [spinnerChar, setSpinnerChar] = useState("|");

    const fileInputRef = useRef(null);

    useEffect(() => {
        let interval;
        if (loading) {
            const spinnerSequence = ["|", "/", "-", "\\"];
            let i = 0;
            interval = setInterval(() => {
                setSpinnerChar(spinnerSequence[i % spinnerSequence.length]);
                i++;
            }, 100);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("text", text); // just the text
        if (file) formData.append("file", file);

        try {
            await onSubmitMessage(formData);
            setText("");
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            console.error("Failed to post message", err);
            alert("Could not post your message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center p-4 bg-gray-300 text-black ">
            <textarea
                placeholder="Write a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="block w-full p-1 border bg-white rounded "
                rows={3}
            />
            <input
                type="file"
                ref={fileInputRef}
                accept=".jpg,.png,.webp,.mp4,.mp3"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full p-1 border bg-white rounded"
            />
            <Button type="submit" className="bg-black border flex items-center gap-2">
                {loading ? `Posting ${spinnerChar}` : "Post"}
            </Button>
        </form>
    );
}

