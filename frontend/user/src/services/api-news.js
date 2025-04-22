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

const newsService = {
  getAllNews: async ({page, per_page, sortorder, keyword, filter_category}) => {
    return apiGet("/news", {
      params: { page, per_page, sortorder, keyword, filter_category },
    });
  },

  getNewsById: async (id) => {
    return apiGet(`/news/${id}`);
  },
  categoryNews: async () => {
    return apiGet("/news/get-category-news");
  },
  create: async (data) => {
    return apiPost("/news/create", data);
  },
  update: async (id, data) => {
    return apiPost(`/news/update/${id}`, data);
  },
  destroy: async (ids) => {
    return apiPost("/news/destroy", { ids });
  },
  newsTrash: async ({ page, per_page, sortorder, keyword, filter_category }) => {
    return apiGet("news/trash", {
      params: { page, per_page, sortorder, keyword, filter_category },
    });
  },
  restore: async (ids) => {
    return apiPost("/news/restore", { ids });
  },
  forceDelete: async (id) => {
    return apiDelete(`/news/force-delete/${id}`);
  },
};
export { newsService };
