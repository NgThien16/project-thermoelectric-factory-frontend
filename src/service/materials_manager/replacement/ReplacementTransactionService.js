import axiosInstance from "../../../api/axiosInstance.js";

export const getInventory = async (
    code = "",
    name = "",
    page = 0
) => {

    try {

        const response = await axiosInstance.get(
            "/replacement-transactions",
            {
                params: {
                    code: code || null,
                    name: name || null,
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
};

export const getHistory = async (
    keyword = "",
    type = "",
    from = "",
    to = "",
    page = 0
) => {

    try {

        const response = await axiosInstance.get(
            "/replacement-transactions/history",
            {
                params: {
                    type: type?.trim() ? type : null,
                    keyword: keyword?.trim() ? keyword : null,
                    from: from || null,
                    to: to || null,
                    page
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
};


// Thêm mới
export async function save (replacementTransaction) {

    try {

        const res = await axiosInstance.post(
            "/replacement-transactions",
            replacementTransaction
        );

        return res.data;

    } catch (e) {

        console.log(e);

        return false;
    }
}