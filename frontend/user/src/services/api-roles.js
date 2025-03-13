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

export const callRoles = async () => {
    return apiGet("/roles");
};

export const showPermission = async () => {
    return apiGet("/roles/permissions");
};

export const showRole = async (id) => {
    return apiGet(`/roles/showrole/${id}`);
};

export const createRole = async (formData) => {
    return apiPost("/roles/create", formData);
};

export const destroyRole = async (ids) => {
    return apiPost("/roles/destroy", { ids });
};

export const update = async (formData, id) => {
    return apiPost(`/roles/update/${id}`, formData);
};


