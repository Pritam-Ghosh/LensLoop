
import axios from "axios";

const api = axios.create({
  baseURL: "https://snaphive-node.vercel.app/api/auth",
});

export const registerUser = (data) => api.post("/register", data);
export const verifyOtp = (data) => api.post("/verify-otp", data);
export const loginUser = (data) => api.post("/login", data);
export const forgotpassword = (data) => api.post("/forgot-password", data);
export const resetpassword = (data) => api.post("/reset-password", data);
export const resendOtp = (data) => api.post("/resend-otp", data);
export const updateProfile = (data, token) =>
  api.put("/update-profile", data, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });


export default api;
