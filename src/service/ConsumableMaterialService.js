import axios from "axios";

const BE_URL = "http://localhost:8080/comsumable-materials";

export async function getAll() {
    try {
        const res = await axios.get(BE_URL);
        return res.status === 200;
    } catch (e) {
        console.log(e);
    }
    return [];
}

export async function add(consumableMaterial) {
    try {
        const res = await axios.post(BE_URL, consumableMaterial);
        return res.status === 200 || res.status === 201;
    } catch (e) {
        console.log(e);
    }
    return false;
}

export async function findById(id) {
    try {
        const res = await axios.get(`${BE_URL}/${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
    }
    return null;
}
