export default function ErrorMessage({ message }) {
    if (!message) return null;
    return (
        <div className="text-red-600 text-sm my-1">
            {message}
        </div>
    );
}
