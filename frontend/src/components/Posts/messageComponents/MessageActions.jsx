import { Button } from "../../../ui/Button";

export default function MessageActions({
    likes,
    setLikes,
    repostCount,
    setRepostCount,
    isAuthor,
    token,
    handleLike,
    handleDelete,
    handleRepost,
    updatedAt,
    setIsEditing
}) {
    return (
        <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Like Button */}
            <Button
                onClick={handleLike}
                className="flex items-center gap-2 px-2 py-1 text-sm sm:text-base"
            >
                <img
                    className="w-5 h-5 flex-shrink-0"
                    src="https://img.icons8.com/emoji/48/000000/red-heart.png"
                    alt="heart"
                />
                <span>{likes} like{likes !== 1 ? "s" : ""}</span>
            </Button>

            {/* Repost Button */}
            {token && (
                <Button
                    onClick={handleRepost}
                    className="flex items-center gap-2 px-2 py-1 text-sm sm:text-base"
                >
                    <img
                        className="w-5 h-5 flex-shrink-0"
                        src="https://img.icons8.com/?size=100&id=h_LA1kaQQWR2&format=png&color=000000"
                        alt="repost"
                    />
                    <span>{repostCount} repost{repostCount !== 1 ? "s" : ""}</span>
                </Button>
            )}

            {/* Edit/Delete Buttons */}
            {isAuthor && (
                <>
                    <Button className="p-1 sm:p-2" onClick={() => setIsEditing(true)}>
                        <img
                            className="w-5 h-5"
                            src="https://img.icons8.com/?size=100&id=MCdDfCTzd5GC&format=png&color=000000"
                            alt="edit"
                        />
                    </Button>
                    <Button className="p-1 sm:p-2" onClick={handleDelete}>
                        <img
                            className="w-5 h-5"
                            src="https://img.icons8.com/?size=100&id=1941&format=png&color=000000"
                            alt="delete"
                        />
                    </Button>
                </>
            )}

            {/* Timestamp */}
            <span className="text-gray-400 text-xs ml-auto sm:ml-2">{new Date(updatedAt).toLocaleString()}</span>
        </div>
    );
}
