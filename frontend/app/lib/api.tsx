import axios from "axios";
import qs from "qs";
import { User, TokenResponse } from "../types/auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL,
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: "repeat" });
  },
});

export const authApi = {
  login: async (email: string, password: string) => {
    const formData = new FormData();
    formData.append("username", email); // treat email as username
    formData.append("password", password);
    return api.post<TokenResponse>("/token", formData);
  },
  register: (email: string, password: string) => {
    return api.post<User>("/register", { email, password });
  },
  getProfile: () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return api.get<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      return api.get<User>("/users/me");
    }
  },
};

export default api;
