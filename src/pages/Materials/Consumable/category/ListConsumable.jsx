import {useEffect, useState} from "react";
import {Formik, Form, Field} from "formik";
import {
    Button,
    Card,
    Col,
    Row,
    Table,
    Modal,
    Pagination
} from "react-bootstrap";
import {Link} from "react-router-dom";
import {
    FaEdit,
    FaSearch,
    FaTrash
} from "react-icons/fa";

import {
    getAllOrSearch,
    remove
} from "../../../../service/materials_manager/consumable/ConsumableCategoryService.js";

import {toast} from "react-toastify";
import "../../../../styles/ListConsumable.css";

const ListConsumable = () => {

    const [materialPage, setMaterialPage] = useState({
        content: [],
        totalPages: 0,
        number: 0
    });

    const [search, setSearch] = useState({
        code: "",
        name: ""
    });

    const [page, setPage] = useState(0);

    // modal delete
    const [showModal, setShowModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    // fetch data
    const fetchData = async () => {
        const data = await getAllOrSearch({
            code: search.code,
            name: search.name,
            page: page,
            size: 5
        });

        if (data) {
            setMaterialPage(data);
        } else {
            setMaterialPage({ content: [], totalPages: 0, number: 0 });
        }
    }

    useEffect(() => {
        fetchData();
    }, [search, page]);

    // search
    const handleSearch = (values) => {

        setPage(0);

        setSearch({
            code: values.code,
            name: values.name
        });
    }

    // reset
    const handleReset = () => {

        setPage(0);

        setSearch({
            code: "",
            name: ""
        });
    }

    // modal delete
    const handleShowDelete = (material) => {
        setSelectedMaterial(material);
        setShowModal(true);
    }

    const handleCloseDelete = () => {
        setShowModal(false);
        setSelectedMaterial(null);
    }

    // delete
    const handleDelete = async () => {

        if (!selectedMaterial) return;

        try {

            const result = await remove(selectedMaterial.id);

            console.log("delete result:", result);

            if (result) {

                handleCloseDelete();

                toast.success("Xóa thành công!");

                await fetchData();

            } else {

                toast.error("Xóa thất bại!");
            }

        } catch (e) {

            console.log(e);

            toast.error("Có lỗi xảy ra!");
        }
    }

    return (

        <div className="container py-4">

            {/* Header */}
            <Row className="list-summary-row g-3 mb-4">

                <Col md={4}>
                    <Card className="list-summary-card">
                        <Card.Body>
                            <small className="text-muted">
                                Tổng danh mục
                            </small>

                            <h3 className="fw-bold text-primary mb-0">
                                {materialPage.content.length}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="list-summary-card">
                        <Card.Body>
                            <small className="text-muted">
                                Trang hiện tại
                            </small>

                            <h3 className="fw-bold text-success mb-0">
                                {page + 1}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="list-summary-card">
                        <Card.Body>
                            <small className="text-muted">
                                Tổng số trang
                            </small>

                            <h3 className="fw-bold text-warning mb-0">
                                {materialPage.totalPages}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
            <Card
                className="border-0 shadow-sm mb-4 text-white"
                style={{
                    background:
                        "linear-gradient(135deg,#198754,#20c997)"
                }}
            >
                <Card.Body className="d-flex justify-content-between align-items-center">
                <div>

                    <h2 className="fw-bold mb-1">
                        Danh sách vật tư tiêu hao
                    </h2>

                    <p className="text-muted mb-0">
                        Quản lý vật tư tiêu hao trong kho
                    </p>

                </div>

                <Link
                    to={"/consumable-materials/add"}
                    className="btn btn-light fw-bold d-flex align-items-center gap-2 shadow">
                    Thêm mới
                </Link>
                </Card.Body>
            </Card>

            {/* Search */}

            <Card className="border-0 shadow-sm rounded-4 mb-4">

                <Card.Body className="p-4">

                    <Formik
                        initialValues={{
                            code: "",
                            name: ""
                        }}
                        onSubmit={handleSearch}
                    >

                        <Form>

                            <Row className="g-3 align-items-end">

                                <Col md={4}>

                                    <label className="form-label fw-semibold">
                                        Mã vật tư
                                    </label>

                                    <Field
                                        name="code"
                                        className="form-control"
                                        placeholder="Nhập mã vật tư..."
                                    />

                                </Col>

                                <Col md={4}>

                                    <label className="form-label fw-semibold">
                                        Tên vật tư
                                    </label>

                                    <Field
                                        name="name"
                                        className="form-control"
                                        placeholder="Nhập tên vật tư..."
                                    />

                                </Col>

                                <Col md={4}>

                                    <div className="d-flex gap-2">

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="d-flex align-items-center gap-2"
                                        >
                                            <FaSearch/>
                                            Tìm kiếm
                                        </Button>

                                        <Button
                                            variant="outline-secondary"
                                            type="reset"
                                            onClick={handleReset}
                                        >
                                            Làm mới
                                        </Button>

                                    </div>

                                </Col>

                            </Row>

                        </Form>

                    </Formik>

                </Card.Body>

            </Card>

            {/* Table */}

            <Card className="border-0 shadow-sm rounded-4">

                <Card.Body className="p-0">

                    <Table hover responsive className="mb-0 align-middle">

                        <thead className="table-light">

                        <tr>
                            <th width="80">STT</th>
                            <th className="ps-4">Mã vật tư</th>
                            <th>Tên vật tư</th>
                            <th>Đơn vị</th>
                            <th>Mô tả</th>
                            <th className="text-center">Hành động</th>
                        </tr>

                        </thead>

                        <tbody>
                        {materialPage.content?.map((m, index) => (

                            <tr key={m.id}>
                                <td>
                                    {page * 5 + index + 1}
                                </td>
                                <td className="ps-4">
                                <span className="badgebg-primary">{m.code}</span>
                                </td>

                                <td className="text-decoration-none fw-semibold text-primary">
                                    {m.name}
                                </td>

                                <td>{m.unit}</td>
                                <td style={{ maxWidth: "250px"}}>
                                    <div className="text-truncate" title={m.description}>
                                        {m.description || "-"}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <Link
                                        to={`/consumable-materials/edit/${m.id}`}
                                        className="btn btn-outline-primary btn-sm me-2"
                                        title="Chỉnh sửa"
                                    >
                                        <FaEdit/>
                                    </Link>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleShowDelete(m)}
                                    >
                                        <FaTrash/>
                                    </Button>

                                </td>

                            </tr>
                        ))}
                        {materialPage.content?.length === 0 && (

                            <tr>

                                <td
                                    colSpan={5}
                                    className="text-center py-5 text-muted"
                                >
                                    <div className="py-4">

                                        <h1>📦</h1>

                                        <h5 className="text-muted">
                                            Chưa có danh mục vật tư
                                        </h5>

                                    </div>
                                </td>

                            </tr>
                        )}

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

            {/* Pagination */}

            <div className="d-flex justify-content-center mt-4">

                <Pagination>

                    <Pagination.Prev
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                    />

                    {[...Array(materialPage.totalPages).keys()].map((p) => (

                        <Pagination.Item
                            key={p}
                            active={p === page}
                            onClick={() => setPage(p)}
                        >
                            {p + 1}
                        </Pagination.Item>
                    ))}

                    <Pagination.Next
                        disabled={page === materialPage.totalPages - 1}
                        onClick={() => setPage(page + 1)}
                    />

                </Pagination>

            </div>

            {/* Modal Delete */}

            <Modal
                show={showModal}
                onHide={handleCloseDelete}
                centered
            >

                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>
                        Xác nhận xóa
                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    Bạn có muốn xóa vật tư:

                    <span className="fw-bold text-danger">
                        {" "}{selectedMaterial?.name}
                    </span>
                    ?

                </Modal.Body>

                <Modal.Footer>

                    <Button
                        variant="secondary"
                        onClick={handleCloseDelete}
                    >
                        Hủy
                    </Button>

                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        title="Xóa"
                    >
                        Xóa
                    </Button>

                </Modal.Footer>

            </Modal>

        </div>
    )
}

export default ListConsumable;
