import axiosInstance from "../../../api/axiosInstance.js";

// Lấy danh sách hoặc search
export async function getAllOrSearch(keyword = "") {
    let url = "/replacement-materials";

    if (keyword && keyword.trim() !== "") {
        url += `?keyword=${keyword}`;
    }

    try {
        const res = await axiosInstance.get(url);
        return res.data;
    } catch (e) {
        console.log(e);
        return [];
    }
}

// Tìm theo ID
export async function findById(id) {
    try {
        const res = await axiosInstance.get(`/replacement-materials/${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

// Thêm mới
export async function save(replacementMaterial) {
    try {
        const res = await axiosInstance.post(
            "/replacement-materials",
            replacementMaterial
        );

        if (res.status === 201) {
            return res.data;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

// Cập nhật
export async function edit(replacementMaterial) {
    try {
        const res = await axiosInstance.put(
            `/replacement-materials/${replacementMaterial.id}`,
            replacementMaterial
        );

        if (res.status === 200) {
            return res.data;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}

// Xóa
export async function remove(id) {
    try {
        const res = await axiosInstance.delete(
            `/replacement-materials/${id}`
        );

        return res.status === 204;
    } catch (e) {
        console.log(e);
        return false;
    }
}