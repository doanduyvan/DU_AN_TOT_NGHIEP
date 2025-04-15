import axios from "../utils/axios-customize.js";

const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

const apiGet = async (url) => {
  const response = await axios.get(url);
  return response;
};

const ChartService = {
    getProductPerformance: async () => {
    return apiGet("/product-performance");
  },
};
export { ChartService };
