import axiosInstance from "../../api/axiosInstance";

export const getRepairOrders = async (
    keyword = '',
    page = 0
) => {

    const res = await axiosInstance.get(
        `/repair-orders?keyword=${keyword}&page=${page}`
    );

    return res.data;
};

export const createRepairOrder = async (data) => {

    const res = await axiosInstance.post(
        '/repair-orders',
        data
    );

    return res.data;
};

export const updateRepairOrder = async (
    id,
    data
) => {

    const res = await axiosInstance.put(
        `/repair-orders/${id}`,
        data
    );

    return res.data;
};

export const deleteRepairOrder = async (id) => {

    await axiosInstance.delete(
        `/repair-orders/${id}`
    );
};

export const getEquipmentList = async (
    page = 0,
    keyword = ''
) => {

    const res = await axiosInstance.get(
        `/equipments?page=${page}&name=${keyword}`
    );

    return res.data;
};