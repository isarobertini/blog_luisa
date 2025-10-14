export const Button = ({ children, onClick, type = "button", className = "" }) => {
    return (
        <button
            className={`border-1 border-black p-1 bg-white rounded-md flex items-center gap-1 ${className}`}
            type={type}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
