import axiosInstance from "../../api/axiosInstance.js";

export const UserService = {
    getAll: () => axiosInstance.get("/users").then(res => res.data),

    getById: (id) => axiosInstance.get(`/users/${id}`).then(res => res.data),

    create: (data) => axiosInstance.post("/users", data).then(res => res.data),

    update: (id, data) => axiosInstance.put(`/users/${id}`, data).then(res => res.data),

    delete: (id) => axiosInstance.delete(`/users/${id}`).then(res => res.data),

    searchUsers: (keyword = "", page = 0, size = 3) =>
        axiosInstance
            .get("/users/search", {
                params: {
                    keyword: keyword || "",
                    page: page ?? 0,
                    size: size ?? 3
                }
            })
            .then(res => res.data)
};