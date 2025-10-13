import axios from "axios";
import { BASE_URL } from "./config";

export const registerUser = (data) => axios.post(`${BASE_URL}/users/register`, data);
export const loginUser = (data) => axios.post(`${BASE_URL}/users/login`, data);
export const fetchProfile = (token) =>
    axios.get(`${BASE_URL}/messages/profile`, { headers: { Authorization: `Bearer ${token}` } });
