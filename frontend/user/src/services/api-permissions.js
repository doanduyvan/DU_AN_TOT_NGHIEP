import axios from "../utils/axios-customize";

const getHeaders = () => ({
    'Content-Type': 'multipart/form-data',
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
            withCredentials: true
        });
        return response;
};

export const callPermissions = async () => {
    return apiGet("/permissions");
};

export const create = async (formData) => {
    return apiPost("/permissions/create", formData);
};

export const destroy = async (ids) => {
    return apiPost("/permissions/destroy", { ids });
};
export const showPermission = async (ids) => {
    return apiGet("/permissions", { ids });
};

export const update = async (formData, id) => {
    return apiPost(`/permissions/update/${id}`, formData);
};


