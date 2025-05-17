import axios from "axios";

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_BASE_URL is not defined in your environment. Please check your .env file."
  );
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
});
