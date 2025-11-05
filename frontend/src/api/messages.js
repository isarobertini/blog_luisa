import api from "./axiosInstance";

export const fetchMessages = () => api.get("/messages");

export const createMessage = (formData) =>
    api.post("/messages", formData, {
        headers: {
            "Content-Type": "multipart/form-data", // needed for file uploads
        },
    });

export const deleteMessage = (messageId) => api.delete(`/messages/${messageId}`);

export const repostMessage = (messageId) => api.post(`/messages/${messageId}/repost`);

export const editMessage = (messageId, text) => api.put(`/messages/${messageId}`, { text });
