import { useEffect, useState, useCallback } from "react";
import { Card, Table, Button, Form, Row, Col, Badge } from "react-bootstrap";
import { FaSearch, FaPlus, FaTools } from "react-icons/fa";
import { MaintenanceLogService } from "../../service/maintenance_log/maintenanceLogService";
import MaintenanceLogForm from "./MaintenanceLogForm";

export default function MaintenanceLogPage() {

    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [equipmentName, setEquipmentName] = useState("");
    const [showForm, setShowForm] = useState(false);

    const fetchData = useCallback(async (pageIndex = 0, name = "") => {
        try {
            const res = await MaintenanceLogService.search(pageIndex, 5, name);
            setData(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
            setPage(pageIndex);
        } catch (e) {
            console.log(e);
        }
    }, []);

    useEffect(() => {
        fetchData(0, "");
    }, [fetchData]);

    const handleSearch = () => {
        fetchData(0, equipmentName);
    };


    const formatDate = (d) => d ? new Date(d).toLocaleString("vi-VN") : "—";

    return (
        <div className="p-4">
            <h3 className="fw-bold mb-4">
                <FaTools className="me-2" />
                Lịch sử sửa chữa
            </h3>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Row className="g-3 align-items-end">
                        <Col md={8}>
                            <Form.Label>Tìm theo tên thiết bị</Form.Label>
                            <Form.Control
                                placeholder="Nhập tên thiết bị..."
                                value={equipmentName}
                                onChange={(e) => setEquipmentName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </Col>
                        <Col md={2}>
                            <Button variant="primary" className="w-100" onClick={handleSearch}>
                                <FaSearch className="me-2" />
                                Tìm
                            </Button>
                        </Col>
                        <Col md={2}>
                            <Button
                                variant="success"
                                className="w-100"
                                onClick={() => setShowForm(true)}
                            >
                                <FaPlus className="me-2" />
                                Tạo log
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0">
                        <thead className="table-light">
                        <tr>
                            <th>Phiếu CT</th>
                            <th>Thiết bị</th>
                            <th>Mã TB</th>
                            <th>Mô tả</th>
                            <th>Ngày</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map(item => (
                            <tr key={item.id}>
                                <td>
                                    {item.workOrderCode
                                        ? <Badge bg="primary">{item.workOrderCode}</Badge>
                                        : <span className="text-muted">—</span>
                                    }
                                </td>
                                <td>{item.equipmentName}</td>
                                <td>{item.equipmentCode}</td>
                                <td>{item.description}</td>
                                <td>{formatDate(item.date)}</td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-muted">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Card.Body>

                {totalPages > 1 && (
                    <Card.Footer className="bg-white border-0 d-flex justify-content-center py-3">
                        <div className="d-flex gap-3 align-items-center">
                            <Button
                                size="sm"
                                variant="outline-primary"
                                disabled={page === 0}
                                onClick={() => fetchData(page - 1, equipmentName)}
                            >
                                ← Trước
                            </Button>
                            <span>Trang {page + 1} / {totalPages}</span>
                            <Button
                                size="sm"
                                variant="outline-primary"
                                disabled={page + 1 >= totalPages}
                                onClick={() => fetchData(page + 1, equipmentName)}
                            >
                                Sau →
                            </Button>
                        </div>
                    </Card.Footer>
                )}
            </Card>

            <MaintenanceLogForm
                show={showForm}
                onHide={() => setShowForm(false)}
                onSuccess={() => {
                    setShowForm(false);
                    fetchData(page, equipmentName);
                }}
            />
        </div>
    );
}