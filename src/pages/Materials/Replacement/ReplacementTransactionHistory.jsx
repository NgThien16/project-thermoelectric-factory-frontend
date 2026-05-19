import {useEffect, useState} from "react";

import {
    Badge,
    Button,
    Card,
    Col,
    Form,
    Pagination,
    Row
} from "react-bootstrap";

import {
    FaArrowDown,
    FaArrowUp,
    FaHistory,
    FaSearch
} from "react-icons/fa";

import {
    getHistory
} from "../../../service/materials_manager/replacement/ReplacementTransactionService.js";
import {Link} from "react-router-dom";

export default function ReplacementTransactionHistory() {

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
                    className="bg-dark text-white"
                >

                    <div className="d-flex align-items-center">

                        <FaHistory className="me-2"/>

                        <h4 className="mb-0">
                            Lịch sử nhập xuất vật tư
                        </h4>

                    </div>

                </Card.Header>

                <Card.Body>

                    <Form onSubmit={handleSearch}>

                        <Row className="mb-4 g-2">

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

                            transactions.map((item) => (

                                <Card
                                    key={item.id}
                                    className="mb-3 border-0 shadow-sm"
                                >

                                    <Card.Body>

                                        <div
                                            className="d-flex justify-content-between align-items-center"
                                        >

                                            <div>

                                                <div
                                                    className="fw-bold fs-5"
                                                >

                                                    [{item.materialCode}] {item.materialName}

                                                </div>

                                                <div className="text-muted mt-1">

                                                    Người tạo:
                                                    <span className="fw-semibold ms-1">
                                                        {item.username}
                                                    </span>

                                                </div>

                                                <div className="text-muted">

                                                    Thời gian:
                                                    <span className="ms-1">
                                                        {
                                                            new Date(item.createdAt).toLocaleString(
                                                                "vi-VN",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                }
                                                            )
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                            <div className="text-end">

                                                {
                                                    item.type === "IMPORT" ? (

                                                        <Badge
                                                            bg="success"
                                                            className="p-2 fs-6"
                                                        >

                                                            <FaArrowDown className="me-2"/>

                                                            Nhập +{item.quantity}

                                                        </Badge>

                                                    ) : (

                                                        <Badge
                                                            bg="danger"
                                                            className="p-2 fs-6"
                                                        >

                                                            <FaArrowUp className="me-2"/>

                                                            Xuất -{item.quantity}

                                                        </Badge>

                                                    )
                                                }

                                            </div>

                                        </div>

                                    </Card.Body>

                                </Card>

                            ))

                        ) : (

                            <div
                                className="text-center text-muted py-5"
                            >

                                Không có lịch sử giao dịch

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