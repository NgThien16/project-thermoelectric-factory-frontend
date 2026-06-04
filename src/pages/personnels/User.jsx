import {useEffect, useState} from "react";
import {Formik, Form, Field} from "formik";
import {Button, Card, Table, Modal} from "react-bootstrap";
import {FaEdit, FaPlus, FaTrash, FaSearch} from "react-icons/fa";
import {toast} from "react-toastify";

import {UserService} from "../../service/personnels_manager/UserService.js";
import {EmployeeService} from "../../service/personnels_manager/EmployeeService.js";
import {RoleService} from "../../service/personnels_manager/RoleService.js";
import {UserRoleService} from "../../service/personnels_manager/UserRoleService.js";

export default function UserPage() {
    const [users, setUsers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);

    const [inputValue, setInputValue] = useState("");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [editData, setEditData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const pageSize = 3;

    const getData = (res) => {
        return res?.data !== undefined ? res.data : res;
    };

    const getArrayData = (res) => {
        const data = getData(res);

        if (Array.isArray(data)) {
            return data;
        }

        if (Array.isArray(data?.content)) {
            return data.content;
        }

        return [];
    };

    const fetchAll = async () => {
        try {
            const [userRes, empRes, roleRes] = await Promise.all([
                UserService.getAll(),
                EmployeeService.getAll(),
                RoleService.getAll()
            ]);

            const userList = getArrayData(userRes);
            const employeeList = getArrayData(empRes);
            const roleList = getArrayData(roleRes);

            setEmployees(employeeList);
            setRoles(roleList);

            const searchText = keyword.trim().toLowerCase();

            const filteredUsers = searchText
                ? userList.filter(user =>
                    (user.username || "").toLowerCase().includes(searchText)
                )
                : userList;

            const calculatedTotalPages = Math.max(
                Math.ceil(filteredUsers.length / pageSize),
                1
            );

            const safePage = page >= calculatedTotalPages ? 0 : page;
            const startIndex = safePage * pageSize;
            const endIndex = startIndex + pageSize;

            setUsers(filteredUsers.slice(startIndex, endIndex));
            setTotalPages(calculatedTotalPages);

            if (safePage !== page) {
                setPage(safePage);
            }
        } catch (err) {
            console.error("Lỗi tải user:", err);
            toast.error("Lỗi khi tải dữ liệu user!");
        }
    };

    useEffect(() => {
        fetchAll();
    }, [keyword, page]);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            // payload chuẩn DTO cho backend
            const payload = {
                username: values.username,
                password: values.password,
                confirmPassword: values.confirmPassword,
                employeeId: values.employeeId
            };

            if (editData) await UserService.update(editData.id, payload);
            else await UserService.create(payload);

            toast.success(editData ? "Cập nhật thành công!" : "Tạo user thành công!");
            resetForm();
            setEditData(null);
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
            setShowModal(false);
            setSelectedUser(null);
            await fetchAll();
        } catch (err) {
            console.error("Lỗi xóa user:", err);
            toast.error(err.response?.data?.message || "Không thể xóa user!");
        }
    };

    const handleAssignRole = async (userId, roleId) => {
        if (!userId || !roleId) {
            toast.warning("Thiếu user hoặc role!");
            return;
        }

        try {
            await UserRoleService.assignRole(userId, roleId);
            toast.success("Gán role thành công!");
            await fetchAll();
        } catch (err) {
            console.error("Lỗi gán role:", err);
            toast.error(err.response?.data?.message || "Không thể gán role!");
        }
    };

    const handleRemoveRole = async (userId, roleId) => {
        if (!userId || !roleId) {
            toast.warning("Thiếu user hoặc role!");
            return;
        }

        try {
            await UserRoleService.removeRole(userId, roleId);
            toast.success("Gỡ role thành công!");
            await fetchAll();
        } catch (err) {
            console.error("Lỗi gỡ role:", err);
            toast.error(err.response?.data?.message || "Không thể gỡ role!");
        }
    };

    return (
        <div className="p-4">
            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3>Danh sách tài khoản nhân viên</h3>
                        <FaPlus
                            style={{cursor: "pointer"}}
                            onClick={() => setEditData(null)}
                        />
                    </div>

                    <Formik
                        enableReinitialize
                        initialValues={{
                            username: editData?.username || "",
                            password: editData?.password || "",
                            confirmPassword: "",
                            employeeId: editData?.employee?.id || ""
                        }}
                        onSubmit={handleSubmit}
                    >
                        <Form className="d-flex mb-3">
                            <Field
                                name="username"
                                placeholder="Tài khoản"
                                className="form-control me-2"
                            />

                            <Field
                                name="password"
                                placeholder="Mật khẩu"
                                className="form-control me-2"
                            />
                            <Field
                                type="password"
                                name="confirmPassword"
                                placeholder="Xác nhận mật khẩu"
                                className="form-control me-2"
                            />

                            <Field
                                as="select"
                                name="employeeId"
                                className="form-control me-2"
                                disabled={!!editData}
                            >
                                <option value="">Chọn nhân viên</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.fullName || emp.name}
                                    </option>
                                ))}
                            </Field>

                            <Button type="submit">
                                {editData ? "Cập nhật" : "Tạo mới"}
                            </Button>
                        </Form>
                    </Formik>

                    <div className="d-flex mb-3">
                        <input
                            className="form-control me-2"
                            placeholder="Tìm kiếm tài khoản"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />

                        <Button
                            variant="primary"
                            className="me-2"
                            onClick={() => {
                                setPage(0);
                                setKeyword(inputValue);
                            }}
                        >
                            <FaSearch/> Tìm kiếm
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => {
                                setInputValue("");
                                setKeyword("");
                                setPage(0);
                            }}
                        >
                            Quay lại
                        </Button>
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
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Không có user nào
                                </td>
                            </tr>
                        ) : (
                            users.map((user,i) => (
                                <tr key={user.id}>
                                    <td>{i+1}</td>
                                    <td>{user.username}</td>
                                    <td>{user.employeeName || "Chưa có nhân viên"}</td>
                                    <td>
                                        <div className="d-flex flex-wrap">
                                            {roles.length === 0 ? (
                                                <span>Chưa có role</span>
                                            ) : (
                                                roles.map(role => {
                                                    const hasRole = user.roles?.some(ur => Number(ur.id) === Number(role.id));

                                                    return (
                                                        <div
                                                            key={role.id}
                                                            className="d-flex align-items-center me-2 mb-1"
                                                        >
                                                            <span className="me-1">
                                                                {role.name}
                                                            </span>

                                                            {hasRole ? (
                                                                <Button
                                                                    size="sm"
                                                                    variant="warning"
                                                                    onClick={() =>
                                                                        handleRemoveRole(user.id, role.id)
                                                                    }
                                                                >
                                                                    Gỡ
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    variant="success"
                                                                    onClick={() =>
                                                                        handleAssignRole(user.id, role.id)
                                                                    }
                                                                >
                                                                    Gán
                                                                </Button>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </td>

                                    <td>
                                        <FaEdit
                                            style={{cursor: "pointer", marginRight: "8px"}}
                                            onClick={() => setEditData(user)}
                                        />

                                        <FaTrash
                                            style={{cursor: "pointer"}}
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setShowModal(true);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <Button
                            disabled={page === 0}
                            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                        >
                            Trước
                        </Button>

                        <span>
                            Trang {page + 1} / {totalPages}
                        </span>

                        <Button
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Sau
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Bạn có chắc muốn xóa user "{selectedUser?.username}" không?
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
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
    );
}