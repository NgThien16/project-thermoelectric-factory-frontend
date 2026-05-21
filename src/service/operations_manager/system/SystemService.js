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

export async function detailSystem(id,searchName,searchCode,domain,page) {
    let url = `/system-equipments/${id}/equipments?page=${page-1}`;
    if (searchName){
        url += `&name=${searchName}`;
    }
    if (searchCode){
        url += `&code=${searchCode}`;
    }
    if (domain){
        url += `&domain=${domain}`;
    }

    try {
        const res = await axiosInstance.get(url);
        return {
            data: res.data,
            totalPage: res.data.totalPages
        };
    }catch (e) {
        console.log(e);
        return {
            data: [],
            totaPage:0
        }
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