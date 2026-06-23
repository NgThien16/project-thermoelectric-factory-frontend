import axiosInstance from '../../api/axiosInstance.js';

export const MaintenanceLogService = {

    // Lấy tất cả (có phân trang + search)
    getAll: (page = 0, size = 5, equipmentName = "") =>
        axiosInstance.get('/maintenance-logs', {
            params: {
                page,
                size,
                equipmentName
            }
        }),

    // Lấy theo ID
    getById: (id) =>
        axiosInstance.get(`/maintenance-logs/${id}`),

    // Tạo mới maintenance log
    create: (data) =>
        axiosInstance.post('/maintenance-logs', data),

    // Lấy theo WorkOrder
    getByWorkOrder: (workOrderId) =>
        axiosInstance.get(`/maintenance-logs/work-order/${workOrderId}`),

    // Lấy theo Equipment
    getByEquipment: (equipmentId) =>
        axiosInstance.get(`/maintenance-logs/equipment/${equipmentId}`),

    // Search (alias nếu bạn muốn dùng giống technical report style)
    searchLogs: (equipmentName = "", page = 0, size = 5) =>
        axiosInstance.get('/maintenance-logs', {
            params: {
                equipmentName,
                page,
                size
            }
        })
};