import axios from "../utils/axios-customize";
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

const productService = {
  allProducts: async () => {
    return apiGet("/products");
  },
  create: async (data) => {
    return apiPost("/products/create", data);
  },
  update: async (id, data) => {
    return apiPost(`/products/update/${id}`, data);
  },
  destroy: async (ids) => {
    return apiPost("/products/delete", { ids });
  },

};
export { productService };