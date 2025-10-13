import express from "express";
import { authenticateUser } from "../middleware/authenticateUser.js";

const router = express.Router();

router.get("/profile", authenticateUser, (req, res) => {
    res.status(200).json({
        success: true,
        response: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
        },
    });
});

export default router;
