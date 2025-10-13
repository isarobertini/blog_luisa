import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const authenticateUser = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, response: "No or invalid token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, response: "Invalid token" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, response: "Token expired or invalid" });
    }
};
