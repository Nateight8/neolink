import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_BASE_URL is not defined in your environment. Please check your .env file."
  );
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from cookies (handled by the browser automatically with withCredentials: true)
    // If you need to use token in Authorization header, uncomment below:
    /*
    const token = getCookie('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    */
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // If this is a retry request, redirect to login
      if (originalRequest._retry) {
        // Redirect to login or handle as needed
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/signin';
        }
        return Promise.reject(error);
      }

      // TODO: Implement token refresh logic here if needed
      // originalRequest._retry = true;
      // try {
      //   const response = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
      //   const { token } = response.data;
      //   // Update token in storage if using token in header
      //   // document.cookie = `jwt=${token}; path=/; secure; samesite=none`;
      //   originalRequest.headers.Authorization = `Bearer ${token}`;
      //   return axiosInstance(originalRequest);
      // } catch (refreshError) {
      //   // Redirect to login if refresh fails
      //   if (typeof window !== 'undefined') {
      //     window.location.href = '/auth/signin';
      //   }
      //   return Promise.reject(refreshError);
      // }
    }


    // Handle other errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
      
      // You can handle specific status codes here
      if (error.response.status === 403) {
        console.error('Forbidden: You do not have permission to access this resource');
      } else if (error.response.status === 404) {
        console.error('Not Found: The requested resource was not found');
      } else if (error.response.status >= 500) {
        console.error('Server Error: Something went wrong on the server');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);
