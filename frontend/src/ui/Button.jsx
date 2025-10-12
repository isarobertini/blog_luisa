export const Button = ({ children, onClick, type = "button" }) => {

    return (
        <button
            className="border-2 border-black p-2 bg-white"
            type={type}
            onClick={onClick}
        >{children}</button>
    )
}