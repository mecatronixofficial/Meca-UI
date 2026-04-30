// ==================================================
// 🌐 utils/api.js — Centralized API Manager
// ==================================================

import axios from "axios";

// ==================================================
// ⚙️ CONFIGURATION
// ==================================================

/**
 * Dynamically determine API base URLs depending on environment
 */
const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  import.meta.env?.REACT_APP_API_BASE_URL ||
  import.meta.env?.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/mec-api";

const UPLOAD_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_WS_URL) ||
  import.meta.env?.REACT_APP_UPLOAD_BASE_URL ||
  import.meta.env?.NEXT_PUBLIC_UPLOAD_BASE_URL ||
  "http://localhost:5000";

/**
 * Axios client instance
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000, // ⏱️ 20s global timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================================================
// 🔒 REQUEST INTERCEPTOR — Attach Auth Token
// ==================================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // If FormData, let browser set headers
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==================================================
// 🚨 RESPONSE INTERCEPTOR — Global Error & Token Refresh
// ==================================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔁 Token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("Missing refresh token");

        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem("authToken", data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.warn("🔒 Token refresh failed — logging out", refreshError);
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    handleApiError(error);
    return Promise.reject(error);
  }
);

// ==================================================
// 🧩 UTILITIES
// ==================================================

/**
 * Safe input validator
 */
export const sanitize = (value) =>
  value === undefined || value === null || value === "" ? null : String(value).trim();

/**
 * Central error handler
 */
export const handleApiError = (error) => {
  // Timeout or Network issue
  if (error.code === "ECONNABORTED") {
    console.error("⏰ Request timeout");
    throw new Error("Request timeout. Please try again.");
  }

  if (!error.response) {
    console.error("🌐 Network error — Server unreachable");
    throw new Error("Network error. Please check your connection.");
  }

  const { status, data } = error.response;
  const message =
    data?.message || data?.error || error.message || "An unexpected error occurred";

  console.error(`⚠️ API Error [${status}]:`, message);

  switch (status) {
    case 400:
      throw new Error(message || "Bad request.");
    case 401:
      throw new Error("Unauthorized. Please log in again.");
    case 403:
      throw new Error("Access forbidden.");
    case 404:
      throw new Error("Resource not found.");
    case 500:
      throw new Error("Server error. Please try again later.");
    default:
      throw new Error(message);
  }
};

/**
 * Simplify Axios responses
 */
const handleResponse = (response) => response?.data;

// ==================================================
// 📚 BLOG API
// ==================================================
export const getBlogsAPI = async () => {
  const res = await apiClient.get("/blogs/all");
  return handleResponse(res);
};

// ==================================================
// 🖼️ BANNER API
// ==================================================
export const getBannersAPI = async () => {
  const res = await apiClient.get("/banner/get");
  return handleResponse(res);
};

// ==================================================
// 📧 ENQUIRY API
// ==================================================
export const addEnquiryAPI = async (payload) => {
  const res = await apiClient.post("/enquiry/add", payload);
  return handleResponse(res);
};

// ==================================================
// ⭐ REVIEW API
// ==================================================
export const addReviewAPI = async (payload) => {
  const res = await apiClient.post("/review/add", payload);
  return handleResponse(res);
};

export const getAllReviewsAPI = async () => {
  const res = await apiClient.get("/review/all");
  return handleResponse(res);
};

// ==================================================
// 👥 CLIENT API
// ==================================================
export const getAllClientsCompanyAPI = async () => {
  const res = await apiClient.get("/clients/get_all_clients_company");
  return handleResponse(res);
};

// ==================================================
// 🛠️ PROJECT API
// ==================================================
export const getAllProjectsAPI = async () => {
  const res = await apiClient.get("/project/all");
  return handleResponse(res);
};

export const getProjectByIdAPI = async (id) => {
  if (!id) throw new Error("Project ID required");
  const res = await apiClient.get(`/project/${id}`);
  return handleResponse(res);
};

// ==================================================
// 💼 WORK API
// ==================================================
export const getAllWorksAPI = async () => {
  const res = await apiClient.get("/work/get");
  return handleResponse(res);
};

export const getWorkByIdAPI = async (id) => {
  if (!id) throw new Error("Work ID required");
  const res = await apiClient.get(`/work/get/${id}`);
  return handleResponse(res);
};

// ==================================================
// 📬 NEWSLETTER API
// ==================================================
export const subscribeNewsletterAPI = async (payload) => {
  const res = await apiClient.post("/news/add", payload);
  return handleResponse(res);
};

// ==================================================
// 🔐 AUTH API
// ==================================================
export const loginAPI = async (credentials) => {
  const res = await apiClient.post("/auth/login", credentials);
  return handleResponse(res);
};

export const registerAPI = async (payload) => {
  const res = await apiClient.post("/auth/register", payload);
  return handleResponse(res);
};


// ==================================================
// 🧾 EXPORTS
// ==================================================
export { BASE_URL, UPLOAD_BASE_URL, apiClient };
export default apiClient;
