import axiosInstance from "../../../api/axiosInstance";

export async function getParametersByType(typeId) {

    try {

        const res = await axiosInstance.get(
            `/param-definitions/${typeId}/type`
        );

        return res.data;

    } catch (e) {

        console.log(e);
        return [];

    }
}