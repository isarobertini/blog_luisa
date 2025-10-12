export default function ReactionList({ reactions }) {
    return (
        <div style={{ marginLeft: "20px" }}>
            {reactions
                .filter((r) => r.text) // only keep reactions with text
                .map((r) => (
                    <div key={r._id}>
                        <strong>{r.author}</strong>: {r.text}
                    </div>
                ))}
        </div>
    );
}
