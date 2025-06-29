import { User } from "@/contexts/auth-context";
import { axiosInstance } from "./axios-instance";

export default async function getStreamToken() {
  try {
    const response = await axiosInstance.get("/chat/token/");
    return response.data;
  } catch (error) {
    console.error("Error fetching Stream token:", error);
    throw error;
  }
}

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

export const setUser = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};
