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

const NotificationService = {

  getCountOrder: async () => {
    return apiGet("/notifications/order");
  },

  getProduct: async (data) => {
    return apiGet("/notifications/product");
  },
  update: async (id, data) => {
    return apiPost(`/comment-news/update/${id}`, data);
  },
  destroy: async (ids) => {
    return apiPost("/comment-news/destroy", { ids });
  },
  getAllUsers: async () => {
    return apiGet("/users");
  },
  getAllNews: async () => {
    return apiGet("/comment_news/get-allnews");
  },
};
export { NotificationService };
