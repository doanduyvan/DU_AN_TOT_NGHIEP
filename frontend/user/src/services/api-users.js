import axios from "../utils/axios-customize";

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

};
export { UsersService };
