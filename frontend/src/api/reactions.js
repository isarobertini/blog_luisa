// src/api/reactions.js
import axios from "axios";
import { BASE_URL } from "./config";

export const likeMessage = (messageId, token) =>
    axios.post(
        `${BASE_URL}/reactions/${messageId}/like`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

export const replyToMessage = (messageId, author, text, token) =>
    axios.post(
        `${BASE_URL}/reactions/${messageId}/reply`,
        { author, text },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

export const fetchReactions = (messageId) =>
    axios.get(`${BASE_URL}/reactions/${messageId}`);