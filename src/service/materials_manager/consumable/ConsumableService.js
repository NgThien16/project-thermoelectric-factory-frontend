import axiosInstance from "../../../api/axiosInstance.js";

export const getAllOrSearch = async (
code = "",
    name = "",
    page = 0
) => {

    try {

        const response = await axiosInstance.get(
            "/consumable-materials",
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
        const res = await axiosInstance.get(`/consumable-materials/${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

// Thêm mới
export async function save(consumableMaterial) {
    try {
        const res = await axiosInstance.post(
            "/consumable-materials",
            consumableMaterial
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
export async function update(consumableMaterial) {
    try {
        const res = await axiosInstance.put(
            `/consumable-materials/${consumableMaterial.id}`,
            consumableMaterial
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
            `/consumable-materials/${id}`
        );

        return res.status === 204;
    } catch (e) {
        console.log(e);
        return false;
    }
}