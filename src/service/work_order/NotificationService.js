import axiosInstance from "../../api/axiosInstance";

export const getWorkOrderNotification = async () => {
    const res = await axiosInstance.get(
        "/work-orders/notifications"
    );
    return res.data;
};
export const getPendingMaterialCount = async () => {
    const res = await axiosInstance.get(
        "/material-export/pending-count"
    );
    return res.data;
};
export const getRequestMaterialCount = async () => {
    const res = await axiosInstance.get(
        "/material-export/request-material"
    );
    return res.data;
};
