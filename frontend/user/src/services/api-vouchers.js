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
const VoucherService = {
  getVouchers: async ({ page, per_page, sortorder, keyword }) => {
    return apiGet("/vouchers", {
      params: { page, per_page, sortorder, keyword },
    });
  },
  create: async (formData) => {
    return apiPost("/vouchers/create", formData);
  },
  updateStatus: async (data) => {
    return apiPost("/vouchers/updatestatus", data);
  },
  roleLevel: async (formdata, id) => {
    return apiPost(`/users/rolelevel/${id}`, formdata);
  },
  updateUser: async (formdata, id) => {
    return apiPost(`/users/update/${id}`, formdata);
  },
  showRoles: async () => {
    return apiGet("/users/showroles");
  },
  destroy: async (ids) => {
    return apiPost('/users/destroy', { ids });
  },
  getUserById: async (id) => {
    return apiGet(`/users/${id}`);
  },
  userTrash: async ({ page, per_page, sortorder, keyword }) => {
      return apiGet('users/trash', {
          params: { page, per_page, sortorder, keyword},
      });
  },
  restore: async (ids) => {
      return apiPost("/users/restore", { ids });
  },
  forceDelete: async (id) => {
      return apiDelete(`/users/force-delete/${id}`);
  },
};
export { VoucherService };
