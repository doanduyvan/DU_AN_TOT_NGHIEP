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

export const callCategories = async (id = null) => {
    const url = id ? `/categories/${id}` : "/categories";
    return apiGet(url);
};

export const create_Category = async (data) => {
    return apiPost("/categories/create", data);
};

export const destroy = async (ids) => {
    return apiPost("/categories/delete", { ids });
};
export const update = (id, formData) => {
    return apiPost(`/categories/update/${id}`, formData);
};
