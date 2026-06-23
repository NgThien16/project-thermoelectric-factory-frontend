import axiosInstance from "../../api/axiosInstance";

export const getWorkOrderByRepairOrder = async (repairOrderId) => {
    const res = await axiosInstance.get(
        `/work-order-completion/repair-orders/${repairOrderId}`
    );
    return res.data;
};

export const closeWorkOrderCompletion = async (workOrderId) => {
    const res = await axiosInstance.put(
        `/work-order-completion/${workOrderId}/close`
    );
    return res.data;
};
