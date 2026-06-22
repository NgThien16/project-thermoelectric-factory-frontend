export const WORK_ORDER_ROLES = [
    { value: "LANH_DAO_CONG_VIEC", label: "Lãnh đạo công việc" },
    { value: "CHI_HUY_TRUC_TIEP", label: "Chỉ huy trực tiếp" },
    { value: "GIAM_SAT_AN_TOAN", label: "Giám sát an toàn" },
    { value: "NHAN_VIEN_LAM_VIEC", label: "Nhân viên làm việc" }
];

export const getRoleLabel = (value) => {
    const found = WORK_ORDER_ROLES.find(r => r.value === value);
    return found ? found.label : value;
};