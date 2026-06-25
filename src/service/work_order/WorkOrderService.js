import axiosInstance from "../../api/axiosInstance";

export const searchWorkOrders = async (
    code = "",
    equipment = "",
    status = "",
    page = 0
) => {
    const res = await axiosInstance.get(
        `/work-orders`,
        {
            params: {
                code,
                equipment,
                status,
                page
            }
        }
    );
    return res.data;
};

export const createWorkOrder = async (data) => {
        const res = await axiosInstance.post("/work-orders", data);
        return res.data;
};
export const getWorkOrderDetail = async (id) => {
    const res = await axiosInstance.get(`/work-orders/${id}`);
    return res.data;
};

export const updateWorkOrderAssignments = async (id, data) => {
    const res = await axiosInstance.put(`/work-orders/${id}/assignments`, data);
    return res.data;
};
