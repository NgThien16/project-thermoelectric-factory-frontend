import { useEffect, useState } from "react";
import { Card, Table, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getWorkOrdersForExport } from "../../service/materials_manager/ExportMaterialService.js";

export default function ForemanList() {
    const navigate = useNavigate();
    const [workOrders, setWorkOrders] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getWorkOrdersForExport("", "");
                if (Array.isArray(data)) {
                    setWorkOrders(data);
                } else {
                    setWorkOrders([]);
                }
            } catch (error) {
                console.error("Lỗi API Quản Đốc:", error);
            }
        };
        loadData();
    }, []);

    const renderStatusBadge = (status) => {
        switch (status) {
            case "CHUA_YEU_CAU_CAP_PHAT":
                return <Badge bg="danger">Chưa lập danh sách</Badge>;
            case "CHO_CAP_PHAT":
                return <Badge bg="warning" text="dark">Đang chờ Thủ kho duyệt</Badge>;
            case "DA_CAP_PHAT":
                return <Badge bg="success">Đã hoàn tất cấp phát</Badge>;
            default:
                // Nếu trạng thái rỗng hoặc lạ, hiển thị Badge mặc định chứ không để sập giao diện
                return <Badge bg="secondary">Trạng thái: {status || "Chưa rõ"}</Badge>;
        }
    };

    return (
        <div className="container mt-4">
            <h4 className="fw-bold mb-4">Danh Sách Quản Đốc: Yêu Cầu Cấp Vật Tư</h4>
            <Card className="shadow-sm">
                <Table bordered hover className="text-center align-middle mb-0">
                    <thead className="table-dark">
                    <tr>
                        <th>Mã Phiếu</th>
                        <th>Nội dung sự cố</th>
                        <th>Trạng thái vật tư</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {workOrders && workOrders.length > 0 ? (
                        workOrders.map(item => (
                            <tr key={item?.id || Math.random()}>
                                <td className="fw-bold">#{item?.id || "N/A"}</td>
                                <td className="text-start">{item?.description || "Không có mô tả"}</td>

                                {/* Gọi hàm bảo hiểm tại đây */}
                                <td>{renderStatusBadge(item?.materialStatus)}</td>

                                <td>
                                    <Button
                                        variant={item?.materialStatus === "DA_CAP_PHAT" ? "outline-secondary" : "primary"}
                                        size="sm"
                                        onClick={() => item?.id && navigate(`/material-export/supply-slip/${item.id}`)}
                                    >
                                        {item?.materialStatus === "DA_CAP_PHAT" ? "Xem lại" : "Lập/Sửa yêu cầu cấp"}
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4">Hiện tại không có yêu cầu cấp vật tư nào hoặc lỗi nạp mảng.</td></tr>
                    )}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
}