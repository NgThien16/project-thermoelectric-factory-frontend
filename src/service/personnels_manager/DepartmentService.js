import axiosInstance from '../../api/axiosInstance.js';

export const DepartmentService = {
    getAll: () => axiosInstance.get('/departments'),
    getById: (id) => axiosInstance.get(`/departments/${id}`),
    create: (data) => axiosInstance.post('/departments', data),
    update: (id, data) => axiosInstance.put(`/departments/${id}`, data),
    delete: (id) => axiosInstance.delete(`/departments/${id}`),
    searchDepartments: (keyword = "", page = 0, size = 5) =>
        axiosInstance.get('/departments/search', {
            params: { keyword, page, size }
        }).then(res => res.data)
};