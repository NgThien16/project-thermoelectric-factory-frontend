import { useEffect, useRef, useState, useCallback } from "react";
import { Modal, Button, Table, Spinner } from "react-bootstrap";
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

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg" scrollable>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Chi tiết phiếu công tác {detail?.code ? `- ${detail.code}` : ""}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {loading || !detail ? (
                        <div className="d-flex justify-content-center p-5">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <div ref={printRef} style={{ background: "#fff" }}>
                            <h5 className="text-center fw-bold mb-4">PHIẾU CÔNG TÁC</h5>

                            <Table borderless size="sm" className="mb-4">
                                <tbody>
                                <tr>
                                    <td style={{ width: "160px" }}><b>Mã phiếu</b></td>
                                    <td>{detail.code}</td>
                                    <td style={{ width: "160px" }}><b>Trạng thái</b></td>
                                    <td>{detail.status}</td>
                                </tr>
                                <tr>
                                    <td><b>Trạng thái VT</b></td>
                                    <td>{detail.materialStatus}</td>
                                    <td><b>Bắt đầu</b></td>
                                    <td>{formatDate(detail.startDate)}</td>
                                </tr>
                                <tr>
                                    <td><b>Kết thúc</b></td>
                                    <td>{formatDate(detail.endDate)}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                </tbody>
                            </Table>

                            <h6 className="fw-bold border-bottom pb-2">I. THÔNG TIN NGƯỜI LẬP</h6>
                            <Table borderless size="sm" className="mb-4">
                                <tbody>
                                <tr>
                                    <td style={{ width: "160px" }}><b>Người lập</b></td>
                                    <td>{detail.createdBy}</td>
                                </tr>
                                <tr>
                                    <td><b>Phòng ban</b></td>
                                    <td>{detail.createdDepartment}</td>
                                </tr>
                                <tr>
                                    <td><b>Chức vụ</b></td>
                                    <td>{detail.createdPosition}</td>
                                </tr>
                                </tbody>
                            </Table>

                            <h6 className="fw-bold border-bottom pb-2">II. YÊU CẦU SỬA CHỮA</h6>
                            <p><b>Tiêu đề:</b> {detail.repairTitle}</p>
                            <p><b>Mô tả:</b> {detail.repairDescription}</p>

                            <h6 className="fw-bold border-bottom pb-2 mt-4">III. THÔNG TIN THIẾT BỊ</h6>
                            <Table borderless size="sm" className="mb-4">
                                <tbody>
                                <tr>
                                    <td style={{ width: "160px" }}><b>Tên thiết bị</b></td>
                                    <td>{detail.equipmentName}</td>
                                </tr>
                                <tr>
                                    <td><b>Mã thiết bị</b></td>
                                    <td>{detail.equipmentCode}</td>
                                </tr>
                                <tr>
                                    <td><b>Hệ thống</b></td>
                                    <td>{detail.systemName}</td>
                                </tr>
                                </tbody>
                            </Table>

                            <h6 className="fw-bold border-bottom pb-2">IV. PHÂN CÔNG NHÂN SỰ</h6>
                            <Table bordered size="sm" className="mb-4">
                                <thead className="table-light">
                                <tr>
                                    <th style={{ width: "50px" }}>STT</th>
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

                            <h6 className="fw-bold border-bottom pb-2">V. VẬT TƯ TIÊU HAO</h6>
                            <Table bordered size="sm" className="mb-4">
                                <thead className="table-light">
                                <tr>
                                    <th style={{ width: "50px" }}>STT</th>
                                    <th>Mã VT</th>
                                    <th>Tên vật tư</th>
                                    <th>ĐVT</th>
                                    <th>SL</th>
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
                                            Không có vật tư tiêu hao
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>

                            <h6 className="fw-bold border-bottom pb-2">VI. PHỤ TÙNG THAY THẾ</h6>
                            <Table bordered size="sm" className="mb-4">
                                <thead className="table-light">
                                <tr>
                                    <th style={{ width: "50px" }}>STT</th>
                                    <th>Mã PT</th>
                                    <th>Tên phụ tùng</th>
                                    <th>ĐVT</th>
                                    <th>SL</th>
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
                                            Không có phụ tùng thay thế
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>

                            <div className="text-end mt-4">
                                <p className="mb-0"><i>Người lập phiếu</i></p>
                                <p className="text-muted small">(Ký và ghi rõ họ tên)</p>
                                <p className="fw-bold mt-4">{detail.createdBy}</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={onHide}>
                        {"Đóng"}
                    </Button>
                    {extraFooter && detail && extraFooter(detail)}
                    {!hideAssignment && (
                        <Button
                            variant="warning"
                            onClick={() => setShowUpdateModal(true)}
                            disabled={!detail}
                        >
                            <FaUserEdit className="me-2" />
                            {" Cập nhật phân công"}
                        </Button>
                    )}
                    <Button
                        variant="danger"
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