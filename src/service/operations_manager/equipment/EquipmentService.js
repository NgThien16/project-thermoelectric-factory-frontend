import axios from "axios";

const BE_URL = "http://localhost:8080/equipments";

export async function searchListEquipment(searchName,searchCode,status,page) {
    let url = `${BE_URL}?page=${page-1}`;
    if (searchName){
        url += `&name=${searchName}`;
    }
    if (searchCode){
        url += `&code=${searchCode}`;
    }
    if (status){
        url += `&status=${status}`;
    }

    try {
        const res = await axios.get(url);
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
export async function findById(id){
    try {
        const res = await axios.get(`${BE_URL}/${id}`);
        return res.data;
    }catch (e) {
        console.log(e);
        return [];
    }
}

export async function save(equipment){
    try {
        const res = await axios.post(`${BE_URL}`,equipment);
        if (res.status===201) return res.data;
    }catch (e) {
        console.log(e);
        return false;
    }
}

export async function edit(equipment) {
    try {
        const res = await axios.put(`${BE_URL}/${equipment.id}`,equipment);
        if (res.status===200) return true;
    }catch (e) {
        console.log(e);
        return false;
    }
}