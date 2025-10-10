// src/ui/Input.jsx
export const Input = ({ value, onChange, placeholder, type = "text", required = true, className = "" }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className={`border-2 border-indigo-500 p-2 rounded ${className}`}
        />
    );
};
