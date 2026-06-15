import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table, Badge, Spinner, Form } from "react-bootstrap"; // 🆕 Thêm Form để dùng Checkbox
import { FaArrowLeft, FaCheckCircle, FaBoxes } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Import axiosInstance để gọi API duyệt phân tầng kèm Body JSON trực tiếp
import axiosInstance from "../../api/axiosInstance.js";

export default function WarehouseRelease() {
    const navigate = useNavigate();
    const { requestId } = useParams();

    const [requestedItems, setRequestedItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState({}); // 🆕 State lưu trạng thái tick chọn cấp phát của Thủ kho
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [workOrderData, setWorkOrderData] = useState(null);

    // 🆕 CẬP NHẬT ENUM MỚI: Kiểm tra xem trạng thái đã là ĐÃ CẤP PHÁT chưa
    const isAlreadyReleased = workOrderData?.materialStatus === "DA_CAP_PHAT";

    useEffect(() => {
        if (requestId) {
            loadRequestedMaterials();
            loadWorkOrderDetails(requestId);
        }
    }, [requestId]);

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
            // Thay vì gọi Service cũ, gọi trực tiếp Endpoint để lấy data nguyên bản phục vụ Map ID chính xác
            const [consRes, repRes] = await Promise.all([
                axiosInstance.get(`/material-export/work-order-consumables/work-order/${requestId}`),
                axiosInstance.get(`/material-export/work-order-replacements/work-order/${requestId}`)
            ]);

            const combined = [];
            const initialChecked = {};

            if (consRes.data) {
                consRes.data.forEach(item => {
                    const uniqueKey = `CONSUMABLE_${item.material.id}`;
                    combined.push({
                        uniqueKey: uniqueKey,
                        materialId: item.material.id, // Giữ ID vật tư danh mục để gửi payload
                        code: item.material.code,
                        name: item.material.name,
                        unit: item.material.unit || "Cái",
                        quantity: item.quantity,
                        type: "CONSUMABLE",
                        typeName: "Tiêu hao"
                    });
                    initialChecked[uniqueKey] = true; // Mặc định bật sẵn, thiếu hàng thì thủ kho bỏ tick
                });
            }

            if (repRes.data) {
                repRes.data.forEach(item => {
                    const uniqueKey = `REPLACEMENT_${item.material.id}`;
                    combined.push({
                        uniqueKey: uniqueKey,
                        materialId: item.material.id,
                        code: item.material.code,
                        name: item.material.name,
                        unit: item.material.unit || "Cái",
                        quantity: item.quantity,
                        type: "REPLACEMENT",
                        typeName: "Thay thế"
                    });
                    initialChecked[uniqueKey] = true;
                });
            }

            setRequestedItems(combined);
            setCheckedItems(initialChecked);
        } catch (error) {
            console.error("Lỗi khi load dữ liệu vật tư yêu cầu:", error);
            toast.error("Không thể tải danh sách vật tư đề xuất!");
        } finally {
            setLoading(false);
        }
    };

    // 🆕 Hàm xử lý đảo trạng thái Checkbox khi click chuột
    const handleCheckboxChange = (uniqueKey) => {
        if (isAlreadyReleased) return;
        setCheckedItems(prev => ({
            ...prev,
            [uniqueKey]: !prev[uniqueKey]
        }));
    };

    // 🆕 Hàm duyệt cải tiến gửi kèm danh sách ID được chọn lên Backend
    const handleApproveRelease = async () => {
        if (requestedItems.length === 0) return toast.error("Phiếu này không có vật tư nào!");

        // Lọc ra danh sách ID thực tế được thủ kho đánh dấu cấp phát
        const approvedConsumableIds = requestedItems
            .filter(item => item.type === "CONSUMABLE" && checkedItems[item.key || item.uniqueKey])
            .map(item => item.materialId);

        const approvedReplacementIds = requestedItems
            .filter(item => item.type === "REPLACEMENT" && checkedItems[item.key || item.uniqueKey])
            .map(item => item.materialId);

        if (approvedConsumableIds.length === 0 && approvedReplacementIds.length === 0) {
            return toast.error("Vui lòng giữ tích chọn ít nhất 1 mặt hàng để thực hiện xuất kho!");
        }

        setSubmitting(true);
        try {
            const currentStaffId = JSON.parse(localStorage.getItem("user"))?.id || 2;

            // Gọi API phê duyệt phân tầng khớp cấu trúc Backend DTO nhận Body Object
            await axiosInstance.post(`/material-export/approve/${requestId}?staffId=${currentStaffId}`, {
                consumableIds: approvedConsumableIds,
                replacementIds: approvedReplacementIds
            });

            toast.success("🚀 Xuất kho thành công các vật tư được chọn! Hệ thống đã trừ kho.");

            // Đổi trạng thái cục bộ sang Enum mới để đóng băng màn hình xem lại tại chỗ
            setWorkOrderData(prev => ({ ...prev, materialStatus: "DA_CAP_PHAT" }));
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
                            {/* 🆕 Hiển thị Badge dựa theo mã trạng thái Enum mới */}
                            <Badge bg={isAlreadyReleased ? "success" : "warning"} className={`p-2 fs-6 fw-semibold ${!isAlreadyReleased && 'text-dark'}`}>
                                Trạng thái: {isAlreadyReleased ? "Đã Xuất Kho (DA_CAP_PHAT)" : "Chờ Kiểm Tra & Cấp Phát (CHO_CAP_PHAT)"}
                            </Badge>
                        </Card.Header>

                        <Card.Body className="py-4">
                            {/* Thanh Alert hướng dẫn thủ kho sử dụng chức năng Checkbox */}
                            {!isAlreadyReleased && (
                                <div className="alert alert-info border-0 shadow-sm mb-4 fw-semibold text-dark">
                                    💡 Hướng dẫn: Những mặt hàng nào tích dấu 🗹 sẽ được làm thủ tục xuất kho và trừ số lượng tồn. Nếu kho hết hàng đột xuất, bạn có thể bỏ tích chọn mục đó trước khi bấm Xác nhận!
                                </div>
                            )}

                            <Table bordered hover responsive className="align-middle text-center mb-4 shadow-sm">
                                <thead className="table-dark text-white">
                                <tr>
                                    {/* 🆕 Thêm cột Checkbox cho thủ kho thao tác */}
                                    <th style={{ width: "8%" }}>Cấp phát</th>
                                    <th style={{ width: "6%" }}>STT</th>
                                    <th style={{ width: "13%" }}>Phân loại</th>
                                    <th style={{ width: "15%" }}>Mã vật tư</th>
                                    <th className="text-start ps-4">Tên vật tư / Phụ tùng thiết bị</th>
                                    <th style={{ width: "12%" }}>Đơn vị tính</th>
                                    <th style={{ width: "12%" }}>Số lượng</th>
                                </tr>
                                </thead>
                                <tbody>
                                {requestedItems.length > 0 ? (
                                    requestedItems.map((item, index) => (
                                        <tr key={item.uniqueKey}>
                                            {/* 🆕 Checkbox động tương tác */}
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    className="fs-5 d-flex justify-content-center"
                                                    checked={checkedItems[item.uniqueKey] || false}
                                                    onChange={() => handleCheckboxChange(item.uniqueKey)}
                                                    disabled={isAlreadyReleased}
                                                />
                                            </td>
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
                                        <td colSpan="7" className="text-muted py-5 fw-semibold">
                                            Không tìm thấy dữ liệu yêu cầu cấp phát vật tư nào cho phiếu sửa chữa này.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>

                            {requestedItems.length > 0 && (
                                <div className="d-flex justify-content-end mt-4 w-100">
                                    {isAlreadyReleased ? (
                                        <div className="alert alert-success fw-bold text-center w-100 fs-5 py-3 border-0 shadow-sm mb-0">
                                            ✅ Phiếu yêu cầu này đã được xuất kho thực tế hoàn tất! Hệ thống đã ghi nhận lịch sử cấp phát thành công.
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
                                                    Đang kiểm tra kho & Trừ tồn...
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