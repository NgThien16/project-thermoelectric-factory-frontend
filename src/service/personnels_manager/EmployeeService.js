import axiosInstance from '../../api/axiosInstance.js';

export const EmployeeService = {
    getAll: () => axiosInstance.get('/employees'),
    getById: (id) => axiosInstance.get(`/employees/${id}`),
    create: (data) => axiosInstance.post('/employees', data),
    update: (id, data) => axiosInstance.put(`/employees/${id}`, data),
    delete: (id) => axiosInstance.delete(`/employees/${id}`),
    searchEmployees: (keyword = "", page = 0,size = 3) =>
        axiosInstance.get('/employees/search', { params: { keyword, page,size } })
            .then(res => res.data)
};