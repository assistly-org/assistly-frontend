import { api } from "@/lib/api";

export const AuthService = {
  async loginWithEmail(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async loginWithGoogle(credential: string) {
    const response = await api.post("/auth/google", { id_token: credential });
    return response.data;
  },

  async logout() {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  async register(data: any) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async verifyOtp(email: string, otp_code: string) {
    const response = await api.post("/auth/verify", { email, otp_code });
    return response.data;
  },

  async refreshToken() {
    const response = await api.post("/auth/refresh");
    return response.data;
  },
};
