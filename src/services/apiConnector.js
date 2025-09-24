// import axios from "axios";

// export const axiosInstance = axios.create({});

// export const apiConnector = (method, url, bodyData, headers, params) => {
//   return axiosInstance({
//     method: `${method}`,
//     url: `${url}`,
//     data: bodyData ? bodyData : null,
//     headers: headers ? headers : null,
//     params: params ? params : null,
//   });
// };



import axios from "axios";

// Create axios instance with default configuration

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1", // ✅ Backend URL
  withCredentials: true, // ✅ Allow sending cookies/auth
});

// export const axiosInstance = axios.create({
//   timeout: 10000, // 10 second timeout
//   withCredentials: true, // Important for cookies
// });

// Request interceptor to add authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally redirect to login
      window.location.href = "/login";
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error("Backend server is not running!");
      error.message = "Cannot connect to server. Please ensure backend is running on port 5000.";
    }
    
    return Promise.reject(error);
  }
);

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};




