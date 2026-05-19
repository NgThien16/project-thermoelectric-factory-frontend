import { useEffect, useState } from "react";

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
    FaHistory
} from "react-icons/fa";

import { Link } from "react-router-dom";

import {
    getInventory
} from "../../../service/materials_manager/replacement/ReplacementTransactionService.js";

export default function ListReplacementTransaction() {

    const [materials, setMaterials] = useState([]);

    const [page, setPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    const [code, setCode] = useState("");

    const [name, setName] = useState("");

    useEffect(() => {

        loadData();

    }, [page]);

    const loadData = async () => {
        try {
            const data = await getInventory(
                code,
                name,
                page
            );

            // Kiểm tra cấu trúc phân trang an toàn
            if (data && data.content) {
                setMaterials(data.content);
                setTotalPages(data.totalPages);
            } else {
                setMaterials([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách vật tư thay thế:", error);
            setMaterials([]);
            setTotalPages(0);
        }
    };

    const handleSearch = async (e) => {

        e.preventDefault();

        setPage(0);

        try {
            const data = await getInventory(
                code,
                name,
                0
            );

            if (data && data.content) {
                setMaterials(data.content);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleReset = async () => {

        setCode("");

        setName("");

        setPage(0);

        try {
            const data = await getInventory("", "", 0);

            if (data && data.content) {
                setMaterials(data.content);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (

        <div className="container mt-4">

            <Card className="shadow border-0">

                <Card.Header
                    className="bg-primary text-white d-flex justify-content-between align-items-center"
                >

                    <div>

                        <h4 className="mb-0">
                            Danh sách thiết bị/vật tư thay thế
                        </h4>

                        <small>
                            Quản lý tồn kho vật tư thay thế
                        </small>

                    </div>

                    <div className="d-flex gap-2">

                        <Link to="/replacement-transactions/history">

                            <Button variant="light">

                                <FaHistory className="me-2"/>

                                Lịch sử nhập xuất

                            </Button>

                        </Link>

                        <Link to="/replacement-transactions/import">
                            <Button variant="warning">

                                <FaPlus className="me-2"/>

                                Nhập vật tư

                            </Button>
                        </Link>

                    </div>

                </Card.Header>

                <Card.Body>

                    <Form onSubmit={handleSearch}>

                        <Row className="mb-4 g-2">

                            <Col md={4}>

                                <Form.Control
                                    type="text"
                                    placeholder="Tìm mã thiết bị..."
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />

                            </Col>

                            <Col md={4}>

                                <Form.Control
                                    type="text"
                                    placeholder="Tìm tên thiết bị..."
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

                        <thead className="table-dark">

                        <tr>

                            <th width="70">STT</th>

                            <th width="180">Mã thiết bị</th>

                            <th>Tên thiết bị</th>

                            <th width="150">Số lượng tồn</th>

                            <th width="160">Trạng thái</th>

                        </tr>

                        </thead>

                        <tbody>

                        {
                            materials && materials.length > 0 ? (

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

                                            <span className="fw-bold">
                                                {item.quantity}
                                            </span>

                                        </td>

                                        <td>

                                            {
                                                item.quantity > 10 ? ( // Đồ thay thế thường có mức cảnh báo thấp hơn đồ tiêu hao

                                                    <Badge bg="success">
                                                        Còn hàng
                                                    </Badge>

                                                ) : item.quantity > 0 ? (

                                                    <Badge bg="warning">
                                                        Sắp hết
                                                    </Badge>

                                                ) : (

                                                    <Badge bg="danger">
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
                                        colSpan="5" // Đồng bộ theo đúng số lượng cột <th> là 5
                                        className="text-center text-muted py-4"
                                    >

                                        Không có dữ liệu

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