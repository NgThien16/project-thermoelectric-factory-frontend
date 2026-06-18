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
    FaPlus,
    FaSearch,
    FaTrash
} from "react-icons/fa";
import ListSummaryCards from "../../../../components/UI/ListSummaryCards.jsx";

import {
    getAllOrSearch,
    remove
} from "../../../../service/materials_manager/replacement/ReplacementCategoryService.js";

import {toast} from "react-toastify";

const ListReplacement = () => {

    // pagination data
    const [materialPage, setMaterialPage] = useState({
        content: [],
        totalPages: 0,
        number: 0
    });

    // search
    const [search, setSearch] = useState({
        code: "",
        name: ""
    });

    // current page
    const [page, setPage] = useState(0);

    // modal delete
    const [showModal, setShowModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    // fetch data
    const fetchData = async () => {

        const data = await getAllOrSearch(
            search.code,
            search.name,
            page
        );

        setMaterialPage(data);
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

    // mở modal
    const handleShowDelete = (material) => {
        setSelectedMaterial(material);
        setShowModal(true);
    }

    // đóng modal
    const handleCloseDelete = () => {
        setShowModal(false);
        setSelectedMaterial(null);
    }

    // xóa
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

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Danh sách vật tư thay thế
                    </h2>

                    <p className="text-muted mb-0">
                        Quản lý vật tư thay thế trong kho
                    </p>

                </div>

                <Link
                    to={"/replacement-materials/add"}
                    className="btn btn-success d-flex align-items-center gap-2 shadow-sm"
                >
                    <FaPlus/>
                    Thêm mới
                </Link>

            </div>

            <ListSummaryCards
                total={materialPage.content?.length || 0}
                currentPage={page + 1}
                totalPages={materialPage.totalPages || 1}
            />

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
                            <th className="ps-4">Mã vật tư</th>
                            <th>Tên vật tư</th>
                            <th>Đơn vị</th>
                            <th>Vị trí</th>
                            <th>Mô tả</th>
                            <th className="text-center">Hành động</th>
                        </tr>

                        </thead>

                        <tbody>

                        {materialPage.content?.map((m) => (

                            <tr key={m.id}>

                                <td className="ps-4 fw-semibold">
                                    {m.code}
                                </td>

                                <td className="text-decoration-none fw-semibold text-primary">
                                        {m.name}

                                </td>

                                <td>{m.unit}</td>

                                <td>{m.location}</td>

                                <td>{m.description}</td>

                                <td className="text-center">

                                    <Link
                                        to={`/replacement-materials/edit/${m.id}`}
                                        className="btn btn-outline-primary btn-sm me-2"
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
                                    colSpan={6}
                                    className="text-center py-5 text-muted"
                                >
                                    Không có dữ liệu !!!
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

                <Modal.Header closeButton>

                    <Modal.Title>
                        Xác nhận xóa
                    </Modal.Title>

                </Modal.Header>

                <Modal.Body>

                    Bạn có muốn xóa vật tư thay thế:

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
                    >
                        Xóa
                    </Button>

                </Modal.Footer>

            </Modal>

        </div>
    )
}

export default ListReplacement;
