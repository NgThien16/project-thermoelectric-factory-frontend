import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table, Badge, Spinner } from "react-bootstrap";
import { FaArrowLeft, FaCheckCircle, FaBoxes, FaLock } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getRequestedConsumables,
    getRequestedReplacements,
    approveAndReleaseMaterials
} from "../../service/materials_manager/ExportMaterialService.js";

// Import axiosInstance để lấy trạng thái phiếu trực tiếp
import axiosInstance from "../../api/axiosInstance.js";

export default function WarehouseRelease() {
    const navigate = useNavigate();
    const { requestId } = useParams();

    const [requestedItems, setRequestedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Thêm state lưu trữ thông tin trạng thái vật tư của phiếu mẹ giống màn Quản đốc
    const [workOrderData, setWorkOrderData] = useState(null);

    useEffect(() => {
        if (requestId) {
            loadRequestedMaterials();
            loadWorkOrderDetails(requestId);
        }
    }, [requestId]);

    // Hàm lấy trạng thái vật tư thực tế từ bảng WorkOrder kỹ thuật
    const loadWorkOrderDetails = async (id) => {
        try {
            const response = await axiosInstance.get(`/material-export/work-order/${id}`);
            if (response && response.data) {
                setWorkOrderData(response.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải thông tin phiếu sửa chữa:", error);
        }
    };

    const loadRequestedMaterials = async () => {
        setLoading(true);
        try {
            const [dataConsumable, dataReplacement] = await Promise.all([
                getRequestedConsumables(requestId),
                getRequestedReplacements(requestId)
            ]);

            const combined = [
                ...dataConsumable.map(item => ({
                    id: item.id,
                    code: item.material.code,
                    name: item.material.name,
                    unit: item.material.unit || "Cái",
                    quantity: item.quantity,
                    type: "CONSUMABLE",
                    typeName: "Tiêu hao"
                })),
                ...dataReplacement.map(item => ({
                    id: item.id,
                    code: item.material.code,
                    name: item.material.name,
                    unit: item.material.unit || "Cái",
                    quantity: item.quantity,
                    type: "REPLACEMENT",
                    typeName: "Thay thế"
                }))
            ];
            setRequestedItems(combined);
        } catch (error) {
            console.error("Lỗi khi load dữ liệu:", error);
            toast.error("Không thể tải danh sách vật tư đề xuất!");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveRelease = async () => {
        if (requestedItems.length === 0) return toast.error("Phiếu này không có vật tư!");
        setSubmitting(true);
        try {
            const currentStaffId = 2; // Tạm thời gán ID thủ kho thực hiện duyệt
            await approveAndReleaseMaterials(requestId, currentStaffId);

            toast.success("🚀 Xuất kho thành công! Hệ thống đã trừ kho và cập nhật trạng thái phiếu.");

            // Cập nhật state cục bộ ngay để giao diện lập tức khóa nút bấm
            setWorkOrderData(prev => ({ ...prev, materialStatus: "RELEASED" }));
            navigate("/warehouse-dashboard");
        } catch (error) {
            const backendErrorMsg = error.response?.data?.message;
            if (backendErrorMsg) {
                toast.error(`❌ LỖI KHO: ${backendErrorMsg}`, { autoClose: 6000 });
            } else {
                toast.error("Xuất kho thất bại, vui lòng kiểm tra lại hệ thống.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5" style={{ marginTop: "100px" }}>
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted fw-bold">Đang tải danh sách vật tư chờ cấp phát...</p>
            </div>
        );
    }

    const isAlreadyReleased = workOrderData?.materialStatus === "RELEASED";

    return (
        <div className="container-fluid mt-4 px-4">
            <Card className="shadow border-0 mb-4">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-3">
                    <h4 className="mb-0 fw-bold">
                        <FaBoxes className="me-2 text-warning"/>  Thủ kho
                    </h4>
                    <Button as={Link} to="/warehouse-dashboard" variant="outline-light" size="sm" className="fw-semibold">
                        <FaArrowLeft className="me-2" /> Quay lại danh sách phiếu
                    </Button>
                </Card.Header>
            </Card>

            <Row>
                <Col lg={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-light py-3 d-flex justify-content-between align-items-center border-bottom">
                            <h5 className="mb-0 fw-bold text-secondary">
                                Danh sách vật tư, phụ tùng yêu cầu (Phiếu sửa chữa #{requestId})
                            </h5>
                            <Badge bg={isAlreadyReleased ? "success" : "primary"} className="p-2 fs-6 fw-semibold">
                                Trạng thái: {isAlreadyReleased ? "Đã Xuất Kho" : "Chờ Thủ Kho Duyệt"}
                            </Badge>
                        </Card.Header>

                        <Card.Body className="py-4">
                            <Table bordered hover responsive className="align-middle text-center mb-4 shadow-sm">
                                <thead className="table-dark text-white">
                                <tr>
                                    <th style={{ width: "6%" }}>STT</th>
                                    <th style={{ width: "15%" }}>Phân loại</th>
                                    <th style={{ width: "15%" }}>Mã vật tư</th>
                                    <th className="text-start ps-4">Tên vật tư / Phụ tùng thiết bị</th>
                                    <th style={{ width: "12%" }}>Đơn vị tính</th>
                                    <th style={{ width: "15%" }}>Số lượng cấp</th>
                                </tr>
                                </thead>
                                <tbody>
                                {requestedItems.length > 0 ? (
                                    requestedItems.map((item, index) => (
                                        <tr key={`${item.type}_${item.id}`}>
                                            <td className="fw-bold text-muted">{index + 1}</td>
                                            <td>
                                                <Badge bg={item.type === "CONSUMABLE" ? "info" : "warning"} className="text-white px-2 py-1">
                                                    {item.typeName}
                                                </Badge>
                                            </td>
                                            <td className="fw-bold text-primary">{item.code}</td>
                                            <td className="text-start ps-4 fw-semibold text-dark">{item.name}</td>
                                            <td><span className="badge bg-light text-dark border px-3 py-1">{item.unit}</span></td>
                                            <td className="fw-bold text-danger fs-5">{item.quantity}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-muted py-5 fw-semibold">
                                            Không tìm thấy dữ liệu yêu cầu cấp phát vật tư nào cho phiếu sửa chữa này.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>

                            {/* Khu vực nút bấm hành động Duyệt xuất kho thực tế */}
                            {requestedItems.length > 0 && (
                                <div className="d-flex justify-content-end mt-4 w-100">
                                    {isAlreadyReleased ? (
                                        <div className="alert alert-success fw-bold text-center w-100 fs-5 py-3 border-0 shadow-sm mb-0">
                                            ✅ Phiếu yêu cầu này đã được xuất kho thực tế hoàn tất! Lịch sử giao dịch EXPORT đã ghi nhận thành công.
                                        </div>
                                    ) : (
                                        <Button
                                            variant="success"
                                            size="lg"
                                            className="px-5 fw-bold shadow border-0"
                                            style={{ backgroundColor: "#28a745" }}
                                            onClick={handleApproveRelease}
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2"/>
                                                    Đang kiểm tra tồn kho...
                                                </>
                                            ) : (
                                                <>
                                                    <FaCheckCircle className="me-2" /> Xác nhận xuất kho thực tế
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}