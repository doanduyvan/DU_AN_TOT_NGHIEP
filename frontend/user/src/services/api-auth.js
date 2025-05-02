import axios from "../utils/axios-customize.js";
import { useAuth } from "../contexts/authcontext";
import AxiosUser from "../utils/axios_user.js";

const apiPost = async (url, data) => {
  const response = await AxiosUser.post(url, data);
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
      return response;
    } catch (error) {
      localStorage.removeItem("token");
      throw error.response ? error.response : error;
    }
  },
  getCurrentUser: async () => {
    return apiGet("/me");
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    if (token && token.trim() !== "") {
      return true;
    }
  },
};
export { AuthService };
