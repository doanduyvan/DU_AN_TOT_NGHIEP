import axios from "axios";
import { message, notification } from "antd";
import { AntNotification } from "../components/notification";


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
     // Lấy token CSRF từ cookie (Laravel gửi token này vào cookie XSRF-TOKEN)
    const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = csrfToken.split('=')[1];
    }
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
      window.location.replace = "/login";
    }
    if (error.response && error.response.status === 403) {
      window.location.replace("/admin/forbidden");
      AntNotification.showNotification(
        "Không có quyền truy cập",
        "Bạn không có quyền thực hiện hành động này.",
        "warning"
      );
    }
    if (error.response && error.response.status === 500) {
      message.error("Đã có lỗi xảy ra, vui lòng thử lại.");
    } else if (error.response && error.response.status === 404) {
      message.warning("Không tìm thấy tài nguyên yêu cầu.");
    }
    return Promise.reject(error);
  }
);
export default instance;
