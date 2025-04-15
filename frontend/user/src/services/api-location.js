import axios from "../utils/axios-customize.js";

const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

const apiGet = async (url) => {
  const response = await axios.get(url);
  return response;
};

const locationService = {
  getProvinces: async () => {
    return apiGet("/provinces");
  },

  getDistricts: async (id) => {
    return apiGet(`/districts/${id}`);
  },
  getWards: async (id) => {
    return apiGet(`/wards/${id}`);
  },
};
export { locationService };
