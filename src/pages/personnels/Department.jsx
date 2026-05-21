import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Card, Table, Modal } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { DepartmentService } from "../../service/personnels_manager/DepartmentService.js";

export default function DepartmentPage() {
    const [departments, setDepartments] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [editData, setEditData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const fetchDepartments = async () => {
        try {
            const res = await DepartmentService.searchDepartments(keyword, page, 3); // size = 3
            setDepartments(res.content || []);
            setTotalPages(res.totalPages);
        } catch {
            toast.error("Lỗi khi tải dữ liệu phòng ban!");
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, [keyword, page]);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            if (editData) await DepartmentService.update(editData.id, values);
            else await DepartmentService.create(values);

            toast.success(editData ? "Cập nhật thành công!" : "Tạo mới thành công!");
            resetForm();
            setEditData(null);
            fetchDepartments();
        } catch {
            toast.error("Lỗi khi lưu dữ liệu!");
        }
    };

    const handleDelete = async () => {
        if (!selectedDepartment) return;
        try {
            await DepartmentService.delete(selectedDepartment.id);
            toast.success("Xóa phòng ban thành công!");
            setShowModal(false);
            setSelectedDepartment(null);
            fetchDepartments();
        } catch {
            toast.error("Không thể xóa phòng ban vì đang có nhân viên sử dụng");
        }
    };

    return (
        <div className="p-4">
            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3>Danh sách phòng ban</h3>
                        <FaPlus style={{ cursor: "pointer" }} onClick={() => setEditData(null)} />
                    </div>

                    <Formik enableReinitialize initialValues={editData || { name: "" }} onSubmit={handleSubmit}>
                        <Form className="d-flex mb-3">
                            <Field name="name" placeholder="Tên phòng ban" className="form-control me-2" />
                            <Button type="submit">{editData ? "Cập nhật" : "Tạo mới"}</Button>
                        </Form>
                    </Formik>

                    <div className="d-flex mb-3">
                        <input
                            className="form-control me-2"
                            placeholder="Tìm kiếm phòng ban"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button variant="primary" className="me-2" onClick={() => setKeyword(inputValue)}>
                            <FaSearch /> Tìm kiếm
                        </Button>
                        <Button variant="secondary" onClick={() => { setInputValue(""); setKeyword(""); setPage(0); }}>
                            Quay lại
                        </Button>
                    </div>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {departments.map(dep => (
                            <tr key={dep.id}>
                                <td>{dep.id}</td>
                                <td>{dep.name}</td>
                                <td>
                                    <FaEdit style={{ cursor: "pointer", marginRight: "8px" }} onClick={() => setEditData(dep)} />
                                    <FaTrash style={{ cursor: "pointer" }} onClick={() => { setSelectedDepartment(dep); setShowModal(true); }} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <Button disabled={page === 0} onClick={() => setPage(prev => Math.max(prev - 1, 0))}>Trước</Button>
                        <span>Trang {page + 1} / {totalPages}</span>
                        <Button disabled={page + 1 >= totalPages} onClick={() => setPage(prev => prev + 1)}>Sau</Button>
                    </div>

                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>Xác nhận xóa</Modal.Title></Modal.Header>
                <Modal.Body>Bạn có chắc muốn xóa phòng ban "{selectedDepartment?.name}" không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}