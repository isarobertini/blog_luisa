import axios from "axios";
import { BASE_URL } from "./config";

export const fetchMessages = () => axios.get(`${BASE_URL}/messages`);

export const createMessage = async (formData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${BASE_URL}/messages`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteMessage = (messageId, token) =>
    axios.delete(`${BASE_URL}/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const repostMessage = (messageId, token) =>
    axios.post(`${BASE_URL}/messages/${messageId}/repost`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });

