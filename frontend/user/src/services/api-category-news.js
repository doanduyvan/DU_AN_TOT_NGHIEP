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

const categoryNewsService = {
  getAllCategories: async ({ page, per_page, sortorder, keyword }) => {
    return apiGet("/categorynews", {
      params: { page, per_page, sortorder, keyword },
    });
  },
  getCategoryById: async (id) => {
    return apiGet(`/categorynews/getbyid/${id}`);
  },
  create_Category: async (data) => {
    return apiPost("/categorynews/create", data);
  },
  update: async (id, data) => {
    return apiPost(`/categorynews/update/${id}`, data);
  },
  destroy: async (ids) => {
    return apiPost("/categorynews/destroy", { ids });
  },
};
export { categoryNewsService };
