import axiosInstance from "../../../api/axiosInstance";

export async function getListDomain() {

    try {
        const res = await axiosInstance.get('/domains');
        return res.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}