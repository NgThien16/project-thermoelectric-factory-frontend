import {useEffect, useState} from "react";
import {Formik, Form, Field} from "formik";
import {
    Button,
    Card,
    Col,
    Row,
    Table,
    Modal
} from "react-bootstrap";

import {Link} from "react-router-dom";

import {
    FaEdit,
    FaPlus,
    FaSearch,
    FaTrash
} from "react-icons/fa";

import {
    getAllOrSearch,
    remove
} from "../../../service/materials_manager/replacement/ReplacementService.js";

import {toast} from "react-toastify";

const ListReplacement = () => {

    const [materialList, setMaterialList] = useState([]);
    const [keyword, setKeyword] = useState("");

    // modal delete
    const [showModal, setShowModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const fetchData = async () => {
        const data = await getAllOrSearch(keyword);
        setMaterialList(data || []);
    }

    useEffect(() => {
        fetchData();
    }, [keyword]);

    const handleSearch = (values) => {
        setKeyword(values.keyword);
    }

    const handleReset = () => {
        setKeyword("");
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

        const result = await remove(selectedMaterial.id);

        if (result) {

            toast.success("Xóa thành công!");

            handleCloseDelete();

            fetchData();

        } else {

            toast.error("Xóa thất bại!");
        }
    }

    return (
        <div className="p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3 className="fw-bold">
                    Danh sách vật tư thay thế
                </h3>

                <Link
                    to={"/replacement-material/add"}
                    className="btn btn-success d-flex align-items-center gap-2"
                >
                    <FaPlus/>
                    Thêm mới
                </Link>

            </div>

            <Card className="border-0 shadow-sm mb-4">

                <Card.Body>

                    <Formik
                        initialValues={{
                            keyword: ""
                        }}
                        onSubmit={handleSearch}
                    >

                        <Form>

                            <Row className="g-3">

                                <Col md={4}>

                                    <Field
                                        name={"keyword"}
                                        className="form-control"
                                        placeholder={"Tìm theo tên hoặc mã vật tư..."}
                                    />

                                </Col>

                                <Col md={4} className="d-flex gap-2">

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
                                        Quay lại
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
                            <th>Mã vật tư</th>
                            <th>Tên vật tư</th>
                            <th>Đơn vị</th>
                            <th>Vị trí</th>
                            <th>Mô tả</th>
                            <th>Hành động</th>
                        </tr>

                        </thead>

                        <tbody>

                        {materialList.map((m) => (

                            <tr key={m.id}>

                                <td>{m.code}</td>

                                <td>

                                    <Link
                                        to={`/replacement-materials/${m.id}`}
                                        className="text-decoration-none fw-semibold"
                                    >
                                        {m.name}
                                    </Link>

                                </td>

                                <td>{m.unit}</td>

                                <td>{m.location}</td>

                                <td>{m.description}</td>

                                <td>

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

                        {materialList.length === 0 && (

                            <tr>

                                <td
                                    colSpan={6}
                                    className="text-center py-4 text-muted"
                                >
                                    Không có dữ liệu !!!
                                </td>

                            </tr>

                        )}

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

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