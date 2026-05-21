import axiosInstance from "../../api/axiosInstance.js";

export const UserRoleService = {
    assignRole: (userId, roleId) =>
        axiosInstance
            .post(`/users/${userId}/roles/${roleId}`)
            .then(res => res.data),

    removeRole: (userId, roleId) =>
        axiosInstance
            .delete(`/users/${userId}/roles/${roleId}`)
            .then(res => res.data),

    getRolesByUser: (userId) =>
        axiosInstance
            .get(`/user-roles/user/${userId}`)
            .then(res => res.data)
};