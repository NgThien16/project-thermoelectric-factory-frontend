import axios from "axios";

const BE_URL = "http://localhost:8080/equipment-types";

export async function searchEquipmentType(name, domain, page) {

    let url = `${BE_URL}?page=${page}`;

    if (name) {
        url += `&name=${name}`;
    }

    if (domain) {
        url += `&domain=${domain}`;
    }

    try {

        const res = await axios.get(url);

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

        const res = await axios.get(`${BE_URL}/list`);

        return res.data;

    } catch (e) {

        console.log(e);

        return [];
    }
}

export async function saveEquipmentType(type) {

    try {

        const res = await axios.post(`${BE_URL}`, type);

        return res.status === 201;

    } catch (e) {

        console.log(e);

        return false;
    }
}

export async function getEquipmentsByType(typeId) {

    try {

        const res = await axios.get(
            `${BE_URL}/${typeId}/equipments`
        );

        return res.data;

    } catch (e) {

        console.log(e);

        return [];
    }
}

export async function getEquipmentDetail(typeId, equipmentId) {

    try {

        const res = await axios.get(
            `${BE_URL}/${typeId}/equipments/${equipmentId}/detail`
        );

        return res.data;

    } catch (e) {

        console.log(e);

        return null;
    }
}