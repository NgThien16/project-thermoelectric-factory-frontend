import {useEffect, useState} from "react";

import {
    Badge,
    Button,
    Card,
    Col,
    Form,
    Pagination,
    Row,
    Table
} from "react-bootstrap";

import {
    FaPlus,
    FaSearch,
    FaHistory,

} from "react-icons/fa";

import {Link} from "react-router-dom";

import {
    getInventory
} from "../../../service/materials_manager/consumable/ConsumableTransactionService.js";
import"../../../styles/ListConsumableTransaction.css";

export default function ConsumableList() {

    const [materials, setMaterials] = useState([]);

    const [page, setPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    const [code, setCode] = useState("");

    const [name, setName] = useState("");

    useEffect(() => {

        loadData();

    }, [page]);

    const loadData = async () => {

        const data = await getInventory(
            code,
            name,
            page
        );

        setMaterials(data.content);

        setTotalPages(data.totalPages);
    };

    const handleSearch = async (e) => {

        e.preventDefault();

        setPage(0);

        const data = await getInventory(
            code,
            name,
            0
        );

        setMaterials(data.content);

        setTotalPages(data.totalPages);
    };
    const handleReset = async () => {

        setCode("");

        setName("");

        setPage(0);

        const data = await getInventory("", "", 0);

        setMaterials(data.content);

        setTotalPages(data.totalPages);
    };

    return (

        <div className="container mt-4">

            <Card className="shadow border-0">

                <Card.Header
                    className="text-white d-flex justify-content-between align-items-center"
                    style={{
                        background:
                            "linear-gradient(135deg,#0d6efd,#20c997)"
                    }}
                >

                    <div>

                        <h4 className="mb-0">
                            Danh sách vật tư tiêu hao
                        </h4>

                        <small>
                            Quản lý tồn kho vật tư
                        </small>

                    </div>

                    <div className="d-flex gap-2">

                        <Link to="/consumable-transactions/history">

                            <Button variant="light">

                                <FaHistory className="me-2"/>

                                Lịch sử nhập xuất

                            </Button>

                        </Link>
                        <Link to="/consumable-transactions/import">
                        <Button variant="warning">

                            <FaPlus className="me-2"/>

                            Nhập vật tư

                        </Button></Link>

                    </div>

                </Card.Header>

                <Card.Body>
                    <Row className="g-3 mb-4">

                        <Col md={3}>
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <small className="text-muted">
                                        Tổng vật tư
                                    </small>

                                    <h3 className="fw-bold text-primary mb-0">
                                        {materials.length}
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3}>
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <small className="text-muted">
                                        Còn hàng
                                    </small>

                                    <h3 className="fw-bold text-success mb-0">
                                        {
                                            materials.filter(
                                                item => item.quantity > 10
                                            ).length
                                        }
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3}>
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <small className="text-muted">
                                        Sắp hết
                                    </small>

                                    <h3 className="fw-bold text-warning mb-0">
                                        {
                                            materials.filter(
                                                item =>
                                                    item.quantity > 0 &&
                                                    item.quantity <= 10
                                            ).length
                                        }
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={3}>
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <small className="text-muted">
                                        Hết hàng
                                    </small>

                                    <h3 className="fw-bold text-danger mb-0">
                                        {
                                            materials.filter(
                                                item => item.quantity === 0
                                            ).length
                                        }
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>
                            <Card className="mb-4 border-0 bg-light">

                                <Card.Body>

                                    <h5 className="mb-0">

                                        Tổng số lượng tồn kho:

                                        {
                                            materials.reduce(
                                                (sum,item)=>
                                                    sum + item.quantity,
                                                0
                                            )
                                        }

                                    </h5>

                                </Card.Body>

                            </Card>


                    </Row>
                    <Form onSubmit={handleSearch}>

                        <Row className="mb-4 g-3">

                            <Col md={4}>

                                <Form.Control
                                    className="shadow-sm"
                                    type="text"
                                    placeholder="Tìm mã vật tư..."
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />

                            </Col>

                            <Col md={4}>

                                <Form.Control
                                    className="shadow-sm"
                                    type="text"
                                    placeholder="Tìm tên vật tư..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />

                            </Col>

                            <Col md={2}>

                                <Button
                                    type="submit"
                                    variant="success"
                                    className="w-100"
                                >

                                    <FaSearch className="me-2"/>

                                    Tìm kiếm

                                </Button>

                            </Col>

                            <Col md={2}>

                                <Button
                                    variant="secondary"
                                    className="w-100"
                                    onClick={handleReset}
                                >

                                    Làm mới

                                </Button>

                            </Col>

                        </Row>

                    </Form>

                    <Table
                        bordered
                        hover
                        responsive
                        className="align-middle text-center"
                    >

                        <thead className="table-primary">

                        <tr>

                            <th width="70">STT</th>

                            <th width="180">Mã vật tư</th>

                            <th>Tên vật tư</th>

                            <th width="150">Số lượng tồn</th>

                            <th width="160">Trạng thái</th>


                        </tr>

                        </thead>

                        <tbody>

                        {
                            materials.length > 0 ? (

                                materials.map((item, index) => (

                                    <tr key={item.id}>

                                        <td>
                                            {page * 5 + index + 1}
                                        </td>

                                        <td className="fw-bold text-primary">
                                            {item.code}
                                        </td>

                                        <td className="text-start">
                                            {item.name}
                                        </td>

                                        <td>
                                            <Badge
                                                bg={
                                                    item.quantity > 10
                                                        ? "success"
                                                        : item.quantity > 0
                                                            ? "warning"
                                                            : "danger"
                                                }
                                                pill
                                                className="px-3 py-2"
                                            >
                                                {item.quantity}
                                            </Badge>
                                        </td>

                                        <td>

                                            {
                                                item.quantity > 10 ? (

                                                    <Badge
                                                        bg="success"
                                                        pill
                                                        className="px-3 py-2"
                                                    >
                                                        Còn hàng
                                                    </Badge>

                                                ) : item.quantity > 0 ? (

                                                    <Badge bg="warning"
                                                           pill
                                                           className="px-3 py-2">
                                                        Sắp hết
                                                    </Badge>

                                                ) : (

                                                    <Badge bg="danger"
                                                           pill
                                                           className="px-3 py-2">
                                                        Hết hàng
                                                    </Badge>

                                                )
                                            }

                                        </td>


                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center text-muted py-4"
                                    >

                                        <div className="py-4">

                                            <h1>📦</h1>

                                            <h5 className="text-muted">
                                                Chưa có vật tư
                                            </h5>

                                        </div>

                                    </td>

                                </tr>

                            )
                        }

                        </tbody>

                    </Table>

                    <div className="d-flex justify-content-center mt-4">

                        <Pagination>

                            <Pagination.Prev
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                            />

                            {
                                [...Array(totalPages).keys()].map((p) => (

                                    <Pagination.Item
                                        key={p}
                                        active={p === page}
                                        onClick={() => setPage(p)}
                                    >
                                        {p + 1}
                                    </Pagination.Item>

                                ))
                            }

                            <Pagination.Next
                                disabled={page + 1 >= totalPages}
                                onClick={() => setPage(page + 1)}
                            />

                        </Pagination>

                    </div>

                </Card.Body>

            </Card>

        </div>
    );
}