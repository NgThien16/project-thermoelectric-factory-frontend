import axiosInstance from '../../api/axiosInstance.js';

export const PositionService = {
    getAll: () => axiosInstance.get('/positions'),
    getById: (id) => axiosInstance.get(`/positions/${id}`),
    create: (data) => axiosInstance.post('/positions', data),
    update: (id, data) => axiosInstance.put(`/positions/${id}`, data),
    delete: (id) => axiosInstance.delete(`/positions/${id}`),
    searchPositions: (keyword = "", page = 0, size = 3) =>
        axiosInstance.get('/positions/search', {
            params: { keyword, page, size }
        }).then(res => res.data)
};