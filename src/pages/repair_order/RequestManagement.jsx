import {
    useEffect,
    useState
} from "react";

import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Row,
    Col,
    Badge
} from "react-bootstrap";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch
} from "react-icons/fa";

import {
    getRepairOrders,
    createRepairOrder,
    updateRepairOrder,
    deleteRepairOrder,
    getEquipmentList
} from "../../service/repair_order/requestService.js";

import { toast } from "react-toastify";

const RequestManagement = () => {

    const [requests, setRequests] = useState([]);

    const [equipments, setEquipments] =
        useState([]);

    const [keyword, setKeyword] =
        useState("");

    const [page, setPage] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(0);

    const [showModal, setShowModal] =
        useState(false);

    const [equipmentKeyword,
        setEquipmentKeyword] = useState("");

    const [isEdit, setIsEdit] =
        useState(false);

    const [form, setForm] = useState({
        id: null,
        title: "",
        description: "",
        status: "PENDING",
        equipmentId: ""
    });

    const loadData = async () => {

        try {

            const res =
                await getRepairOrders(
                    keyword,
                    page
                );

            setRequests(
                res.content || []
            );

            setTotalPages(
                res.totalPages || 0
            );

        } catch {

            toast.error(
                "Không tải được dữ liệu"
            );
        }
    };

    const loadEquipments = async () => {

        try {

            const res =
                await getEquipmentList(
                    0,
                    equipmentKeyword
                );

            setEquipments(
                res.content || []
            );

        } catch (e) {

            console.log(e);
        }
    };

    useEffect(() => {

        loadData();

        loadEquipments();

    }, [page]);

    const handleSearchEquipment = () => {

        loadEquipments();
    };

    const handleSearch = () => {

        setPage(0);

        loadData();
    };

    const openCreateModal = () => {

        setIsEdit(false);

        setForm({
            id: null,
            title: "",
            description: "",
            status: "PENDING",
            equipmentId: ""
        });

        setShowModal(true);
    };

    const openEditModal = (
        request
    ) => {

        setIsEdit(true);

        setForm({
            id: request.id,
            title: request.title,
            description:
            request.description,
            status: request.status,
            equipmentId:
            request.equipment?.id
        });

        setShowModal(true);
    };

    const handleSave = async () => {

        try {

            const payload = {

                title: form.title,

                description:
                form.description,

                status: form.status,

                equipmentId:
                    Number(form.equipmentId)
            };

            if (isEdit) {

                await updateRepairOrder(
                    form.id,
                    payload
                );

                toast.success(
                    "Cập nhật thành công"
                );

            } else {

                await createRepairOrder(
                    payload
                );

                toast.success(
                    "Tạo yêu cầu thành công"
                );
            }

            setShowModal(false);

            loadData();

        } catch (e) {

            console.log(e);

            toast.error(
                "Có lỗi xảy ra"
            );
        }
    };

    const handleDelete = async (id) => {

        const ok = window.confirm(
            "⚠️ Bạn có chắc muốn xóa yêu cầu sửa chữa này?\n\nSau khi xóa sẽ không thể khôi phục."
        );

        if (!ok) return;

        try {

            await deleteRepairOrder(id);

            toast.success(
                "🗑️ Xóa yêu cầu sửa chữa thành công!",
                {
                    autoClose: 2000
                }
            );

            loadData();

        } catch (e) {

            console.log(e);

            toast.error(
                "❌ Không thể xóa.\nYêu cầu này đã được lập Work Order hoặc đang được sử dụng.",
                {
                    autoClose: 3500
                }
            );
        }
    };
    const getStatusBadge = (status) => {
        switch (status) {
            case "PENDING":
                return <Badge bg="warning">Chờ xử lý</Badge>;

            case "APPROVED":
                return <Badge bg="info">Đã duyệt</Badge>;

            case "IN_PROGRESS":
                return <Badge bg="primary">Đang thực hiện</Badge>;

            case "COMPLETED":
                return <Badge bg="success">Hoàn thành</Badge>;

            case "REJECTED":
                return <Badge bg="danger">Từ chối</Badge>;

            case "CANCELLED":
                return <Badge bg="secondary">Đã hủy</Badge>;

            default:
                return <Badge bg="dark">{status}</Badge>;
        }
    };
    const canEditOrDelete = (status) => {
        return status === "PENDING";
    };
    return (

        <div className="p-4">

            <div className="d-flex justify-content-between mb-4">

                <h3>
                    Quản lý yêu cầu sửa chữa
                </h3>

                <Button
                    variant="success"
                    onClick={
                        openCreateModal
                    }
                >
                    <FaPlus />
                    {" "}
                    Tạo yêu cầu
                </Button>

            </div>

            <Card className="shadow-sm border-0 mb-4">

                <Card.Body>

                    <Row>

                        <Col md={10}>

                            <Form.Control
                                placeholder="Tìm kiếm..."
                                value={keyword}
                                onChange={(e) =>
                                    setKeyword(
                                        e.target.value
                                    )
                                }
                            />

                        </Col>

                        <Col md={2}>

                            <Button
                                className="w-100"
                                onClick={
                                    handleSearch
                                }
                            >
                                <FaSearch />
                                {" "}
                                Tìm
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

                            <th>ID</th>

                            <th>Tiêu đề</th>

                            <th>Thiết bị</th>

                            <th>Trạng thái</th>

                            <th>Ngày tạo</th>

                            <th>Thao tác</th>

                        </tr>

                        </thead>

                        <tbody>

                        {requests.map(
                            (r) => (

                                <tr key={r.id}>

                                    <td>{r.id}</td>

                                    <td>{r.title}</td>

                                    <td>
                                        {r.equipment?.name}
                                    </td>

                                    <td>
                                        {getStatusBadge(
                                            r.status
                                        )}
                                    </td>

                                    <td>
                                        {r.createdAt
                                            ? new Date(
                                                r.createdAt
                                            ).toLocaleDateString(
                                                "vi-VN"
                                            )
                                            : ""}
                                    </td>

                                    <td>

                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="me-2"
                                            disabled={!canEditOrDelete(r.status)}
                                            title={
                                                !canEditOrDelete(r.status)
                                                    ? "Yêu cầu đã được xử lý, không thể chỉnh sửa"
                                                    : ""
                                            }
                                            onClick={() => openEditModal(r)}
                                        >
                                            <FaEdit />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            disabled={!canEditOrDelete(r.status)}
                                            title={
                                                !canEditOrDelete(r.status)
                                                    ? "Yêu cầu đã được xử lý, không thể xóa"
                                                    : ""
                                            }
                                            onClick={() => handleDelete(r.id)}
                                        >
                                            <FaTrash />
                                        </Button>

                                    </td>

                                </tr>
                            )
                        )}

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

            <Modal
                size="lg"
                show={showModal}
                onHide={() =>
                    setShowModal(false)
                }
            >

                <Modal.Header closeButton>

                    <Modal.Title>

                        {isEdit
                            ? "Cập nhật yêu cầu"
                            : "Tạo yêu cầu sửa chữa"}

                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    <Row>

                        <Col md={12}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Tiêu đề
                                </Form.Label>

                                <Form.Control
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            title:
                                            e.target.value
                                        })
                                    }
                                />

                            </Form.Group>

                        </Col>

                        <Col md={12}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Tìm thiết bị
                                </Form.Label>

                                <div className="d-flex gap-2">

                                    <Form.Control
                                        placeholder="Tên thiết bị..."
                                        value={
                                            equipmentKeyword
                                        }
                                        onChange={(e) =>
                                            setEquipmentKeyword(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <Button
                                        onClick={
                                            handleSearchEquipment
                                        }
                                    >
                                        Lọc
                                    </Button>

                                </div>

                            </Form.Group>

                        </Col>

                        <Col md={12}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Thiết bị
                                </Form.Label>

                                <Form.Select
                                    value={
                                        form.equipmentId
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            equipmentId:
                                            e.target.value
                                        })
                                    }
                                >

                                    <option value="">
                                        Chọn thiết bị
                                    </option>

                                    {equipments.map(
                                        (e) => (

                                            <option
                                                key={e.id}
                                                value={e.id}
                                            >
                                                [{e.code}]
                                                {" "}
                                                {e.name}
                                            </option>
                                        )
                                    )}

                                </Form.Select>

                            </Form.Group>

                        </Col>

                        <Col md={12}>

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Mô tả
                                </Form.Label>

                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={
                                        form.description
                                    }
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description:
                                            e.target.value
                                        })
                                    }
                                />

                            </Form.Group>

                        </Col>

                    </Row>

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={() =>
                            setShowModal(false)
                        }
                    >
                        Hủy
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleSave}
                    >
                        Lưu
                    </Button>

                </Modal.Footer>

            </Modal>

        </div>
    );
};

export default RequestManagement;