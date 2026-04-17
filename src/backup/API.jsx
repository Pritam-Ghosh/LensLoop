
import axios from "axios";

const api = axios.create({
  baseURL: "https://snaphive-node.vercel.app/api/auth",
});

export const registerUser = (data) => api.post("/register", data);
export const verifyOtp = (data) => api.post("/verify-otp", data);
export const loginUser = (data) => api.post("/login", data);

export default api;
