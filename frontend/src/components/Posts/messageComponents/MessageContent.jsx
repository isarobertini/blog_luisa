import { Button } from "../../../ui/Button";

export default function MessageContent({
    text,
    isEditing,
    editText,
    setEditText,
    handleSaveEdit,
    originalDates
}) {
    const { createdAt, updatedAt } = originalDates;

    return (
        <div>
            {isEditing ? (
                <div className="flex flex-col gap-2">
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="border p-1 rounded w-full"
                        rows={3}
                    />
                    <div className="flex gap-2">
                        <Button onClick={handleSaveEdit}>Save</Button>
                        <Button onClick={() => setEditText(text)}>Cancel</Button>
                    </div>
                </div>
            ) : (
                <p>
                    {text}{" "}
                    {new Date(updatedAt).getTime() !== new Date(createdAt).getTime() && (
                        <span className="text-gray-500 text-sm">(edited)</span>
                    )}
                </p>
            )}
        </div>
    );
}
