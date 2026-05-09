import axiosInstance from "../../../api/axiosInstance";

export async function searchEquipmentType(name, domain, page) {

    let url = `/equipment-types?page=${page}`;

    if (name) {
        url += `&name=${name}`;
    }

    if (domain) {
        url += `&domain=${domain}`;
    }

    try {

        const res = await axiosInstance.get(url);

        return {
            data: res.data.content,
            totalPages: res.data.totalPages
        };

    } catch (e) {

        console.log(e);

        return {
            data: [],
            totalPages: 0
        };
    }
}

export async function getListType() {

    try {

        const res = await axiosInstance.get('/equipment-types/list');

        return res.data;

    } catch (e) {

        console.log(e);

        return [];
    }
}

export async function saveEquipmentType(type) {

    try {

        const res = await axiosInstance.post('/equipment-types', type);

        return res.status === 201;

    } catch (e) {

        console.log(e);

        return false;
    }
}

export async function getEquipmentsByType(typeId) {

    try {

        const res = await axiosInstance.get(
            `/equipment-types/${typeId}/equipments`
        );

        return res.data;

    } catch (e) {

        console.log(e);

        return [];
    }
}

export async function getEquipmentDetail(typeId, equipmentId) {

    try {

        const res = await axiosInstance.get(
            `/equipment-types/${typeId}/equipments/${equipmentId}/detail`
        );

        return res.data;

    } catch (e) {

        console.log(e);

        return null;
    }
}