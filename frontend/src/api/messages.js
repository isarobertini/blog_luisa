// src/api/messages.js
import axios from "axios";
import { BASE_URL } from "./config";

export const fetchMessages = () => axios.get(`${BASE_URL}/messages`);
export const createMessage = (formData) =>
    axios.post(`${BASE_URL}/messages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
export const updateMessage = (id, text) =>
    axios.put(`${BASE_URL}/messages/${id}`, { text });
export const deleteMessage = (id) =>
    axios.delete(`${BASE_URL}/messages/${id}`);
