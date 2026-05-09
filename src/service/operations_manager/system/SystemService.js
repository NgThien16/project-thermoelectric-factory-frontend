import axios from "axios";

const BE_URL = "http://localhost:8080/system-equipments";

export async function getListSystem() {
    try {
        const res = await axios.get(`${BE_URL}`);
        return res.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function saveSystem(system) {
    try {
        const res = await axios.post(`${BE_URL}`, system);

        if (res.status === 201) {
            return true;
        }

    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function detailSystem(id) {
    try {
        const res = await axios.get(`${BE_URL}/${id}/equipments`);
        return res.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function addEquipmentBySystem(id, equipment) {
    try {
        const res = await axios.post(
            `${BE_URL}/${id}/equipments`,
            equipment
        );

        if (res.status === 201) {
            return true;
        }

    } catch (e) {
        console.log(e);
        return false;
    }
}