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

const newsService = {
  getAllNews: async () => {
    return apiGet("/news");
  },

  getNewsById: async (id) => {
    return apiGet(`/news/${id}`);
  },
  categoryNews: async () => {
    return apiGet("/categorynews");
  },
  create: async (data) => {
    return apiPost("/news/create", data);
  },
  update: async (id, data) => {
    return apiPost(`/news/update/${id}`, data);
  },
  destroy: async (ids) => {
    return apiPost("/news/delete", { ids });
  },
};
export { newsService };
