import axiosInstance from '../../api/axiosInstance.js';

export const RoleService = {
    getAll: () => axiosInstance.get('/roles').then(res => res.data),
    getById: (id) => axiosInstance.get(`/roles/${id}`).then(res => res.data),
    create: (data) => axiosInstance.post('/roles', data).then(res => res.data),
    update: (id, data) => axiosInstance.put(`/roles/${id}`, data).then(res => res.data),
    delete: (id) => axiosInstance.delete(`/roles/${id}`).then(res => res.data),
    searchRoles: (keyword = "", page = 0, size = 3) =>
        axiosInstance.get('/roles/search', {params: {keyword, page, size}})
            .then(res => res.data)
};