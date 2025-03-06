import axios from "../utils/axios-customize";
const getHeaders = () => ({
    'Content-Type': 'multipart/form-data',
});

const apiPost = async (url, data) => {
    try {
        const response = await axios.post(url, data, {
            headers: getHeaders(),
            withCredentials: true,

        });
        return response;
    } catch (error) {
        console.log("lỗi khi gọi api, file: api",error);
        throw error;
    }
}

const apiGet = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: getHeaders(),
            withCredentials: true,
        });
        return response;
    } catch (error) {
        console.log("lỗi khi gọi api, file: api",error);
        throw error;
    }
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
