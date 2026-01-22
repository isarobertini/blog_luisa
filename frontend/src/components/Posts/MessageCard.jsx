import { jwtDecode } from "jwt-decode";
import ReactionForm from "./messageComponents/ReactionForm";
import ReactionList from "./messageComponents/ReactionList";
import RepostInfo from "./messageComponents/RepostInfo";
import MessageContent from "../Posts/messageComponents/MessageContent";
import MessageActions from "../Posts/messageComponents/MessageActions";
import useMessageHandlers from "./messageComponents/useMessageHandlers";

export default function MessageCard({ message, token, onMessageDeleted, onMessageReposted }) {

    const handlers = useMessageHandlers(message, token, onMessageDeleted, onMessageReposted);

    let currentUser = null;
    if (token) {
        try { currentUser = jwtDecode(token); }
        catch (err) { console.warn("Invalid token", err); }
    }

    const isAuthor = currentUser &&
        (message.authorId === currentUser.id || message.authorId === currentUser._id);

    return (
        <div className="bg-gray-300 p-4 mb-4 rounded shadow">
            <p><strong>{message.author}</strong></p>

            <MessageContent
                text={message.text}
                originalDates={{ createdAt: message.createdAt, updatedAt: message.updatedAt }}
            />

            {message.attachments?.map(att =>
                att.type === "image" ? <img key={att.url} src={att.url} alt="" width={200} /> :
                    att.type === "video" ? <video key={att.url} src={att.url} controls width={200} /> :
                        att.type === "audio" ? <audio key={att.url} src={att.url} controls /> : null
            )}

            <MessageActions
                likes={handlers.likes}
                setLikes={handlers.setLikes}
                repostCount={handlers.repostCount}
                setRepostCount={handlers.setRepostCount}
                isAuthor={isAuthor}
                token={token}
                handleLike={handlers.handleLike}
                handleDelete={handlers.handleDelete}
                handleRepost={handlers.handleRepost}
                updatedAt={message.updatedAt}
            />

            <div className="mt-2">
                <ReactionList
                    reactions={handlers.reactions}
                    setReactions={handlers.setReactions}
                    token={token}
                    currentUser={currentUser}
                    onReactionDeleted={handlers.handleReactionDeleted}
                />
                {token && <ReactionForm onReply={handlers.handleReply} />}
            </div>

            {message.repost && <RepostInfo repost={message.repost} />}
        </div>
    );
}
