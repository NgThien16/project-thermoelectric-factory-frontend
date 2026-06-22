import { useState, useEffect} from "react";
import { Formik, Form, Field } from "formik";
import { Button, Card, Col, Row, Table, Badge } from "react-bootstrap";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { searchRepairOrdersForWorkOrder } from "../../service/work_order/RepairOrderForWorkOrderService";
import { showList } from "../../service/operations_manager/equipment/EquipmentService";
import CreateWorkOrderModal from "./CreateWorkOrderModal";

const RepairOrderForWorkOrderList = () => {

    const [repairOrders, setRepairOrders] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);

    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState({
        title: "",
        createdBy: "",
        equipmentId: "",
        repairStatus: "",
        hasWorkOrder: ""
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedRepairOrder, setSelectedRepairOrder] = useState(null);

    useEffect(() => {
        let active = true;
        const fetchEquipment = async () => {
            const res = await showList();
            if (active) {
                setEquipmentList(res || []);
            }
        };
        fetchEquipment();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        let active = true;
        const fetchData = async () => {
            try {
                const res = await searchRepairOrdersForWorkOrder(
                    search.title,
                    search.createdBy,
                    search.equipmentId,
                    search.repairStatus,
                    search.hasWorkOrder,
                    page
                );
                if (active) {
                    setRepairOrders(res.content || []);
                    setTotal(res.totalPages || 0);
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
        return () => {
            active = false;
        };
    }, [search, page]);

    const handleSearch = (value) => {
        setSearch(value);
        setPage(0);
    };

    const handleReset = () => {
        setSearch({
            title: "",
            createdBy: "",
            equipmentId: "",
            repairStatus: "",
            hasWorkOrder: ""
        });
        setPage(0);
    };

    const renderStatus = (status) => {
        switch (status) {
            case "CHO_DUYET":
                return <Badge bg="secondary">Chờ duyệt</Badge>;
            case "DANG_THUC_HIEN":
                return <Badge bg="primary">Đang thực hiện</Badge>;
            case "DA_HOAN_THANH":
                return <Badge bg="success">Đã hoàn thành</Badge>;
            default:
                return <Badge bg="dark">{status}</Badge>;
        }
    };

    const openCreateModal = (repairOrder) => {
        setSelectedRepairOrder(repairOrder);
        setShowModal(true);
    };

    // CreateWorkOrderModal đã tự điều hướng sang /work-orders sau khi tạo thành công
    // Ở đây chỉ cần đóng modal, không cần navigate hay reload thủ công
    const handleCreated = () => {
        setShowModal(false);
    };

    return (
        <div className="p-4">
            <h3 className="fw-bold mb-4">
                Danh sách yêu cầu sửa chữa
            </h3>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Formik
                        initialValues={search}
                        enableReinitialize
                        onSubmit={handleSearch}>
                        <Form>
                            <Row className="g-3">
                                <Col md={2}>
                                    <Field
                                        name="title"
                                        className="form-control"
                                        placeholder="Tiêu đề..."
                                    />
                                </Col>

                                <Col md={2}>
                                    <Field
                                        name="createdBy"
                                        className="form-control"
                                        placeholder="Người tạo..."
                                    />
                                </Col>

                                <Col md={2}>
                                    <Field
                                        as="select"
                                        name="equipmentId"
                                        className="form-control"
                                    >
                                        <option value="">-- Thiết bị --</option>
                                        {equipmentList.map(item => (
                                            <option key={item.id} value={item.id}>
                                                [{item.code}] {item.name}
                                            </option>
                                        ))}
                                    </Field>
                                </Col>

                                <Col md={2}>
                                    <Field
                                        as="select"
                                        name="repairStatus"
                                        className="form-control"
                                    >
                                        <option value="">-- Trạng thái --</option>
                                        <option value="CHO_DUYET">Chờ duyệt</option>
                                        <option value="DANG_THUC_HIEN">Đang thực hiện</option>
                                        <option value="DA_HOAN_THANH">Đã hoàn thành</option>
                                    </Field>
                                </Col>
                                <Col md={2}>
                                    <Field
                                        as="select"
                                        name="hasWorkOrder"
                                        className="form-control">
                                        <option value="">-- Phiếu CT --</option>
                                        <option value="true">Đã có phiếu</option>
                                        <option value="false">Chưa có phiếu</option>
                                    </Field>
                                </Col>

                                <Col md={2} className="d-flex gap-2">
                                    <Button variant="primary" type="submit">
                                        <FaSearch />
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        type="reset"
                                        onClick={handleReset}
                                    >
                                        <FaArrowLeft />
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Formik>
                </Card.Body>
            </Card>
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0">
                        <thead className="table-light">
                        <tr>
                            <th>STT</th>
                            <th>Tiêu đề</th>
                            <th>Thiết bị</th>
                            <th>Người tạo</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th>Phiếu CT</th>
                        </tr>
                        </thead>
                        <tbody>
                        {repairOrders.map((item, i) => (
                            <tr key={item.id}>
                                <td>{page * 5 + i + 1}</td>
                                <td>{item.title}</td>
                                <td>{item.equipment}</td>
                                <td>{item.createdBy}</td>
                                <td>
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleDateString("vi-VN")
                                        : ""}
                                </td>
                                <td>{renderStatus(item.status)}</td>
                                <td>
                                    {item.hasWorkOrder ? (
                                        <span className="text-secondary">Đã có phiếu CT</span>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="success"
                                            onClick={() => openCreateModal(item)}>
                                            Tạo phiếu CT
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {repairOrders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-muted">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
                {total > 1 && (
                    <Card.Footer className="bg-white border-0 d-flex justify-content-center py-3">
                        <div className="d-flex gap-3 align-items-center">
                            <Button
                                size="sm"
                                variant="outline-primary"
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                            >
                                ← Trước
                            </Button>
                            <span>Trang {page + 1} / {total}</span>
                            <Button
                                size="sm"
                                variant="outline-primary"
                                disabled={page + 1 >= total}
                                onClick={() => setPage(page + 1)}
                            >
                                Sau →
                            </Button>
                        </div>
                    </Card.Footer>
                )}
            </Card>
            <CreateWorkOrderModal
                show={showModal}
                onHide={() => setShowModal(false)}
                repairOrder={selectedRepairOrder}
                onCreated={handleCreated}
            />
        </div>
    );
};
export default RepairOrderForWorkOrderList;