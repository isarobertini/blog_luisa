// src/ui/Input.jsx
export const Input = ({ value, onChange, placeholder, type = "text", required = true, className = "" }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            className={`my-1 border-1 border-black bg-white p-2 rounded-md ${className}`}
        />
    );
};
