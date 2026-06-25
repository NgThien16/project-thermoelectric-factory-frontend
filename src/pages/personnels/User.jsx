import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Formik, Form, Field } from "formik";
import { Button, Card, Table, Modal } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

import { UserService } from "../../service/personnels_manager/UserService.js";
import { EmployeeService } from "../../service/personnels_manager/EmployeeService.js";
import { RoleService } from "../../service/personnels_manager/RoleService.js";
import { UserRoleService } from "../../service/personnels_manager/UserRoleService.js";

function RoleDropdown({ user, roles, onAssignRole, onRemoveRole }) {
    const [open, setOpen] = useState(false);
    const [menuStyle, setMenuStyle] = useState({});

    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const updateMenuPosition = () => {
        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();

        const viewportPadding = 12;
        const preferredWidth = 420;
        const width = Math.max(
            280,
            Math.min(preferredWidth, window.innerWidth - viewportPadding * 2)
        );

        const left = Math.min(
            Math.max(rect.left, viewportPadding),
            window.innerWidth - width - viewportPadding
        );

        const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
        const spaceAbove = rect.top - viewportPadding;

        const shouldOpenUp = spaceBelow < 260 && spaceAbove > spaceBelow;
        const availableHeight = shouldOpenUp ? spaceAbove : spaceBelow;
        const maxHeight = Math.max(160, Math.min(availableHeight, 420));

        const top = shouldOpenUp
            ? Math.max(viewportPadding, rect.top - maxHeight - 6)
            : Math.min(
                rect.bottom + 6,
                window.innerHeight - maxHeight - viewportPadding
            );

        setMenuStyle({
            position: "fixed",
            top,
            left,
            width,
            maxHeight,
            overflowY: "auto",
            zIndex: 20000,
            background: "#fff",
            border: "1px solid rgba(15, 23, 42, 0.15)",
            borderRadius: "8px",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.22)",
            padding: "8px",
        });
    };

    const handleToggle = () => {
        if (!open) {
            updateMenuPosition();
        }

        setOpen((prev) => !prev);
    };

    useEffect(() => {
        if (!open) return;

        updateMenuPosition();

        const handleClickOutside = (event) => {
            const target = event.target;

            if (buttonRef.current?.contains(target)) return;
            if (menuRef.current?.contains(target)) return;

            setOpen(false);
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        const handleReposition = () => {
            updateMenuPosition();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        window.addEventListener("resize", handleReposition);
        window.addEventListener("scroll", handleReposition, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
            window.removeEventListener("resize", handleReposition);
            window.removeEventListener("scroll", handleReposition, true);
        };
    }, [open]);

    const menu = (
        <div ref={menuRef} style={menuStyle}>
            {roles.length === 0 ? (
                <div
                    style={{
                        padding: "10px 12px",
                        color: "#64748b",
                        fontWeight: 500,
                    }}
                >
                    Không có quyền nào
                </div>
            ) : (
                roles.map((role) => {
                    const hasRole = (user.roles || []).some(
                        (item) => Number(item.id) === Number(role.id)
                    );

                    const roleName = role.name || role.roleName || "Không có tên quyền";

                    return (
                        <div
                            key={role.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "12px",
                                padding: "8px 10px",
                                borderRadius: "6px",
                                background: hasRole
                                    ? "rgba(13, 110, 253, 0.04)"
                                    : "transparent",
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    lineHeight: 1.35,
                                    color: "#0f172a",
                                    fontWeight: 500,
                                    wordBreak: "break-word",
                                }}
                            >
                                {roleName} ({hasRole ? "Gỡ" : "Gán"})
                            </div>

                            <Button
                                size="sm"
                                variant={hasRole ? "warning" : "success"}
                                style={{
                                    minWidth: "58px",
                                    flexShrink: 0,
                                }}
                                onClick={async (event) => {
                                    event.stopPropagation();

                                    if (hasRole) {
                                        await onRemoveRole(user.id, role.id);
                                    } else {
                                        await onAssignRole(user.id, role.id);
                                    }

                                    setOpen(false);
                                }}
                            >
                                {hasRole ? "Gỡ" : "Gán"}
                            </Button>
                        </div>
                    );
                })
            )}
        </div>
    );

    return (
        <>
            <Button
                ref={buttonRef}
                variant="secondary"
                size="sm"
                type="button"
                onClick={handleToggle}
            >
                Quyền <span style={{ marginLeft: "4px" }}>▾</span>
            </Button>

            {open && typeof document !== "undefined"
                ? createPortal(menu, document.body)
                : null}
        </>
    );
}

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

    const pageSize = 5;

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

        if (Array.isArray(data?.data)) {
            return data.data;
        }

        if (Array.isArray(data?.data?.content)) {
            return data.data.content;
        }

        return [];
    };

    const fetchAll = async () => {
        try {
            const [userRes, empRes, roleRes] = await Promise.all([
                UserService.getAll(),
                EmployeeService.getAll(),
                RoleService.getAll(),
            ]);

            const userList = getArrayData(userRes);
            const employeeList = getArrayData(empRes);
            const roleList = getArrayData(roleRes);

            setEmployees(employeeList);
            setRoles(roleList);

            const searchText = keyword.trim().toLowerCase();

            const filteredUsers = searchText
                ? userList.filter((user) =>
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
            const payload = {
                username: values.username,
                password: values.password,
                confirmPassword: values.confirmPassword,
                employeeId: values.employeeId,
            };

            if (editData) {
                await UserService.update(editData.id, payload);
            } else {
                await UserService.create(payload);
            }

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
                            style={{ cursor: "pointer" }}
                            onClick={() => setEditData(null)}
                        />
                    </div>

                    <Formik
                        enableReinitialize
                        initialValues={{
                            username: editData?.username || "",
                            password: editData?.password || "",
                            confirmPassword: "",
                            employeeId: editData?.employee?.id || "",
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

                                {employees.map((emp) => (
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
                            <FaSearch /> Tìm kiếm
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
                            users.map((user, i) => (
                                <tr key={user.id}>
                                    <td>{page * pageSize + i + 1}</td>

                                    <td>{user.username}</td>

                                    <td>
                                        {user.employeeName || "Chưa có nhân viên"}
                                    </td>

                                    <td>
                                        <RoleDropdown
                                            user={user}
                                            roles={roles}
                                            onAssignRole={handleAssignRole}
                                            onRemoveRole={handleRemoveRole}
                                        />
                                    </td>

                                    <td>
                                        <FaEdit
                                            style={{
                                                cursor: "pointer",
                                                marginRight: "8px",
                                            }}
                                            onClick={() => setEditData(user)}
                                        />

                                        <FaTrash
                                            style={{ cursor: "pointer" }}
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
                            onClick={() =>
                                setPage((prev) => Math.max(prev - 1, 0))
                            }
                        >
                            Trước
                        </Button>

                        <span>
                            {page + 1} / {totalPages}
                        </span>

                        <Button
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
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

                    <Button variant="danger" onClick={handleDelete}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}