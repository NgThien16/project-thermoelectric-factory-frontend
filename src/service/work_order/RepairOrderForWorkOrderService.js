import axiosInstance from "../../api/axiosInstance";

export const searchRepairOrdersForWorkOrder =
    async (
        title = "",
        createdBy = "",
        equipmentId = "",
        repairStatus = "",
        hasWorkOrder = "",
        page = 0
    ) => {
        const res =
            await axiosInstance.get(
                `work-orders/repair-orders`,
                {
                    params: {
                        title,
                        createdBy,
                        equipmentId:
                            equipmentId || null,
                        repairStatus:
                            repairStatus || null,
                        hasWorkOrder:
                            hasWorkOrder === ""
                                ? null
                                : hasWorkOrder,
                        page
                    }
                }
            );
        return res.data;
    };