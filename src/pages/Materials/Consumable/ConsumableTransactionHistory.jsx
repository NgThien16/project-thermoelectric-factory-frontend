import {useEffect, useState} from "react";

import {
    Badge,
    Button,
    Card,
    Col,
    Form,
    Pagination,
    Row, Table
} from "react-bootstrap";

import {
    FaArrowDown,
    FaArrowUp,
    FaHistory,
    FaSearch
} from "react-icons/fa";

import {
    getHistory
} from "../../../service/materials_manager/consumable/ConsumableTransactionService.js";
import {Link} from "react-router-dom";
import "../../../styles/ConsumableTransactionHistory.css"
export default function ConsumableTransactionHistory() {

    const [transactions, setTransactions] = useState([]);

    const [page, setPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    const [keyword, setKeyword] = useState("");

    const [type, setType] = useState("");

    const [from, setFrom] = useState("");

    const [to, setTo] = useState("");

    useEffect(() => {
        loadData();
    }, [page, type, keyword, from, to]);

    const loadData = async () => {
        const res = await getHistory(
            keyword?.trim() || null,
            type || null,
            from || null,
            to || null,
            page
        );

        setTransactions(res?.content || []);
        setTotalPages(res?.totalPages || 0);
    };

    const handleSearch = async (e) => {

        e.preventDefault();

        setPage(0);
    };

    return (

        <div className="container mt-4">

            <Card className="shadow border-0">

                <Card.Header
                    className="text-white border-0"
                    style={{
                        background:
                            "linear-gradient(135deg,#0d6efd,#20c997)"
                    }}
                >

                    <div className="d-flex align-items-center">

                        <FaHistory className="me-2"/>

                        <h4 className="mb-0">
                            Lịch sử nhập xuất vật tư
                        </h4>

                    </div>

                </Card.Header>
                <Row className="g-3 mb-4">
                    <Col md={3}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <small className="text-muted">Tổng giao dịch</small>
                                <h3 className="fw-bold mb-0">{transactions.length}</h3>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <small className="text-muted">Nhập kho</small>
                                <h3 className="text-success fw-bold mb-0">
                                    {transactions.filter(t => t.type === "IMPORT").length}
                                </h3>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <small className="text-muted">Xuất kho</small>
                                <h3 className="text-danger fw-bold mb-0">
                                    {transactions.filter(t => t.type === "EXPORT").length}
                                </h3>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <small className="text-muted">Trang hiện tại</small>
                                <h3 className="text-primary fw-bold mb-0">
                                    {page + 1}
                                </h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Card.Body>

                    <Form onSubmit={handleSearch}>

                        <Row className="mb-4 g-3">

                            <Col md={4}>

                                <Form.Control
                                    type="text"
                                    placeholder="Tìm vật tư hoặc người tạo..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />

                            </Col>

                            <Col md={2}>

                                <Form.Select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >

                                    <option value="">
                                        Tất cả loại
                                    </option>

                                    <option value="IMPORT">
                                        Nhập kho
                                    </option>

                                    <option value="EXPORT">
                                        Xuất kho
                                    </option>

                                </Form.Select>

                            </Col>

                            <Col md={2}>

                                <Form.Control
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                />

                            </Col>

                            <Col md={2}>

                                <Form.Control
                                    type="date"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                />

                            </Col>

                            <Col md={2}>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100"
                                >

                                    <FaSearch className="me-2"/>

                                    Tìm kiếm

                                </Button>

                            </Col>

                        </Row>

                    </Form>

                    {
                        (transactions || []).length > 0 ? (

                            <Table
                                hover
                                responsive
                                bordered
                                className="align-middle"
                            >
                                <thead className="table-light">
                                <tr>
                                    <th>Mã VT</th>
                                    <th>Tên vật tư</th>
                                    <th>Loại</th>
                                    <th>Số lượng</th>
                                    <th>Người tạo</th>
                                    <th>Thời gian</th>
                                </tr>
                                </thead>

                                <tbody>

                                {transactions.map(item => (

                                    <tr key={item.id}>

                                        <td>
                                            <Badge bg="secondary">
                                                {item.materialCode}
                                            </Badge>
                                        </td>

                                        <td className="fw-semibold">
                                            {item.materialName}
                                        </td>

                                        <td>
                                            {
                                                item.type === "IMPORT" ? (
                                                    <Badge bg="success">
                                                        <FaArrowDown className="me-1"/>
                                                        Nhập kho
                                                    </Badge>
                                                ) : (
                                                    <Badge bg="danger">
                                                        <FaArrowUp className="me-1"/>
                                                        Xuất kho
                                                    </Badge>
                                                )
                                            }
                                        </td>

                                        <td className="fw-bold">
                                            {item.quantity}
                                        </td>

                                        <td>
                                            {item.username}
                                        </td>

                                        <td>
                                            {new Date(item.createdAt)
                                                .toLocaleString("vi-VN")}
                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </Table>

                        ) : (

                            <div className="text-center py-5">

                                <h1>📦</h1>

                                <h5 className="text-muted">
                                    Chưa có lịch sử giao dịch
                                </h5>

                                <small className="text-secondary">
                                    Dữ liệu sẽ xuất hiện khi có phát sinh nhập/xuất vật tư
                                </small>

                            </div>

                        )
                    }

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
            <Link to="/consumable-transactions">
                <Button

                    variant="secondary"
                >

                    ← Quay lại

                </Button>
            </Link>

        </div>

    );
}