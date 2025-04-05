import axios from "../utils/axios-customize.js";
const getHeaders = () => ({
    'Content-Type': 'multipart/form-data',
});

const apiPost = async (url, data) => {
        const response = await axios.post(url, data, {
            headers: getHeaders(),
            withCredentials: true,

        });
        return response;
}

const apiGet = async (url) => {
        const response = await axios.get(url, {
            headers: getHeaders(),
            withCredentials: true,
        });
        return response;
}

const categoryNewsService = {
        getAllCategories: async () => {
            return apiGet("/categorynews");
        },
        getCategoryById: async (id) => {
            return apiGet(`/categorynews/getbyid/${id}`);
        },
        create_Category: async (data) => {
            return apiPost("/categorynews/create", data);
        },
        update: async (id, data) => {
            return apiPost(`/categorynews/update/${id}`, data);
        },
        destroy: async (ids) => {
            return apiPost("/categorynews/destroy", { ids });
        },
};
export { categoryNewsService };