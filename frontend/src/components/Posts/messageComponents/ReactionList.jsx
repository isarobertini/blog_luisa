import { useState } from "react";
import { Button } from "../../../ui/Button";
import { BASE_URL } from "../../../api/config";

export default function ReactionList({ reactions = [], setReactions, token, currentUser, onReactionDeleted }) {
    const [editingReactionId, setEditingReactionId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [visibleCount, setVisibleCount] = useState(0);

    // Normalize currentUser ID (handle both id and _id)
    const userId = currentUser?._id || currentUser?.id;

    // Filter only text-based reactions (exclude likes)
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
                prev.map(r => r._id === reactionId ? { ...r, text: updatedReaction.text, updatedAt: updatedReaction.updatedAt } : r)
            );

            setEditingReactionId(null);
        } catch (err) {
            console.error(err);
            alert("Could not save your changes");
        }
    };

    const toggleVisibleCount = () => {
        setVisibleCount(prev => (prev >= textReactions.length ? 0 : textReactions.length));
    };

    return (
        <div className="mt-2 space-y-3 w-full">
            {visibleReactions.map(r => {
                const isAuthor = userId && r.authorId === userId;
                const isEdited = new Date(r.updatedAt).getTime() !== new Date(r.createdAt).getTime();

                return (
                    <div key={r._id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-white/50 rounded p-2">
                        {editingReactionId === r._id ? (
                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                                <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="border rounded p-1 flex-1"
                                />
                                <div className="flex gap-1">
                                    <Button onClick={() => handleSaveEdit(r._id)} className="text-green-600 text-sm">Save</Button>
                                    <Button onClick={() => setEditingReactionId(null)} className="text-gray-500 text-sm">Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row justify-between w-full">
                                <p className="flex-1 break-words">
                                    <strong>{r.author}</strong>: {r.text}
                                    {isEdited && <span className="text-xs text-gray-500 ml-1">(edited)</span>}
                                </p>

                                {isAuthor && (
                                    <div className="flex gap-1 items-center text-xs text-gray-500 mt-1 sm:mt-0">
                                        <Button onClick={() => handleEditClick(r)} className="text-blue-500">Edit</Button>
                                        <Button onClick={() => onReactionDeleted(r._id, r.like)} className="text-red-500">Delete</Button>
                                    </div>
                                )}
                            </div>
                        )}

                        <span className="text-[11px] text-gray-400">
                            {new Date(r.updatedAt).toLocaleString()}
                        </span>
                    </div>
                );
            })}

            {textReactions.length > 0 && (
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
