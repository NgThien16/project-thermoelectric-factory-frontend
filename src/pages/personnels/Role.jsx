import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Card, Table, Modal } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

import { RoleService } from "../../service/personnels_manager/RoleService.js";

export default function RolePage() {
    const [roles, setRoles] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [editData, setEditData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const pageSize = 5;

    const fetchRoles = async () => {
        try {
            const res = await RoleService.searchRoles(keyword, page,5);
            setRoles(res.content || []);
            setTotalPages(res.totalPages);
        } catch {
            toast.error("Lỗi khi tải dữ liệu vai trò!");
        }
    };

    useEffect(() => { fetchRoles(); }, [keyword, page]);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            if (editData) await RoleService.update(editData.id, values);
            else await RoleService.create(values);

            toast.success(editData ? "Cập nhật vai trò thành công!" : "Tạo mới vai trò thành công!");
            resetForm();
            setEditData(null);
            fetchRoles();
        } catch {
            toast.error("Lỗi khi lưu vai trò!");
        }
    };

    const handleDelete = async () => {
        if (!selectedRole) return;
        try {
            await RoleService.delete(selectedRole.id);
            toast.success("Xóa vai trò thành công!");
            setShowModal(false);
            setSelectedRole(null);
            fetchRoles();
        } catch {
            toast.error("Không thể xóa vai trò vì đang có user sử dụng");
        }
    };

    return (
        <div className="p-4">
            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3>Danh sách Quyền</h3>
                        <FaPlus style={{ cursor: "pointer" }} onClick={() => setEditData(null)} />
                    </div>

                    {/* Form tạo / sửa */}
                    <Formik enableReinitialize initialValues={editData || { name: "" }} onSubmit={handleSubmit}>
                        <Form className="d-flex mb-3">
                            <Field name="name" placeholder="Tên vai trò" className="form-control me-2" />
                            <Button type="submit">{editData ? "Cập nhật" : "Tạo mới"}</Button>
                        </Form>
                    </Formik>

                    {/* Search + Reset */}
                    <div className="d-flex mb-3">
                        <input
                            className="form-control me-2"
                            placeholder="Tìm kiếm vai trò"
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

                    {/* Table */}
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {roles.map((role,i) => (
                            <tr key={role.id}>
                                <td>{page * pageSize + i+1}</td>
                                <td>{role.name}</td>
                                <td>
                                    <FaEdit style={{ cursor: "pointer", marginRight: "8px" }} onClick={() => setEditData(role)} />
                                    <FaTrash style={{ cursor: "pointer" }} onClick={() => { setSelectedRole(role); setShowModal(true); }} />
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
                <Modal.Body>Bạn có chắc muốn xóa vai trò "{selectedRole?.name}" không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}