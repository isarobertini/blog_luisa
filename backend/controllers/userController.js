import { UserModel } from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "1h";

// Generate a JWT
const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// @desc    Register new user
// @route   POST /api/users/register
export const registerUserController = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, response: "Please add all fields" });
    }

    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            response: `User with ${existingUser.username === username ? "username" : "email"} already exists`,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ username, email, password: hashedPassword });

    const token = generateToken(newUser._id);

    res.status(201).json({
        success: true,
        response: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            token,
        },
    });
});

// @desc    Login user
// @route   POST /api/users/login
export const loginUserController = asyncHandler(async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        return res.status(400).json({ success: false, response: "Please provide credentials" });
    }

    const user = await UserModel.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
        return res.status(401).json({ success: false, response: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ success: false, response: "Incorrect password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        response: {
            id: user._id,
            username: user.username,
            email: user.email,
            token,
        },
    });
});
