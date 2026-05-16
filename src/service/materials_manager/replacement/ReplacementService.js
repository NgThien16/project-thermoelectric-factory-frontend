import axiosInstance from "../../../api/axiosInstance.js";

// Lấy danh sách hoặc search
export const getAllOrSearch = async (
    code = "",
    name = "",
    page = 0
) => {

    try {

        const response = await axiosInstance.get(
            "/replacement-materials",
            {
                params: {
                    code,
                    name,
                    page,
                    size: 5
                }
            }
        );

        return response.data;

    } catch (e) {

        console.log(e);

        return {
            content: [],
            totalPages: 0,
            number: 0
        };
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
export async function update(replacementMaterial) {
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