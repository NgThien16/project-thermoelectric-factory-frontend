import { useEffect, useState } from "react";
import { Table, Button, Badge, Card, Spinner } from "react-bootstrap";
import { FaEye, FaBoxes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance.js";

export default function WarehousePendingList() {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            // Gọi đúng endpoint vừa tạo ở Backend
            const response = await axiosInstance.get("/material-export/pending-list");
            setPendingOrders(response.data || []);
        } catch (error) {
            console.error("Lỗi tải danh sách chờ cấp phát:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white py-3">
                    <h5 className="mb-0 fw-bold">
                        <FaBoxes className="me-2 text-warning"/>
                        DANH SÁCH PHIẾU CHỜ CẤP PHÁT VẬT TƯ
                    </h5>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : pendingOrders.length > 0 ? (
                        <Table striped bordered hover responsive className="align-middle text-center">
                            <thead className="table-secondary">
                            <tr>
                                <th>STT</th>
                                <th>Mã Phiếu Sửa Chữa</th>
                                <th>Trạng Thái Vật Tư</th>
                                <th>Thao Tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {pendingOrders.map((order, index) => (
                                <tr key={order.id}>
                                    <td>{index + 1}</td>
                                    {/* Hiển thị ID của WorkOrder */}
                                    <td className="fw-bold text-primary">#{order.id}</td>
                                    <td>
                                        <Badge bg="warning" className="text-dark">
                                            {order.materialStatus || "CHO_CAP_PHAT"}
                                        </Badge>
                                    </td>
                                    <td>
                                        {/* Khi bấm, nhảy sang trang Export.jsx kèm ID của WorkOrder để thủ kho xử lý */}
                                        <Button
                                            variant="outline-primary" size="sm"
                                            onClick={() => navigate(`/material-export/release/${order.id}`)}
                                        >
                                            <FaEye className="me-1"/> Xử lý xuất kho
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            🎉 Tuyệt vời! Hiện tại không có phiếu nào chờ cấp phát vật tư.
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}