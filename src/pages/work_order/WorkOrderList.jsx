import { useState, useEffect, useCallback } from "react";
import { Badge, Button, Card, Col, Row, Table } from "react-bootstrap";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { searchWorkOrders } from "../../service/work_order/WorkOrderService";
import { showList } from "../../service/operations_manager/equipment/EquipmentService.js";
import WorkOrderDetailModal from "./WorkOrderDetailModal";

const WorkOrderList = () => {

    const [workOrders, setWorkOrders] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);

    const [search, setSearch] = useState({
        code: "",
        equipment: "",
        status: ""
    });

    const [selectedWorkOrderId, setSelectedWorkOrderId] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Theo dõi id đã xử lý từ navigate state, tránh mở lại modal lặp lại
    const [processedOpenId, setProcessedOpenId] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    // Xử lý mở modal detail ngay trong lúc render khi có state.openDetailId mới
    const incomingOpenId = location.state?.openDetailId;
    if (incomingOpenId && incomingOpenId !== processedOpenId) {
        setProcessedOpenId(incomingOpenId);
        setSelectedWorkOrderId(incomingOpenId);
        setShowDetailModal(true);
    }

    // Effect chỉ dùng để dọn lại location.state (navigate không phải setState nên không bị flag)
    useEffect(() => {
        if (processedOpenId) {
            navigate(location.pathname, { replace: true });
        }
        //  eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processedOpenId]);

    const loadData = useCallback(async () => {
        try {
            const res = await searchWorkOrders(
                search.code,
                search.equipment,
                search.status,
                page
            );
            setWorkOrders(res.content || []);
            setTotal(res.totalPages || 0);
        } catch (e) {
            console.log(e);
        }
    }, [search, page]);

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
                const res = await searchWorkOrders(
                    search.code,
                    search.equipment,
                    search.status,
                    page
                );
                if (active) {
                    setWorkOrders(res.content || []);
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
        setSearch({ code: "", equipment: "", status: "" });
        setPage(0);
    };

    const handleOpenDetail = (id) => {
        setSelectedWorkOrderId(id);
        setShowDetailModal(true);
    };

    const renderStatusBadge = (status, statusDisplay) => {
        switch (status) {
            case "DA_PHAN_CONG":
                return <Badge bg="info">{statusDisplay}</Badge>;
            case "DANG_THUC_HIEN":
                return <Badge bg="primary">{statusDisplay}</Badge>;
            case "CHO_VAT_TU":
                return <Badge bg="warning">{statusDisplay}</Badge>;
            case "HOAN_THANH":
                return <Badge bg="success">{statusDisplay}</Badge>;
            default:
                return <Badge bg="dark">{statusDisplay}</Badge>;
        }
    };

    const WORK_ORDER_STATUS = [
        { value: "DA_PHAN_CONG", label: "Đã phân công" },
        { value: "DANG_THUC_HIEN", label: "Đang thực hiện" },
        { value: "CHO_VAT_TU", label: "Chờ vật tư" },
        { value: "HOAN_THANH", label: "Hoàn thành" }
    ];

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Danh sách phiếu công tác</h3>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Formik
                        initialValues={search}
                        enableReinitialize
                        onSubmit={handleSearch}
                    >
                        <Form>
                            <Row className="g-3">
                                <Col md={3}>
                                    <Field
                                        name="code"
                                        className="form-control"
                                        placeholder="Mã phiếu..."
                                    />
                                </Col>

                                <Col md={3}>
                                    <Field as="select" name="equipment" className="form-control">
                                        <option value="">-- Thiết bị --</option>
                                        {equipmentList.map(equipment => (
                                            <option key={equipment.id} value={equipment.name}>
                                                [{equipment.code}] {equipment.name}
                                            </option>
                                        ))}
                                    </Field>
                                </Col>

                                <Col md={3}>
                                    <Field as="select" name="status" className="form-control">
                                        <option value="">-- Trạng thái --</option>
                                        {WORK_ORDER_STATUS.map(item => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </Field>
                                </Col>

                                <Col md={3} className="d-flex gap-2">
                                    <Button type="submit" variant="primary">
                                        <FaSearch />
                                    </Button>
                                    <Button
                                        type="reset"
                                        variant="outline-secondary"
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
                            <th>Mã phiếu</th>
                            <th>Thiết bị</th>
                            <th>Mô tả</th>
                            <th>Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        {workOrders.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <span
                                        role="button"
                                        className="text-primary fw-semibold text-decoration-underline"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleOpenDetail(item.id)}
                                    >
                                        {item.code}
                                    </span>
                                </td>
                                <td>{item.equipment}</td>
                                <td>{item.description}</td>
                                <td>{renderStatusBadge(item.status, item.statusDisplay)}</td>
                            </tr>
                        ))}
                        {workOrders.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-muted">
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

            <WorkOrderDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                workOrderId={selectedWorkOrderId}
                onAssignmentUpdated={loadData}
            />
        </div>
    );
};

export default WorkOrderList;