import api from "./axiosInstance";

// Reactions
export const likeMessage = (messageId) => api.post(`/reactions/${messageId}/like`);

export const replyToMessage = (messageId, author, text) =>
    api.post(`/reactions/${messageId}/reply`, { author, text });

export const fetchReactions = (messageId) => api.get(`/reactions/${messageId}`);
