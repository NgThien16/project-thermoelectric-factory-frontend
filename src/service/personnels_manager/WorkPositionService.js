import axiosInstance from "../../api/axiosInstance.js";

export const WorkPositionService = {
    searchPositions: (keyword = "", page = 0, size = 5) =>
        axiosInstance.get("/work_positions", {
            params: { keyword, page, size }
        }).then(res => res.data),
    getAll: () => axiosInstance.get("/work_positions/all").then(res => res.data),
    create: (data) => axiosInstance.post("/work_positions", data).then(res => res.data),
    update: (id, data) => axiosInstance.put(`/work_positions/${id}`, data).then(res => res.data),
    delete: (id) => axiosInstance.delete(`/work_positions/${id}`).then(res => res.data)
};