export default function ReactionList({ reactions }) {
    return (
        <div style={{ marginLeft: "20px" }}>
            {reactions.map((r) => (
                <div key={r._id}>
                    <strong>{r.author}</strong>: {r.text}
                </div>
            ))}
        </div>
    );
}
