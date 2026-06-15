import { useEffect, useState } from "react";
import { Card, Table, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getWorkOrdersForExport } from "../../service/materials_manager/ExportMaterialService.js";

export default function WarehouseList() {
    const navigate = useNavigate();
    const [workOrders, setWorkOrders] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const allOrders = await getWorkOrdersForExport("", "");
            // 🆕 Lọc danh sách theo Enum: Chỉ lấy các phiếu CHO_CAP_PHAT hoặc DA_CAP_PHAT
            const filtered = allOrders.filter(w => w.materialStatus === "CHO_CAP_PHAT" || w.materialStatus === "DA_CAP_PHAT");
            setWorkOrders(filtered);
        };
        loadData();
    }, []);

    return (
        <div className="container mt-4">
            <h4 className="fw-bold mb-4 text-success">Danh Sách Thủ Kho: Tiếp Nhận & Xuất Kho</h4>
            <Card className="shadow-sm">
                <Table bordered hover className="text-center align-middle mb-0">
                    <thead className="table-success">
                    <tr>
                        <th>Mã Phiếu</th>
                        <th>Nội dung sự cố</th>
                        <th>Trạng thái xuất kho</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {workOrders.length > 0 ? workOrders.map(item => (
                        <tr key={item.id}>
                            <td className="fw-bold">#{item.id}</td>
                            <td className="text-start">{item.description}</td>
                            <td>
                                {/* 🆕 Áp dụng Enum mới */}
                                {item.materialStatus === "CHO_CAP_PHAT" ? (
                                    <Badge bg="warning" text="dark">Cần kiểm tra & Cấp phát</Badge>
                                ) : (
                                    <Badge bg="success">Đã xuất kho</Badge>
                                )}
                            </td>
                            <td>
                                <Button
                                    variant={item.materialStatus === "CHO_CAP_PHAT" ? "success" : "outline-secondary"}
                                    size="sm"
                                    onClick={() => navigate(`/storekeeper/approve/${item.id}`)}
                                >
                                    {item.materialStatus === "CHO_CAP_PHAT" ? "Xử lý cấp hàng" : "Xem chi tiết"}
                                </Button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="4">Hiện tại không có yêu cầu xuất kho nào.</td></tr>
                    )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
}