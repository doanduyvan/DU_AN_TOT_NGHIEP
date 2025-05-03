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

const productService = {
  getAllProducts: async ({page, per_page, sortorder, keyword, filter_category}) => {
    return apiGet("/products", {
      params: { page, per_page, sortorder, keyword, filter_category },
    });
  },

  getProductById: async (id) => {
    return apiGet(`/products/getbyid/${id}`);
  },
  getProductCount: async (id) => {
    return apiGet("/products/get-product-count");
  },
  categories: async () => {
    return apiGet("/products/getcategories");
  },
  create: async (data) => {
    return apiPost("/products/create", data);
  },
  update: async (id, data) => {
    return apiPost(`/products/update/${id}`, data);
  },
  destroy: async (ids) => {
    return apiPost("/products/destroy", { ids });
  },
  productTrash: async ({ page, per_page, sortorder, keyword, filter_category }) => {
    return apiGet("products/trash", {
      params: { page, per_page, sortorder, keyword, filter_category },
    });
  },
  restore: async (ids) => {
    return apiPost("/products/restore", { ids });
  },
  forceDelete: async (id) => {
    return apiDelete(`/products/force-delete/${id}`);
  },
};
export { productService };
