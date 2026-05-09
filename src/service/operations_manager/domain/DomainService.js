import axios from "axios";

const BE_URL = "http://localhost:8080/domains";

export async function getListDomain() {

    try {
        const res = await axios.get(`${BE_URL}`);
        return res.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}