import { useState } from "react";
import { Button } from "../ui/Button";
import { BASE_URL } from "../api/config";

export default function ReactionList({ reactions = [], setReactions, token, currentUser, onReactionDeleted }) {
    const [editingReactionId, setEditingReactionId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [visibleCount, setVisibleCount] = useState(2);

    // Only text reactions (exclude likes)
    const textReactions = reactions.filter(r => !r.like);
    const visibleReactions = textReactions.slice(0, visibleCount);

    const handleEditClick = (reaction) => {
        setEditingReactionId(reaction._id);
        setEditingText(reaction.text);
    };

    const handleSaveEdit = async (reactionId) => {
        if (!token) return alert("You must be logged in to edit reactions");

        try {
            const res = await fetch(`${BASE_URL}/reactions/${reactionId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: editingText }),
            });

            if (!res.ok) throw new Error("Failed to update reaction");
            const updatedReaction = await res.json();

            setReactions(prev =>
                prev.map(r => r._id === reactionId ? { ...r, text: updatedReaction.text } : r)
            );

            setEditingReactionId(null);
        } catch (err) {
            console.error(err);
            alert("Could not save your changes");
        }
    };

    const toggleVisibleCount = () => {
        setVisibleCount(prev => (prev >= textReactions.length ? 2 : textReactions.length));
    };

    return (
        <div className="mt-2 space-y-2 w-full">
            {visibleReactions.map(r => (
                <div key={r._id} className="flex justify-between items-center gap-2 w-full">
                    {editingReactionId === r._id ? (
                        <>
                            <input
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="border rounded p-1 flex-1"
                            />
                            <Button onClick={() => handleSaveEdit(r._id)} className="text-green-500 text-sm">Save</Button>
                            <Button onClick={() => setEditingReactionId(null)} className="text-gray-500 text-sm">Cancel</Button>
                        </>
                    ) : (
                        <>
                            <p className="flex-1"><strong>{r.author}</strong>: {r.text}</p>
                            {token && currentUser && r.authorId === currentUser._id && (
                                <div className="flex gap-1 items-center text-xs text-gray-500">
                                    <Button onClick={() => handleEditClick(r)} className="text-blue-500">Edit</Button>
                                    <Button onClick={() => onReactionDeleted(r._id, r.like)} className="text-red-500">Delete</Button>
                                    {new Date(r.updatedAt).getTime() !== new Date(r.createdAt).getTime() && <span>(edited)</span>}
                                    <span>{new Date(r.updatedAt).toLocaleString()}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ))}

            {textReactions.length > 2 && (
                <Button
                    onClick={toggleVisibleCount}
                    className="text-blue-500 text-sm mt-2 hover:underline"
                >
                    {visibleCount >= textReactions.length ? "Show less" : `Show all ${textReactions.length} comments`}
                </Button>
            )}
        </div>
    );
}
