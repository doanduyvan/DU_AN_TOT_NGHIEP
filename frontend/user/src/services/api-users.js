import axios from "../utils/axios-customize.js";

const apiPost = async (url, data) => {
  const response = await axios.post(url, data);
  return response;
};

const apiGet = async (url) => {
    const response = await axios.get(url);
    return response;
};

const UsersService = {
  getAllUsers: async () => {
    return apiGet("/users");
  },
  login: async (credentials) => {
    return apiPost("/login", credentials);
  },
  upadteStatus: async (data) => {
    return apiPost("/users/updatestatus", data);
  },
  updateUser: async (formdata, id) => {
    return apiPost(`/users/update/${id}`, formdata);
  },
  showRoles: async () => {
    return apiGet("/users/showroles");
  },
  destroy: async (id) => {
    return apiPost(`/users/destroy/${id}`);
  },
  getUserById: async (id) => {
    return apiGet(`/users/${id}`);
  },
};
export { UsersService };
