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

const ChartService = {
    getProductPerformance: async () => {
    return apiGet("/statisticals/product-performance");
  },
  getOrderYear: async () => {
    return apiGet("/statisticals/get-order-year");
  },
  getOrderStatistics: async (year) => {
    return apiGet(`/statisticals/get-order-statistics/${year}`);
  },
};
export { ChartService };
