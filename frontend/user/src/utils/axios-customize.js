import axios from "axios";
import { message, notification } from "antd";


const baseUrl = import.meta.env.VITE_API_URL;
const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Accept': 'application/json',
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});
// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// Add a response interceptor
//  dữ liệu phản hồi từ server sẽ được xử lý ở đây
instance.interceptors.response.use(
  function (response) {
    return response && response.data ? response.data : response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default instance;
