import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import {Button, Card, Table, Modal, Dropdown, ButtonGroup} from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

import { UserService } from "../../service/personnels_manager/UserService.js";
import { EmployeeService } from "../../service/personnels_manager/EmployeeService.js";
import { RoleService } from "../../service/personnels_manager/RoleService.js";
import { UserRoleService } from "../../service/personnels_manager/UserRoleService.js";

export default function UserPage() {
    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [editData, setEditData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const pageSize = 5;

    const fetchAll = async () => {
        try {
            const res = await UserService.searchUsers(keyword, page, pageSize);
            setUsers(res.content || []);
            setTotalPages(res.totalPages || 1);

            const empRes = await EmployeeService.getAll();
            setEmployees(empRes.data || []);

            const roleRes = await RoleService.getAll();
            setRoles(roleRes || []);
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi tải dữ liệu user!");
        }
    };

    useEffect(() => { fetchAll(); }, [keyword, page]);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const payload = { username: values.username, password: values.password, employeeId: values.employeeId };
            if (editData) await UserService.update(editData.id, payload);
            else await UserService.create(payload);

            toast.success(editData ? "Cập nhật thành công!" : "Tạo user thành công!");
            resetForm();
            setEditData(null);
            setPage(totalPages - 1);
            fetchAll();
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi lưu user!");
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            await UserService.delete(selectedUser.id);
            toast.success("Xóa user thành công!");
            setShowDeleteModal(false);
            setSelectedUser(null);
            setPage(prev => prev > 0 ? prev - 1 : 0);
            fetchAll();
        } catch (err) {
            console.error(err);
            toast.error("Không thể xóa user!");
        }
    };

    // const checkUserHasRole = (user, roleId) =>
    //     user.roles?.some(r => Number(r.id) === Number(roleId));

    const handleAssignRole = async (userId, roleId) => {
        try {
            await UserRoleService.assignRole(userId, roleId);
            toast.success("Gán role thành công!");
            fetchAll();
        } catch (err) {
            console.error(err);
            toast.error("Không thể gán role!");
        }
    };

    const handleRemoveRole = async (userId, roleId) => {
        try {
            await UserRoleService.removeRole(userId, roleId);
            toast.success("Gỡ role thành công!");
            fetchAll();
        } catch (err) {
            console.error(err);
            toast.error("Không thể gỡ role!");
        }
    };

    const getEmployeeName = (employeeName) => employeeName || "Chưa có nhân viên";

    return (
        <Card className="p-3">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Danh sách User</h3>
                    <FaPlus style={{ cursor: "pointer" }} onClick={() => setEditData(null)} />
                </div>

                <Formik
                    enableReinitialize
                    initialValues={{
                        username: editData?.username || "",
                        password: editData?.password || "",
                        employeeId: editData?.employeeId || ""
                    }}
                    onSubmit={handleSubmit}
                >
                    <Form className="d-flex mb-3">
                        <Field name="username" placeholder="Tài khoản" className="form-control me-2" />
                        <Field name="password" placeholder="Mật khẩu" className="form-control me-2" />
                        <Field as="select" name="employeeId" className="form-control me-2" disabled={!!editData}>
                            <option value="">Chọn nhân viên</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.fullName || emp.name}</option>
                            ))}
                        </Field>
                        <Button type="submit">{editData ? "Cập nhật" : "Tạo mới"}</Button>
                    </Form>
                </Formik>

                <div className="d-flex mb-3">
                    <input
                        className="form-control me-2"
                        placeholder="Tìm kiếm tài khoản"
                        value={keyword}
                        onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
                    />
                    <Button variant="primary" onClick={fetchAll}><FaSearch /> Tìm kiếm</Button>
                </div>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tài khoản</th>
                        <th>Nhân viên</th>
                        <th>Quyền</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.length === 0 ? (
                        <tr><td colSpan="5" className="text-center">Không có user nào</td></tr>
                    ) : users.map((user, index) => (
                        <tr key={user.id}>
                            <td>{page * pageSize + index + 1}</td>
                            <td>{user.username}</td>
                            <td>{getEmployeeName(user.employeeName)}</td>
                            <td>
                                <Dropdown as={ButtonGroup}>
                                    <Dropdown.Toggle variant="secondary" size="sm">
                                        Quyền
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {roles.map(role => {
                                            const hasRole = user.roles?.some(r => r.id === role.id);
                                            return (
                                                <Dropdown.Item key={role.id}
                                                               className="d-flex justify-content-between align-items-center">
                                                    {role.name}
                                                    {hasRole ? (
                                                        <Button size="sm" variant="warning"
                                                                onClick={() => handleRemoveRole(user.id, role.id)}>
                                                            Gỡ
                                                        </Button>
                                                    ) : (
                                                        <Button size="sm" variant="success"
                                                                onClick={() => handleAssignRole(user.id, role.id)}>
                                                            Gán
                                                        </Button>
                                                    )}
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            <td>
                                <FaEdit style={{ cursor: "pointer", marginRight: "8px" }} onClick={() => setEditData(user)} />
                                <FaTrash style={{ cursor: "pointer" }} onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <div className="d-flex justify-content-between align-items-center mt-2">
                    <Button disabled={page === 0} onClick={() => setPage(prev => Math.max(prev - 1, 0))}>Trước</Button>
                    <span>Trang {page + 1} / {totalPages}</span>
                    <Button disabled={page + 1 >= totalPages} onClick={() => setPage(prev => prev + 1)}>Sau</Button>
                </div>

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton><Modal.Title>Xác nhận xóa</Modal.Title></Modal.Header>
                    <Modal.Body>Bạn có chắc muốn xóa user "{selectedUser?.username}" không?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
                        <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>
    );
}