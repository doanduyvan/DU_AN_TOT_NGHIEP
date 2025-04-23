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

const apiDelete = async (url, data) => {
  const response = await axios.delete(url, data);
  return response;
};

const commentProductsService = {

  searchUsers: async (query) => {
    return apiPost("/users/search-users",  query);
  },

  getComments: async ({ page, per_page, sortorder, keyword }) => {
    return apiGet("/comment-products", {
      params: { page, per_page, sortorder, keyword},
    });
  },

  getCommentById: async (id) => {
    return apiGet(`/comment-products/${id}`);
  },

  create: async (data) => {
    return apiPost("/comment-products/create", data);
  },
  update: async (id, data) => {
    return apiPost(`/comment-products/update/${id}`, data);
  },
  destroy: async (ids) => {
    return apiPost("/comment-products/destroy", { ids });
  },
  getAllUsers: async () => {
    return apiGet("/users");
  },
  getAllProducts: async () => {
    return apiGet("/products");
  },
};
export { commentProductsService };
