// ✅ Đưa ra ngoài component
const MATERIAL_STATUS_LABEL = {
    ISSUANCE_NOT_YET_REQUESTED: "Chưa Yêu Cầu Cấp Phát",
    PENDING_ISSUANCE: "Chờ Cấp Phát",
    ISSUED: "Đã Cấp Phát",
};

import { useEffect, useState } from "react";
import { Table, Button, Badge, Card, Spinner } from "react-bootstrap";
import { FaEye, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {getRequestList} from "../../service/materials_manager/ExportMaterialService.js";

export default function ManagerPendingList() {
    const [requestOrders, setRequestOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const data = await getRequestList();
            console.log("materialStatus sample:", data[0]?.materialStatus);
            setRequestOrders(data);
        } catch (error) {
            console.error("Lỗi giao diện khi tải danh sách của quản đốc:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white py-3">
                    <h5 className="mb-0 fw-bold">
                        <FaClipboardList className="me-2 text-info"/>
                        DANH SÁCH PHIẾU KHỞI TẠO YÊU CẦU VẬT TƯ
                    </h5>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="info" />
                        </div>
                    ) : requestOrders.length > 0 ? (
                        <Table striped bordered hover responsive className="align-middle text-center">
                            <thead className="table-secondary">
                            <tr>
                                <th>STT</th>
                                <th>Mã Phiếu Công Tác</th>
                                <th>Trạng Thái Vật Tư</th>
                                <th>Thao Tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {requestOrders.map((order, index) => (
                                <tr key={order.id}>
                                    <td>{index + 1}</td>
                                    <td className="fw-bold text-info">#{order.code}</td>
                                    <td>
                                        <Badge bg="info" className="text-white">
                                            {MATERIAL_STATUS_LABEL[order.materialStatus] || order.materialStatus}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-info" size="sm"
                                            onClick={() => navigate(`/material-export/supply-slip/${order.id}`)}
                                        >
                                            <FaEye className="me-1"/> Xem & Duyệt phiếu
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center py-5 text-muted">
                            🎉 Tuyệt vời! Không có phiếu sửa chữa nào đang chờ bạn phê duyệt vật tư.
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}