import axiosInstance from '../../api/axiosInstance.js';

export const MaintenanceLogService = {

    search: (page = 0, size = 5, equipmentName = "") =>
        axiosInstance.get('/maintenance-logs', {
            params: { page, size, equipmentName }
        }),

    create: (data) =>
        axiosInstance.post('/maintenance-logs', data),

    getWorkOrders: () =>
        axiosInstance.get('/work-orders'),

    getWorkOrderDetail: (id) =>
        axiosInstance.get(`/work-orders/${id}`)
};