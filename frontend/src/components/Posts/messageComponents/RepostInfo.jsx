import { useState } from "react";

// RepostInfo component shows repost chain info
export default function RepostInfo({ repost }) {
    const [open, setOpen] = useState(false);

    if (!repost?.originalMessageId) return null; // No repost, nothing to show

    const chain = repost.repostChain || []; // Full repost chain

    if (chain.length === 0) return null; // Empty chain, nothing to show

    // Exclude immediate source (last in chain)
    const restOfChain = chain.slice(0, chain.length - 1);

    // Reverse order so most recent repost appears first
    const reversedChain = restOfChain.reverse();

    const max = 3;
    const visible = reversedChain.slice(0, max); // Show up to `max` reposts

    return (
        <div className="text-sm italic text-gray-600 mt-1">
            <p>
                {visible.length > 0 ? "Reposted from " + visible.join(", ") : "Reposted"}
                {restOfChain.length > max && (
                    <>
                        {" "}and{" "}
                        <button
                            className="text-blue-600"
                            onClick={() => setOpen(true)}
                        >
                            {restOfChain.length - max} more
                        </button>
                    </>
                )}
            </p>

            {open && (
                <div className="bg-white border rounded p-2 mt-2">
                    <p className="font-semibold">Full repost chain</p>
                    <ul className="list-disc list-inside">
                        {chain.map((name, i) => (
                            <li key={i}>{name}</li> // Show each name in chain
                        ))}
                    </ul>
                    <button
                        className="text-blue-600 mt-2"
                        onClick={() => setOpen(false)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}
