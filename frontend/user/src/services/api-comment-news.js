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

const commentNewsService = {

  searchUsers: async (query) => {
    return apiPost("/users/search-users",  query);
  },

  searchNews: async (query) => {
    return apiPost("/comment-news/search-news",  query);
  },

  getComments: async () => {
    return apiGet("/comment-news");
  },

  getCommentById: async (id) => {
    return apiGet(`/comment-news/${id}`);
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
