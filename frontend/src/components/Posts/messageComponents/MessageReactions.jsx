import React from "react";
import ReactionForm from "./ReactionForm";
import ReactionList from "./ReactionList";

export default function MessageReactions({ reactions, setReactions, token, currentUser, handleReactionDeleted, handleReply }) {
    return (
        <div className="mt-2">
            <ReactionList
                reactions={reactions}
                setReactions={setReactions}
                token={token}
                currentUser={currentUser}
                onReactionDeleted={handleReactionDeleted}
            />
            {token && <ReactionForm onReply={handleReply} />}
        </div>
    );
}
