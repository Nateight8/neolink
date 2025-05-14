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
