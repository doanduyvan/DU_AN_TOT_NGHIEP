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

const commentNewsService = {

  getComments: async ({ page, per_page, sortorder, keyword }) => {
    return apiGet("/comment-news", {
      params: { page, per_page, sortorder, keyword},
    });
  },

  getCommentById: async (id) => {
    return apiGet(`/comment-news/getbyid/${id}`);
  },

  create: async (data) => {
    return apiPost("/comment-news/create", data);
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
export { commentNewsService };
