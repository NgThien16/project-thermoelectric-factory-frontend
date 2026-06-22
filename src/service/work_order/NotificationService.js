import axiosInstance from "../../api/axiosInstance";

export const getWorkOrderNotification = async () => {
    const res = await axiosInstance.get(
        "/work-orders/notifications"
    );
    return res.data;
};