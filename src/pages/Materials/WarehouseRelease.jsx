import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table, Badge, Spinner, Form } from "react-bootstrap";
import { FaArrowLeft, FaCheckCircle, FaBoxes, FaClock } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance.js";

export default function WarehouseRelease() {
    const navigate = useNavigate();
    const { requestId } = useParams();

    const [requestedItems, setRequestedItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [workOrderData, setWorkOrderData] = useState(null);

    // Tính toán từ danh sách item, không phụ thuộc vào materialStatus của work order nữa
    const allReleased = requestedItems.length > 0 && requestedItems.every(i => i.released);
    const someReleased = requestedItems.some(i => i.released);
    const pendingItems = requestedItems.filter(i => !i.released);

    useEffect(() => {
        if (requestId) {
            loadRequestedMaterials();
            loadWorkOrderDetails(requestId);
        }
    }, [requestId]);

    const loadWorkOrderDetails = async (id) => {
        try {
            const response = await axiosInstance.get(`/material-export/work-order/${id}`);
            if (response?.data) setWorkOrderData(response.data);
        } catch (error) {
            console.error("Lỗi khi tải thông tin phiếu sửa chữa:", error);
        }
    };

    const loadRequestedMaterials = async () => {
        setLoading(true);
        try {
            const [consRes, repRes] = await Promise.all([
                axiosInstance.get(`/material-export/work-order-consumables/work-order/${requestId}`),
                axiosInstance.get(`/material-export/work-order-replacements/work-order/${requestId}`)
            ]);

            const combined = [];
            const initialChecked = {};

            if (consRes.data) {
                consRes.data.forEach(item => {
                    const uniqueKey = `CONSUMABLE_${item.material.id}`;
                    const isReleased = !!item.released; // 🆕 đọc từ backend
                    combined.push({
                        uniqueKey,
                        materialId: item.material.id,
                        code: item.material.code,
                        name: item.material.name,
                        unit: item.material.unit || "Cái",
                        quantity: item.quantity,
                        type: "CONSUMABLE",
                        typeName: "Tiêu hao",
                        released: isReleased,
                    });
                    // 🆕 Đã cấp rồi: tick + disable | Chưa cấp: tick sẵn để gợi ý, thủ kho tự bỏ nếu hết hàng
                    initialChecked[uniqueKey] = true;
                });
            }

            if (repRes.data) {
                repRes.data.forEach(item => {
                    const uniqueKey = `REPLACEMENT_${item.material.id}`;
                    const isReleased = !!item.released;
                    combined.push({
                        uniqueKey,
                        materialId: item.material.id,
                        code: item.material.code,
                        name: item.material.name,
                        unit: item.material.unit || "Cái",
                        quantity: item.quantity,
                        type: "REPLACEMENT",
                        typeName: "Thay thế",
                        released: isReleased,
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

    const handleCheckboxChange = (uniqueKey, isReleased) => {
        if (isReleased) return; // 🆕 item đã cấp rồi, không cho đổi
        setCheckedItems(prev => ({ ...prev, [uniqueKey]: !prev[uniqueKey] }));
    };

    const handleApproveRelease = async () => {
        if (pendingItems.length === 0) return toast.error("Tất cả vật tư đã được xuất kho rồi!");

        // 🆕 Chỉ gửi những item CHƯA released và đang được tick
        const approvedConsumableIds = pendingItems
            .filter(item => item.type === "CONSUMABLE" && checkedItems[item.uniqueKey])
            .map(item => item.materialId);

        const approvedReplacementIds = pendingItems
            .filter(item => item.type === "REPLACEMENT" && checkedItems[item.uniqueKey])
            .map(item => item.materialId);

        if (approvedConsumableIds.length === 0 && approvedReplacementIds.length === 0) {
            return toast.error("Vui lòng chọn ít nhất 1 mặt hàng để xuất kho!");
        }

        setSubmitting(true);
        try {
            const currentStaffId = JSON.parse(localStorage.getItem("user"))?.id || 2;

            await axiosInstance.post(`/material-export/approve/${requestId}?staffId=${currentStaffId}`, {
                consumableIds: approvedConsumableIds,
                replacementIds: approvedReplacementIds
            });

            const releasedCount = approvedConsumableIds.length + approvedReplacementIds.length;
            toast.success(`🚀 Đã xuất kho ${releasedCount} mặt hàng! Hệ thống đã trừ tồn kho.`);

            // 🆕 Reload lại tại chỗ thay vì navigate đi — để thủ kho thấy phần còn lại
            await loadRequestedMaterials();
            await loadWorkOrderDetails(requestId);
        } catch (error) {
            const backendErrorMsg = error.response?.data?.message;
            toast.error(backendErrorMsg
                    ? `❌ LỖI KHO: ${backendErrorMsg}`
                    : "Xuất kho thất bại, vui lòng kiểm tra lại hệ thống.",
                { autoClose: 6000 }
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Badge trạng thái tổng
    const statusBadge = allReleased
        ? { bg: "success", text: "✅ Đã xuất kho hoàn tất" }
        : someReleased
            ? { bg: "primary", text: `🕐 Đã xuất một phần (còn ${pendingItems.length} mặt hàng chờ)` }
            : { bg: "warning", text: "⏳ Chờ kiểm tra & cấp phát" };

    return (
        <div className="container-fluid mt-4 px-4">
            <Card className="shadow border-0 mb-4">
                <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center py-3">
                    <h4 className="mb-0 fw-bold">
                        <FaBoxes className="me-2 text-warning"/> Thủ kho
                    </h4>
                    <Button as={Link} to="/warehouse-dashboard" variant="outline-light" size="sm" className="fw-semibold">
                        <FaArrowLeft className="me-2"/> Quay lại danh sách phiếu
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
                            <Badge bg={statusBadge.bg} className="p-2 fs-6 fw-semibold">
                                {statusBadge.text}
                            </Badge>
                        </Card.Header>

                        <Card.Body className="py-4">
                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary"/>
                                    <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
                                </div>
                            ) : (
                                <>
                                    {!allReleased && (
                                        <div className="alert alert-info border-0 shadow-sm mb-4 fw-semibold text-dark">
                                            💡 <strong>Hướng dẫn:</strong> Mặt hàng nào <span className="text-success">✅ đã xuất kho</span> sẽ bị khoá lại.
                                            Những mặt hàng <span className="text-warning">⏳ chưa cấp</span> mặc định được tick — bỏ tick nếu kho chưa đủ hàng.
                                            Bạn có thể quay lại cấp phần còn thiếu sau khi nhập hàng.
                                        </div>
                                    )}

                                    <Table bordered hover responsive className="align-middle text-center mb-4 shadow-sm">
                                        <thead className="table-dark text-white">
                                        <tr>
                                            <th style={{ width: "8%" }}>Cấp phát</th>
                                            <th style={{ width: "6%" }}>STT</th>
                                            <th style={{ width: "13%" }}>Phân loại</th>
                                            <th style={{ width: "15%" }}>Mã vật tư</th>
                                            <th className="text-start ps-4">Tên vật tư / Phụ tùng thiết bị</th>
                                            <th style={{ width: "12%" }}>Đơn vị tính</th>
                                            <th style={{ width: "12%" }}>Số lượng</th>
                                            <th style={{ width: "12%" }}>Trạng thái</th> {/* 🆕 */}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {requestedItems.length > 0 ? requestedItems.map((item, index) => (
                                            <tr
                                                key={item.uniqueKey}
                                                // 🆕 Làm mờ row đã xuất kho để phân biệt trực quan
                                                style={item.released ? { opacity: 0.55, backgroundColor: "#f8fff8" } : {}}
                                            >
                                                <td>
                                                    <Form.Check
                                                        type="checkbox"
                                                        className="fs-5 d-flex justify-content-center"
                                                        checked={item.released ? true : (checkedItems[item.uniqueKey] || false)}
                                                        onChange={() => handleCheckboxChange(item.uniqueKey, item.released)}
                                                        disabled={item.released} // 🆕 chỉ lock item đã cấp, không lock cả bảng
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
                                                {/* 🆕 Cột trạng thái từng dòng */}
                                                <td>
                                                    {item.released ? (
                                                        <Badge bg="success" className="px-2 py-1">✅ Đã xuất</Badge>
                                                    ) : (
                                                        <Badge bg="warning" className="text-dark px-2 py-1">
                                                            <FaClock className="me-1"/>Chờ cấp
                                                        </Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="8" className="text-muted py-5 fw-semibold">
                                                    Không tìm thấy dữ liệu yêu cầu cấp phát vật tư nào cho phiếu sửa chữa này.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </Table>

                                    {requestedItems.length > 0 && (
                                        <div className="d-flex justify-content-end mt-4 w-100">
                                            {allReleased ? (
                                                <div className="alert alert-success fw-bold text-center w-100 fs-5 py-3 border-0 shadow-sm mb-0">
                                                    ✅ Tất cả vật tư đã được xuất kho hoàn tất! Hệ thống đã ghi nhận lịch sử cấp phát.
                                                </div>
                                            ) : (
                                                <div className="d-flex align-items-center gap-3">
                                                    {someReleased && (
                                                        // 🆕 Nhắc nhở khi còn item chưa cấp
                                                        <span className="text-muted fst-italic">
                                                            Còn <strong className="text-danger">{pendingItems.length}</strong> mặt hàng chưa xuất kho.
                                                            Bạn có thể cấp phát chúng sau khi kho có đủ hàng.
                                                        </span>
                                                    )}
                                                    <Button
                                                        variant="success"
                                                        size="lg"
                                                        className="px-5 fw-bold shadow border-0"
                                                        onClick={handleApproveRelease}
                                                        disabled={submitting}
                                                    >
                                                        {submitting ? (
                                                            <><Spinner animation="border" size="sm" className="me-2"/>Đang kiểm tra kho & Trừ tồn...</>
                                                        ) : (
                                                            <><FaCheckCircle className="me-2"/>Xác nhận xuất kho thực tế</>
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}