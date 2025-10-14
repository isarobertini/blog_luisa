import { Button } from "../ui/Button";

export default function ReactionList({ reactions, token, currentUser, onReactionDeleted }) {
    return (
        <div className="mt-2 space-y-1">
            {reactions
                .filter(r => !r.like) // only show text reactions as comments
                .map(r => (
                    <div key={r._id} className="flex justify-between items-center gap-2">
                        <p>
                            <strong>{r.author}</strong>: {r.text}
                        </p>
                        {token && currentUser && r.authorId === currentUser.id && (
                            <Button
                                className="text-red-500 text-sm"
                                onClick={() => onReactionDeleted(r._id, r.like)}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                ))}
        </div>
    );
}
