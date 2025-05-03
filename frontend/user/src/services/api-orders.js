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
const OrderService = {
  getAllOrder: async ({page, per_page, sortorder, keyword, filter_status, filter_payment_status, filter_shipping_status}) => {
    return apiGet("/orders", {
      params: { page, per_page, sortorder, keyword, filter_status, filter_payment_status, filter_shipping_status },
    });
  },
  getOrderPayment: async (id) => {
    return apiGet(`/orders/order-payment/${id}`);
  },
  getOrderById: async (id) => {
    return apiGet(`/orders/getbyid/${id}`);
  },
  getOrderCount: async () => {
    return apiGet("/orders/get-order-count");
  },
  getOrderLimit: async () => {
    return apiGet("/orders/getorderlimit");
  },
  getOrderTrashById: async (id) => {
    return apiGet(`/orders/trash/${id}`);
  },
  update: async (id, formData) => {
    return apiPost(`/orders/update/${id}`, formData);
  },
  updateOrderStatus: async (id, status) => {
    return apiPost(`/orders/update-order-status/${id}`, { status });
  },
  updatePaymentStatus: async (id, payment_status) => {
    return apiPost(`/orders/update-payment-status/${id}`, { payment_status });
  },
  updateShippingStatus: async (id, shipping_status) => {
    return apiPost(`/orders/update-shipping-status/${id}`, { shipping_status });
  },
  searchProduct: async (query) => {
    return apiPost("/products/search-variant-product",  query);
  },
  updateOrderDetail: async (data) => {
    return apiPost(`/orders/update-order-detail`,  data);
  },
  deleteOrderDetail: async (variantId, order_id) => {
    return apiPost(`/orders/destroy-order-detail/${variantId}`,  order_id);
  },
  uodateOrderQuantities: async (data) => {
    return apiPost(`/orders/update-quantities`,  data);
  },
  destroy: async (ids) => {
    return apiPost(`/orders/destroy`,  { ids });
  },
  create: async (formData) => {
    return apiPost(`/orders/create`,  formData);
  },
  createUser: async (formData) => {
    return apiPost(`/orders/create-user`,  formData);
  },
  searchByPhone: async (phone) => {
    return apiPost(`/orders/search-by-phone`,
      phone,
    );
  },
  getAllProducts: async ({page, per_page, sortorder, keyword, filter_category}) => {
    return apiGet("/orders/get-product-variant", {
      params: { page, per_page, sortorder, keyword, filter_category },
    });
  },
  categories: async () => {
    return apiGet("/orders/category-products");
  },
  orderTrash: async ({ page, per_page, sortorder, keyword, filter_status, filter_payment_status, filter_shipping_status }) => {
    return apiGet("orders/trash", {
      params: { page, per_page, sortorder, keyword, filter_status, filter_payment_status, filter_shipping_status },
    });
  },
  restore: async (ids) => {
    return apiPost("/orders/restore", { ids });
  },
  forceDelete: async (id) => {
    return apiDelete(`/orders/force-delete/${id}`);
  },

};
export { OrderService };
