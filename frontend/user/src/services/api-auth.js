import axios from "../utils/axios-customize.js";

const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

const apiGet = async (url) => {
  const response = await axios.get(url);
  return response;
};

const AuthService = {
  register: async (userData) => {
    return apiPost("/register", userData);
  },
  login: async (credentials) => {
    return apiPost("/login", credentials);
  },

  logout: async () => {
    try {
      const response = await apiPost("/logout");
      localStorage.removeItem("token");
      // window.location.href = "/login";
      return response;
    } catch (error) {
      localStorage.removeItem("token");
      throw error.response ? error.response : error;
    }
  },
  // Lấy thông tin người dùng hiện tại
  getCurrentUser: async () => {
    return apiGet("/me");
  },

  // Kiểm tra xem người dùng đã đăng nhập chưa
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    if (token && token.trim() !== "") {
      return true;
    }
  },
};
export { AuthService };
