import {
    useEffect,
    useState
} from "react";
import { Card, Table, Button, Modal, Form, Row, Col, Badge } from "react-bootstrap";
import WorkOrderDetailModal from "../work_order/WorkOrderDetailModal.jsx";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFileAlt } from "react-icons/fa";

import {
    getRepairOrders,
    createRepairOrder,
    updateRepairOrder,
    deleteRepairOrder
} from "../../service/repair_order/requestService.js";

import { toast } from "react-toastify";
import Pagination from "react-bootstrap/Pagination";
import { showList } from "../../service/operations_manager/equipment/EquipmentService.js";
import { getWorkOrderByRepairOrder, closeWorkOrderCompletion } from "../../service/work_order/WorkOrderCompletionService.js";


const RequestManagement = () => {

    const [requests, setRequests] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [equipmentKeyword, setEquipmentKeyword] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({
        id: null,
        title: "",
        description: "",
        status: "CHO_DUYET",
        equipmentId: ""
    });
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageData, setMessageData] = useState({
        title: "",
        message: "",
        type: "success"
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [allEquipments, setAllEquipments] = useState([]);
    const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
    const [selectedWorkOrderId, setSelectedWorkOrderId] = useState(null);
    const [showCloseConfirmModal, setShowCloseConfirmModal] = useState(false);
    const [closingWorkOrderId, setClosingWorkOrderId] = useState(null);
    const [selectedRepairOrderStatus, setSelectedRepairOrderStatus] = useState(null);

    const showMessage = (title, message, type = "success") => {
        setMessageData({ title, message, type });
        setShowMessageModal(true);
    };

    const loadData = async () => {
        try {
            const res = await getRepairOrders(keyword, page);
            setRequests(res.content || []);
            setTotalPages(res.totalPages || 0);
        } catch {
            toast.error("Không tải được dữ liệu");
        }
    };

    const loadEquipments = async () => {
        try {
            const res = await showList();
            setAllEquipments(res || []);
            setEquipments(res || []);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        loadData();
    }, [page]);

    useEffect(() => {
        loadEquipments();
    }, []);

    const handleSearchEquipment = () => {
        if (!equipmentKeyword.trim()) {
            setEquipments(allEquipments);
        } else {
            const filtered = allEquipments.filter(e =>
                e.name.toLowerCase().includes(equipmentKeyword.toLowerCase()) ||
                e.code.toLowerCase().includes(equipmentKeyword.toLowerCase())
            );
            setEquipments(filtered);
        }
    };

    const handleSearch = async () => {
        try {
            const res = await getRepairOrders(keyword, 0);
            setPage(0);
            setRequests(res.content || []);
            setTotalPages(res.totalPages || 0);
        } catch {
            toast.error("Không tải được dữ liệu");
        }
    };

    const openCreateModal = () => {
        setIsEdit(false);
        setForm({
            id: null,
            title: "",
            description: "",
            status: "CHO_DUYET",
            equipmentId: ""
        });
        setEquipmentKeyword("");
        setEquipments(allEquipments);
        setShowModal(true);
    };

    const openEditModal = (request) => {
        setIsEdit(true);
        setForm({
            id: request.id,
            title: request.title,
            description: request.description,
            status: request.status,
            equipmentId: request.equipment?.id
        });
        setEquipmentKeyword("");
        setEquipments(allEquipments);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            const payload = {
                title: form.title,
                description: form.description,
                status: form.status,
                equipmentId: Number(form.equipmentId)
            };

            if (isEdit) {
                await updateRepairOrder(form.id, payload);
                showMessage("Thành công", "Cập nhật yêu cầu sửa chữa thành công", "success");
            } else {
                await createRepairOrder(payload);
                toast.success("Tạo yêu cầu sửa chữa thành công");
            }
            setShowModal(false);
            loadData();
        } catch (e) {
            console.log(e);
            showMessage("Lỗi", e.response?.data || "Có lỗi xảy ra", "danger");
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteRepairOrder(deleteId);
            toast.success("Xoá yêu cầu sửa chữa thành công");
            loadData();
        } catch {
            showMessage("Lỗi", "Không thể xóa yêu cầu này", "danger");
        } finally {
            setShowDeleteModal(false);
        }
    };

    const handleViewWorkOrder = async (repairOrderId, repairOrderStatus) => {
        try {
            const data = await getWorkOrderByRepairOrder(repairOrderId);
            setSelectedWorkOrderId(data.id);
            setSelectedRepairOrderStatus(repairOrderStatus);
            setShowWorkOrderModal(true);
        } catch {
            toast.error("Không tải được phiếu công tác");
        }
    };

    const handleCloseWorkOrder = async () => {
        try {
            await closeWorkOrderCompletion(closingWorkOrderId);
            toast.success("Đóng phiếu công tác thành công");
            setShowCloseConfirmModal(false);
            setShowWorkOrderModal(false);
            loadData();
        } catch (e) {
            showMessage("Lỗi", e.response?.data || "Không thể đóng phiếu", "danger");
            setShowCloseConfirmModal(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "CHO_DUYET":
                return <Badge bg="warning">Chờ duyệt</Badge>;
            case "DANG_THUC_HIEN":
                return <Badge bg="primary">Đang thực hiện</Badge>;
            case "DA_HOAN_THANH":
                return <Badge bg="success">Hoàn thành</Badge>;
            default:
                return <Badge bg="dark">{status}</Badge>;
        }
    };

    const canEditOrDelete = (status) => status === "CHO_DUYET";

    return (
        <div className="p-4">

            <div className="d-flex justify-content-between mb-4">
                <h3>Quản lý yêu cầu sửa chữa</h3>
                <Button variant="success" onClick={openCreateModal}>
                    <FaPlus /> Tạo yêu cầu
                </Button>
            </div>

            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <Row>
                        <Col md={10}>
                            <Form.Control
                                placeholder="Tìm kiếm..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </Col>
                        <Col md={2}>
                            <Button className="w-100" onClick={handleSearch}>
                                <FaSearch /> Tìm
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    <Table hover responsive>
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tiêu đề</th>
                            <th>Thiết bị</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.map((r, index) => (
                            <tr key={r.id}>
                                <td>{page * 3 + index + 1}</td>
                                <td>{r.title}</td>
                                <td>{r.equipment?.name}</td>
                                <td>{getStatusBadge(r.status)}</td>
                                <td>
                                    {r.createdAt
                                        ? new Date(r.createdAt).toLocaleDateString("vi-VN")
                                        : ""}
                                </td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        className="me-2"
                                        disabled={!canEditOrDelete(r.status)}
                                        title={!canEditOrDelete(r.status) ? "Yêu cầu đã được xử lý, không thể chỉnh sửa" : ""}
                                        onClick={() => openEditModal(r)}
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        disabled={!canEditOrDelete(r.status)}
                                        title={!canEditOrDelete(r.status) ? "Yêu cầu đã được xử lý, không thể xóa" : ""}
                                        onClick={() => {
                                            setDeleteId(r.id);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        <FaTrash />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline-info"
                                        className="ms-2"
                                        disabled={!["DANG_THUC_HIEN", "DA_HOAN_THANH"].includes(r.status)}
                                        title={
                                            !["DANG_THUC_HIEN", "DA_HOAN_THANH"].includes(r.status)
                                                ? "Chưa có phiếu công tác"
                                                : "Xem chi tiết phiếu công tác"
                                        }
                                        onClick={() => handleViewWorkOrder(r.id, r.status)}
                                    >
                                        <FaFileAlt />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-center mt-3">
                        <Pagination>
                            <Pagination.Prev
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                            />
                            {[...Array(totalPages).keys()].map((p) => (
                                <Pagination.Item
                                    key={p}
                                    active={p === page}
                                    onClick={() => setPage(p)}
                                >
                                    {p + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(page + 1)}
                            />
                        </Pagination>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal tạo/sửa */}
            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEdit ? "Cập nhật yêu cầu" : "Tạo yêu cầu sửa chữa"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tiêu đề</Form.Label>
                                <Form.Control
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tìm thiết bị</Form.Label>
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        placeholder="Tên thiết bị..."
                                        value={equipmentKeyword}
                                        onChange={(e) => setEquipmentKeyword(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearchEquipment()}
                                    />
                                    <Button onClick={handleSearchEquipment}>Lọc</Button>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Thiết bị</Form.Label>
                                <Form.Select
                                    value={form.equipmentId}
                                    onChange={(e) => setForm({ ...form, equipmentId: e.target.value })}
                                >
                                    <option value="">Chọn thiết bị</option>
                                    {equipments.map((e) => (
                                        <option key={e.id} value={e.id}>
                                            [{e.code}] {e.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal thông báo */}
            <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered>
                <Modal.Header
                    closeButton
                    className={messageData.type === "success" ? "bg-success text-white" : "bg-danger text-white"}
                >
                    <Modal.Title>{messageData.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{messageData.message}</Modal.Body>
                <Modal.Footer>
                    <Button
                        variant={messageData.type === "success" ? "success" : "danger"}
                        onClick={() => setShowMessageModal(false)}
                    >
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xác nhận xóa */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc muốn xóa yêu cầu sửa chữa này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={confirmDelete}>{"Xóa"}</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal chi tiết phiếu công tác */}
            <WorkOrderDetailModal
                show={showWorkOrderModal}
                onHide={() => setShowWorkOrderModal(false)}
                workOrderId={selectedWorkOrderId}
                onAssignmentUpdated={loadData}
                hideAssignment={true}
                extraFooter={(detail) => {
                    // FIX: detail.status trả về displayName ("Hoàn thành"), không phải tên enum thô ("HOAN_THANH")
                    return detail?.status === "Hoàn thành"
                        && selectedRepairOrderStatus !== "DA_HOAN_THANH"
                        && (
                            <Button
                                variant="danger"
                                onClick={() => {
                                    setClosingWorkOrderId(detail.id);
                                    setShowCloseConfirmModal(true);
                                }}
                            >
                                {"Đóng phiếu"}
                            </Button>
                        );
                }}
            />

            {/* Modal xác nhận đóng phiếu */}
            <Modal show={showCloseConfirmModal} onHide={() => setShowCloseConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận đóng phiếu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc muốn đóng phiếu công tác này? Yêu cầu sửa chữa sẽ chuyển sang trạng thái Hoàn thành.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCloseConfirmModal(false)}>
                        {"Hủy"}
                    </Button>
                    <Button variant="danger" onClick={handleCloseWorkOrder}>
                        {"Xác nhận"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RequestManagement;