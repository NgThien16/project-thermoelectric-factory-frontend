import axiosInstance from "../../../api/axiosInstance";

export async function getListSystem() {
    try {
        const res = await axiosInstance.get('/system-equipments');
        return res.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function saveSystem(system) {
    try {
        const res = await axiosInstance.post('/system-equipments', system);

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
        const res = await axiosInstance.get(`/system-equipments/${id}/equipments`);
        return res.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function addEquipmentBySystem(id, equipment) {
    try {
        const res = await axiosInstance.post(
            `/system-equipments/${id}/equipments`,
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