import { useEffect, useRef, useState, useCallback } from "react";
import { Modal, Button, Table, Spinner, Row, Col } from "react-bootstrap";
import { FaFilePdf, FaUserEdit } from "react-icons/fa";
import { getWorkOrderDetail } from "../../service/work_order/WorkOrderService";
import { getRoleLabel } from "../../utils/workOrderRoles";
import { exportWorkOrderPdf } from "../../pdf/WorkOrderPdf";
import UpdateAssignmentModal from "./UpdateAssignmentModal";

const formatDate = (d) => d ? new Date(d).toLocaleString("vi-VN") : "—";

// Thêm prop hideAssignment
const WorkOrderDetailModal = ({ show, onHide, workOrderId, onAssignmentUpdated, extraFooter, hideAssignment }) => {

    const printRef = useRef(null);

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const loadDetail = useCallback(async () => {
        if (!workOrderId) return;
        setLoading(true);
        try {
            const res = await getWorkOrderDetail(workOrderId);
            setDetail(res);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }, [workOrderId]);

    useEffect(() => {
        if (show) {
            loadDetail();
        } else {
            setDetail(null);
        }
    }, [show, loadDetail]);

    const handleExportPdf = () => {
        if (!detail) return;
        setExporting(true);
        try {
            exportWorkOrderPdf(detail, workOrderId);
        } catch (e) {
            console.log(e);
        } finally {
            setExporting(false);
        }
    };

    const handleAssignmentUpdated = () => {
        loadDetail();
        if (onAssignmentUpdated) onAssignmentUpdated();
    };

    const sectionHeaderStyle = {
        marginTop: "-8px",
        marginLeft: "-8px",
        marginRight: "-8px"
    };

    return (
        <>
            <Modal show={show} onHide={onHide} size="xl" scrollable>
                <Modal.Header closeButton>
                    <Modal.Title className="fs-6">
                        Chi tiết phiếu công tác {detail?.code ? `- ${detail.code}` : ""}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-3" style={{ fontSize: "0.85rem" }}>
                    {loading || !detail ? (
                        <div className="d-flex justify-content-center p-5">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <div ref={printRef} style={{ background: "#fff" }}>

                            {/* HÀNG TRẠNG THÁI TỔNG QUAN */}
                            <div className="d-flex flex-wrap gap-2 mb-2 p-2 bg-light rounded">
                                <div><b>Mã phiếu:</b> {detail.code}</div>
                                <div className="text-muted">|</div>
                                <div><b>Trạng thái:</b> {detail.status}</div>
                                <div className="text-muted">|</div>
                                <div><b>VT:</b> {detail.materialStatus}</div>
                                <div className="text-muted">|</div>
                                <div><b>Bắt đầu:</b> {formatDate(detail.startDate)}</div>
                                <div className="text-muted">|</div>
                                <div><b>Kết thúc:</b> {formatDate(detail.endDate)}</div>
                            </div>

                            <Row className="g-2 mb-2">
                                {/* CỘT TRÁI: NGƯỜI LẬP + THIẾT BỊ */}
                                <Col md={6}>
                                    <div className="border rounded p-2 mb-2">
                                        <div className="fw-bold bg-dark text-white px-2 py-1 mb-1 rounded-top" style={sectionHeaderStyle}>
                                            I. THÔNG TIN NGƯỜI LẬP
                                        </div>
                                        <div><b>Người lập:</b> {detail.createdBy}</div>
                                        <div><b>Phòng ban:</b> {detail.createdDepartment}</div>
                                        <div><b>Chức vụ:</b> {detail.createdPosition}</div>
                                    </div>

                                    <div className="border rounded p-2">
                                        <div className="fw-bold bg-dark text-white px-2 py-1 mb-1 rounded-top" style={sectionHeaderStyle}>
                                            III. THÔNG TIN THIẾT BỊ
                                        </div>
                                        <div><b>Tên thiết bị:</b> {detail.equipmentName}</div>
                                        <div><b>Mã thiết bị:</b> {detail.equipmentCode}</div>
                                        <div><b>Hệ thống:</b> {detail.systemName}</div>
                                    </div>
                                </Col>

                                {/* CỘT PHẢI: YÊU CẦU SỬA CHỮA */}
                                <Col md={6}>
                                    <div className="border rounded p-2 h-100">
                                        <div className="fw-bold bg-dark text-white px-2 py-1 mb-1 rounded-top" style={sectionHeaderStyle}>
                                            II. YÊU CẦU SỬA CHỮA
                                        </div>
                                        <div><b>Tiêu đề:</b> {detail.repairTitle}</div>
                                        <div className="mt-1">
                                            <b>Mô tả:</b>
                                            <div className="text-muted" style={{ maxHeight: "90px", overflowY: "auto" }}>
                                                {detail.repairDescription}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* IV. PHÂN CÔNG NHÂN SỰ */}
                            <div className="fw-bold bg-dark text-white px-2 py-1 mb-1">
                                IV. PHÂN CÔNG NHÂN SỰ
                            </div>
                            <Table bordered size="sm" className="mb-2" style={{ fontSize: "0.8rem" }}>
                                <thead className="table-light">
                                <tr>
                                    <th style={{ width: "40px" }}>STT</th>
                                    <th>Họ tên</th>
                                    <th>Vai trò</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(detail.assignments || []).map((a, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{a.employeeName}</td>
                                        <td>{getRoleLabel(a.role)}</td>
                                    </tr>
                                ))}
                                {(!detail.assignments || detail.assignments.length === 0) && (
                                    <tr>
                                        <td colSpan={3} className="text-center text-muted">
                                            Chưa có phân công
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>

                            {/* V + VI: VẬT TƯ - 2 CỘT SONG SONG */}
                            <Row className="g-2">
                                <Col md={6}>
                                    <div className="fw-bold bg-dark text-white px-2 py-1 mb-1">
                                        V. VẬT TƯ TIÊU HAO
                                    </div>
                                    <Table bordered size="sm" className="mb-0" style={{ fontSize: "0.78rem" }}>
                                        <thead className="table-light">
                                        <tr>
                                            <th style={{ width: "30px" }}>STT</th>
                                            <th style={{ width: "55px" }}>Mã VT</th>
                                            <th>Tên vật tư</th>
                                            <th style={{ width: "40px" }}>ĐVT</th>
                                            <th style={{ width: "30px" }}>SL</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {(detail.consumables || []).map((c, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{c.code}</td>
                                                <td>{c.name}</td>
                                                <td>{c.unit}</td>
                                                <td>{c.quantity}</td>
                                            </tr>
                                        ))}
                                        {(!detail.consumables || detail.consumables.length === 0) && (
                                            <tr>
                                                <td colSpan={5} className="text-center text-muted">
                                                    Không có
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </Table>
                                </Col>

                                <Col md={6}>
                                    <div className="fw-bold bg-dark text-white px-2 py-1 mb-1">
                                        VI. PHỤ TÙNG THAY THẾ
                                    </div>
                                    <Table bordered size="sm" className="mb-0" style={{ fontSize: "0.78rem" }}>
                                        <thead className="table-light">
                                        <tr>
                                            <th style={{ width: "30px" }}>STT</th>
                                            <th style={{ width: "55px" }}>Mã PT</th>
                                            <th>Tên phụ tùng</th>
                                            <th style={{ width: "40px" }}>ĐVT</th>
                                            <th style={{ width: "30px" }}>SL</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {(detail.replacements || []).map((r, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{r.code}</td>
                                                <td>{r.name}</td>
                                                <td>{r.unit}</td>
                                                <td>{r.quantity}</td>
                                            </tr>
                                        ))}
                                        {(!detail.replacements || detail.replacements.length === 0) && (
                                            <tr>
                                                <td colSpan={5} className="text-center text-muted">
                                                    Không có
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>

                            <div className="text-end mt-2 small text-muted">
                                Người lập phiếu: <b className="text-dark">{detail.createdBy}</b>
                            </div>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer className="py-2">
                    <Button variant="outline-secondary" size="sm" onClick={onHide}>
                        {"Đóng"}
                    </Button>
                    {extraFooter && detail && extraFooter(detail)}
                    {!hideAssignment && (
                        <Button
                            variant="warning"
                            size="sm"
                            onClick={() => setShowUpdateModal(true)}
                            disabled={!detail}
                        >
                            <FaUserEdit className="me-2" />
                            {" Cập nhật phân công"}
                        </Button>
                    )}
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={handleExportPdf}
                        disabled={!detail || exporting}
                    >
                        <FaFilePdf className="me-2" />
                        {exporting ? "Đang xuất..." : "Xuất PDF"}
                    </Button>
                </Modal.Footer>
            </Modal>

            <UpdateAssignmentModal
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                workOrderId={workOrderId}
                currentAssignments={detail?.assignments}
                onUpdated={handleAssignmentUpdated}
            />
        </>
    );
};

export default WorkOrderDetailModal;