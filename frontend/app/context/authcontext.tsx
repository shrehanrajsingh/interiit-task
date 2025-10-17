"use client";

// context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "../lib/api";
import { authApi } from "../lib/api";
import type { User, TokenResponse } from "../types/auth";
import { useRouter } from "next/navigation";
import { AxiosResponse, AxiosError } from "axios";

// Type for API errors
interface ApiError extends Error {
  response?: {
    data?: {
      detail?: string;
      [key: string]: unknown;
    };
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
  };
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  clearError: () => void;
  accessToken: string | null;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
) as React.Context<AuthContextType>;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const token = getCookie("accessToken");

    if (token) {
      setAccessToken(token);
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      document.cookie = `accessToken=${accessToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; SameSite=Strict`;
    } else {
      delete api.defaults.headers.common["Authorization"];

      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
    }
  }, [accessToken]);

  useEffect(() => {
    const interceptor: number = api.interceptors.response.use(
      (res: AxiosResponse) => res,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          setUser(null);
          setAccessToken(null);
          router.push("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [router]);

  async function fetchUser(token: string) {
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const me = await api.get<User>("/users/me");

      if (!me.data || !me.data.id) {
        throw new Error("Invalid user data");
      }

      setUser({
        ...me.data,
        token: token,
      });
    } catch (e) {
      console.error("Error fetching user:", e);
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(email, password);
      const tokenData = response.data;

      if (!tokenData || !tokenData.access_token) {
        throw new Error("Invalid token response");
      }

      setAccessToken(tokenData.access_token);

      try {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokenData.access_token}`;

        const userResponse = await api.get("/users/me");
        const userData = userResponse.data;

        if (!userData || !userData.id) {
          throw new Error("Invalid user data");
        }

        setUser({
          ...userData,
          token: tokenData.access_token,
        });

        router.push("/home");
      } catch (userError) {
        const error = userError as ApiError;
        console.error("Error fetching user details:", error);
        setError("Authentication successful but failed to fetch user details.");
        setAccessToken(null);
      }
    } catch (e) {
      const error = e as ApiError;
      console.error("Login error:", error);
      setError(
        error.response?.data?.detail || "Login failed. Please try again."
      );
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setUser(null);
      setAccessToken(null);
      router.push("/login");
    } catch (e) {
      console.error(e);
    }
  }

  async function register(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      await authApi.register(email, password);
      await login(email, password);
    } catch (e) {
      const error = e as ApiError;
      setError(
        error.response?.data?.detail || "Registration failed. Please try again."
      );
      setLoading(false);
    }
  }

  // Function to clear authentication errors
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        clearError,
        accessToken,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
