// src/api/reactions.js
import axios from "axios";
import { BASE_URL } from "./config";

export const likeMessage = (messageId, author) =>
    axios.post(`${BASE_URL}/reactions/${messageId}/like`, { author });

export const replyToMessage = (messageId, author, text) =>
    axios.post(`${BASE_URL}/reactions/${messageId}/reply`, { author, text });

export const fetchReactions = (messageId) =>
    axios.get(`${BASE_URL}/reactions/${messageId}`);
