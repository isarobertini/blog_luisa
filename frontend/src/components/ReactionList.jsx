export default function ReactionList({ reactions }) {
    return (
        <div >
            {reactions.map((r) => (
                <div key={r._id}>
                    <strong>{r.author}</strong>: {r.text}
                </div>
            ))}
        </div>
    );
}
