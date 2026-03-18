import axios from "axios";
import type { ApiError } from "@/lib/types";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? 500;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    const normalized: ApiError = {
      status,
      message,
      details: error.response?.data,
    };

    if (
      typeof window !== "undefined" &&
      status === 401 &&
      !window.location.pathname.startsWith("/login") &&
      !window.location.pathname.startsWith("/signup")
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(normalized);
  }
);
