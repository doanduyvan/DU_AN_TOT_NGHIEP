import axios from "../utils/axios-customize.js";
const apiPost = async (url, data) => {
        const response = await axios.post(url, data);
        return response;
}

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

export const callCategories = async ({ page, per_page, sortorder, keyword }) => {
    return apiGet('categories', {
        params: { page, per_page, sortorder, keyword },
    });
};
export const categoryTrash = async ({ page, per_page, sortorder, keyword }) => {
    return apiGet('categories/trash', {
        params: { page, per_page, sortorder, keyword},
    });
};
export const getById = async (id) => {
    return apiGet(`/categories/getbyid/${id}`);
};

export const create_Category = async (data) => {
    return apiPost("/categories/create", data);
};

export const destroy = async (ids) => {
    return apiPost("/categories/destroy", { ids });
};
export const restore = async (ids) => {
    return apiPost("/categories/restore", { ids });
};
export const forceDelete = async (id) => {
    return apiDelete(`/categories/force-delete/${id}`);
};

export const update = (id, formData) => {
    return apiPost(`/categories/update/${id}`, formData);
};
