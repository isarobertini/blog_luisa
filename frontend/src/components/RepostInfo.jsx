import { useState } from "react";
import { Button } from "../ui/Button";

export default function RepostInfo({ repost }) {
    const [showFullChain, setShowFullChain] = useState(false);

    if (!repost) return null;

    const { repostChain = [], originalAuthor } = repost;
    const maxVisible = 3;
    const truncated = repostChain.slice(-maxVisible);
    const hasMore = repostChain.length > maxVisible;

    return (
        <div className="text-gray-600 italic text-sm mt-1">
            <p>
                Reposted from{" "}
                {truncated.map((name, i) => (
                    <span key={i}>
                        {name}
                        {i < truncated.length - 1 ? ", " : ""}
                    </span>
                ))}
                {hasMore && (
                    <>
                        {" "}
                        and{" "}
                        <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setShowFullChain(true)}
                        >
                            {repostChain.length - maxVisible} more
                        </button>
                    </>
                )}
                {" "}→ Original post by <strong>{originalAuthor}</strong>
            </p>

            {showFullChain && (
                <div className="bg-white border rounded shadow p-2 mt-1">
                    <p className="font-semibold">Full repost history:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                        {repostChain.map((name, i) => (
                            <li key={i}>{name}</li>
                        ))}
                        <li><strong>Original author:</strong> {originalAuthor}</li>
                    </ul>
                    <Button
                        onClick={() => setShowFullChain(false)}
                        className="text-blue-600 mt-2"
                    >
                        Close
                    </Button>
                </div>
            )}
        </div>
    );
}
