import axios from "../utils/axios-customize.js";

const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

const apiGet = async (url) => {
  const response = await axios.get(url);
  return response;
};

const OrderService = {
  getAllOrder: async () => {
    return apiGet("/orders");
  },
  getOrderById: async (id) => {
    return apiGet(`/orders/${id}`);
  },
  update: async (id, formData) => {
    return apiPost(`/orders/update/${id}`, formData);
  }
};
export { OrderService };
