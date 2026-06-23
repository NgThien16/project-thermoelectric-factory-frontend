import axiosInstance from "../api/axiosInstance";

export const getDashboard = async () => {

    const res = await axiosInstance.get(
        "/dashboard"
    );

    return res.data;
};