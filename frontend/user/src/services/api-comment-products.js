import axios from "../utils/axios-customize.js";
const getHeaders = () => ({
  "Content-Type": "multipart/form-data",
});

const apiPost = async (url, data) => {
  const response = await axios.post(url, data, {
    headers: getHeaders(),
    withCredentials: true,
  });
  return response;
};

const apiGet = async (url) => {
  const response = await axios.get(url, {
    headers: getHeaders(),
    withCredentials: true,
  });
  return response;
};

const commentProductsService = {

  searchUsers: async (query) => {
    return apiPost("/users/search-users",  query);
  },

  searchProduct: async (query) => {
    return apiPost("/products/search-product",  query);
  },

  getComments: async () => {
    return apiGet("/comment-products");
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
