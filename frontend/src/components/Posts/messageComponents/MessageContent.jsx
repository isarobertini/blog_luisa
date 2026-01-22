export default function MessageContent({ text, originalDates }) {
    const { createdAt, updatedAt } = originalDates;

    return (
        <p>
            {text}{" "}
            {new Date(updatedAt).getTime() !== new Date(createdAt).getTime() && (
                <span className="text-gray-500 text-sm">(edited)</span>
            )}
        </p>
    );
}
