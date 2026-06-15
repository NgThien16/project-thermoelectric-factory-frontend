import axiosInstance from "../../api/axiosInstance.js";

/**
 * 1. API lấy danh sách vật tư tiêu hao yêu cầu theo mã phiếu
 * ĐÃ SỬA: Thêm /material-export vào trước cho khớp đúng Controller Backend
 */
export const getRequestedConsumables = async (requestId) => {
    try {
        const response = await axiosInstance.get(`/material-export/work-order-consumables/work-order/${requestId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API lấy vật tư tiêu hao:", error);
        throw error;
    }
};

/**
 * 2. API lấy danh sách phụ tùng thay thế yêu cầu theo mã phiếu
 * ĐÃ SỬA: Thêm /material-export vào trước cho khớp đúng Controller Backend
 */
export const getRequestedReplacements = async (requestId) => {
    try {
        const response = await axiosInstance.get(`/material-export/work-order-replacements/work-order/${requestId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API lấy phụ tùng thay thế:", error);
        throw error;
    }
};

/**
 * 3. Hàm gọi API phục vụ cho Thủ kho xác nhận xuất kho
 * ĐÃ SỬA: Đường dẫn gốc của bạn là /material-export (không có 's')
 */
export const approveAndReleaseMaterials = async (workOrderId, staffId) => {
    try {
        const response = await axiosInstance.post(`/material-export/approve/${workOrderId}`, null, {
            params: { staffId: staffId }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API duyệt xuất kho:", error);
        throw error;
    }
};

/**
 * 4. API của Quản đốc (Giữ nguyên cấu trúc cũ của bạn)
 */
export const exportMaterialsToWorkOrder = async (payload) => {
    try {
        const response = await axiosInstance.post("/material-export/supply-slip", payload);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API cấp phát vật tư:", error);
        return false;
    }
};
export const getWorkOrdersForExport = async (status = "", search = "") => {
    try {
        // Gửi kèm params nếu Backend có hỗ trợ lọc ở phía Server,
        // nếu Backend trả hết thì Frontend của mình đã có logic tự .filter() rất an toàn.
        const response = await axiosInstance.get("/material-export/work-orders", {
            params: { status, search }
        });
        return response.data || [];
    } catch (error) {
        console.error("Lỗi khi lấy danh sách phiếu sửa chữa từ hệ thống:", error);
        return [];
    }
};