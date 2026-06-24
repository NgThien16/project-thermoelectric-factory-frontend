import axiosInstance from '../../api/axiosInstance.js';

export const TechnicalReportService = {
    getAll: () => axiosInstance.get('/technical-reports'),
    getById: (id) => axiosInstance.get(`/technical-reports/${id}`),
    create: (data) => axiosInstance.post('/technical-reports', data),
    update: (id, data) => axiosInstance.put(`/technical-reports/${id}`, data),
    delete: (id) => axiosInstance.delete(`/technical-reports/${id}`),
    getByWorkOrder: (workOrderId) =>
        axiosInstance.get(`/technical-reports/work-order/${workOrderId}`),

    getWorkOrders: () =>
        axiosInstance.get("/technical-reports/work-orders"),
    searchReports: (keyword = "", workOrderId = "", page = 0, size = 20) =>
        axiosInstance
            .get("/technical-reports/search", {
                params: {
                    keyword,
                    workOrderId: workOrderId || null,
                    page,
                    size
                }
            })
            .then((res) => res.data)
};