import axiosInstance from "../../api/axiosInstance.js";

export const UserService = {
    getAll: () => axiosInstance.get("/users"),

    getById: (id) => axiosInstance.get(`/users/${id}`),

    create: (data) => axiosInstance.post("/users", data),

    update: (id, data) => axiosInstance.put(`/users/${id}`, data),

    delete: (id) => axiosInstance.delete(`/users/${id}`),

    searchUsers: (keyword = "", page = 0, size = 5) =>
        axiosInstance.get("/users", {
                params: {keyword, page, size}
            }).then(res => res.data)
};
