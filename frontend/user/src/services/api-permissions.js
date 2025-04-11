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

const PermissionsService = {
  callPermissions: async ({ page, per_page, sortorder, keyword }) => {
    return apiGet("/permissions", {
      params: { page, per_page, sortorder, keyword },
    });
  },
  create: async (formData) => {
    return apiPost("/permissions/create", formData);
  },
  destroy: async (ids) => {
    return apiPost("/permissions/destroy", { ids });
  },
  showPermission: async (id) => {
    return apiGet(`/permissions/show/${id}`);
  },
  update: async (formData, id) => {
    return apiPost(`/permissions/update/${id}`, formData);
  },
  permissionTrash: async ({ page, per_page, sortorder, keyword }) => {
    return apiGet("permissions/trash", {
      params: { page, per_page, sortorder, keyword },
    });
  },
  restore: async (ids) => {
    return apiPost("/permissions/restore", { ids });
  },
  forceDelete: async (id) => {
    return apiDelete(`/permissions/force-delete/${id}`);
  },
};

export { PermissionsService };
