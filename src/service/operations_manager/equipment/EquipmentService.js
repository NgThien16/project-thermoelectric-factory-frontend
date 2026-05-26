import axiosInstance from "../../../api/axiosInstance.js";

export async function searchListEquipment(searchName,searchCode,searchSystem,searchType,status,page) {
    let url = `/equipments?page=${page}`;
    if (searchName){
        url += `&name=${searchName}`;
    }
    if (searchCode){
        url += `&code=${searchCode}`;
    }if (searchSystem){
        url += `&system=${searchSystem}`;
    }if (searchType){
        url += `&type=${searchType}`;
    }
    if (status){
        url += `&status=${status}`;
    }

    try {
        const res = await axiosInstance.get(url);
        return {
            data: res.data.content,
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
export async function findById(id){
    try {

        const res = await axiosInstance.get(
            `/equipments/${id}`
        );

        return res.data;

    } catch (e) {

        console.log(e);

        return null;
    }
}

export async function getDetail(typeId, equipmentId) {

    try {
        const res = await axiosInstance.get(
            `/equipments/${typeId}/equipment-types/${equipmentId}/detail`
        );
        return res.data;
    } catch (e) {

        console.log(e);

        return null;
    }
}

export async function save(equipment){
    try {
        const res = await axiosInstance.post('/equipments',equipment);
        if (res.status===201) return res.data;
    }catch (e) {
        console.log(e);
        return false;
    }
}

export async function edit(equipment) {
    try {
        const res = await axiosInstance.put(`/equipments/${equipment.id}`,equipment);
        if (res.status===200) return true;
    }catch (e) {
        console.log(e);
        return false;
    }
}

export async function deleteById(id) {
    try {
        const res = await axiosInstance.delete(`/equipments/${id}`);
        if (res.status===200) return true;
    }catch (e) {
        console.log(e);
        return false;
    }
}