import axiosInstance from "../../../api/axiosInstance.js";


export const getAllMaterialsForDropdown = async () => {
    const response = await axiosInstance.get("/consumable-materials/list");
    return response.data;
};
export const getAllOrSearch = async ({
                                         code = "",
                                         name = "",
                                         page = 0,
                                         size = 5
                                     } = {}) => {

    try {
        const response = await axiosInstance.get(
            "/consumable-materials",
            {
                params: {
                    code: code || "",
                    name: name || "",
                    page: page || 0,
                    size: size
                }
            }
        );

        return response.data;

    } catch (e) {
        console.log("Lỗi API List:", e);
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