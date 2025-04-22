import axios from "../utils/axios-customize.js";

const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

const apiDelete = async (url, data) => {
  const response = await axios.delete(url, data);
  return response;
}

const apiGet = async (url, options = {}) => {
  const response = await axios.get(url, {
    ...options,
  });
  return response;
};
const BannerService = {
  getBanners: async ({ page, per_page, sortorder }) => {
    return apiGet('banners', {
      params: { page, per_page, sortorder },
  });
  },
  getBannerById: async (id) => {
    return apiGet(`banners/get-banner/${id}`);
  },
  create: async (formData) => {
    return apiPost("/banners/create", formData);
  },
  update: async (id, data) => {
    return apiPost(`/banners/update/${id}`, data);
  },
  destroy: async (ids) => {
    return apiPost('/banners/destroy', { ids });
  },
};
export { BannerService };
