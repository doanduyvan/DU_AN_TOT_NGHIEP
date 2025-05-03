import axios from "../utils/axios-customize.js";
const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

const apiGet = async (url, options = {}) => {
  const response = await axios.get(url, {
    ...options,
  });
  return response;
};


const NotificationService = {

  getCountOrder: async () => {
    return apiGet("/notifications/order");
  },

  getProduct: async (data) => {
    return apiGet("/notifications/product");
  },
};
export { NotificationService };
