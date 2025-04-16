import axios from "axios";
import { useNavigate } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_URL;
const AxiosUser = axios.create({
  baseURL: baseUrl,
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor
AxiosUser.interceptors.request.use(
  function (config) {

    if(config?.seeConfig){
      console.log("config", config);
    }

    if(config?.useToken){
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }else{
        const error = new Error("Bạn cần đăng nhập để thực hiện yêu cầu này.");
        error.status = 401; 
        return Promise.reject(error);
      }
    }

    if (config?.typeFormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
AxiosUser.interceptors.response.use(
  function (response) {
    return response && response.data ? response.data : response;
  },
  async function (error) {
    const config = error.config;

    if (typeof config?.onError === 'function') {
      config.onError(error);
    }

    if (config?.useToken) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
      }
    }

    return Promise.reject(error);
  }
);

export default AxiosUser;



