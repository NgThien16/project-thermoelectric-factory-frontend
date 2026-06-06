import axiosInstance from "../../api/axiosInstance.js";

export const EmployeeWorkPositionService = {
    getPositions: (employeeId) =>
        axiosInstance.get(`/employees/${employeeId}/positions`).then(res => res.data),

    assignPosition: (employeeId, positionId) =>
        axiosInstance.post(`/employees/${employeeId}/positions/${positionId}`).then(res => res.data),

    removePosition: (employeeId, positionId) =>
        axiosInstance.delete(`/employees/${employeeId}/positions/${positionId}`).then(res => res.data),

};