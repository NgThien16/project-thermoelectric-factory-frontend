import { Nav, Dropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {
    FaUsers,
    FaChartLine,
    FaCogs,
    FaWarehouse,
    FaClipboardList,
    FaWrench
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "../../styles/Layout.css";
import { useState } from "react";
import useAuth from "../../context/useAuth";

const Sidebar = () => {

    const location = useLocation();
    const { user } = useAuth();

    const [openMaterialMenu, setOpenMaterialMenu] =
        useState(false);

    const [openTransactionMenu, setOpenTransactionMenu] =
        useState(false);

    const hasRole = (roles) =>
        user?.roles?.some(r => roles.includes(r));

    const isAdmin =
        user?.roles?.includes("ROLE_ADMIN");

    return (
        <div className="sidebar">

            <div className="sidebar-header">
                <h5>NHÀ MÁY NHIỆT ĐIỆN</h5>
            </div>

            <Nav className="flex-column mt-2">

                {/* DASHBOARD (ai cũng thấy) */}
                <Nav.Link
                    as={Link}
                    to="/"
                    active={location.pathname === "/"}
                >
                    <FaChartLine />
                    Dashboard
                </Nav.Link>

                {/* ================= NHÂN SỰ ================= */}
                {(isAdmin || hasRole(["ROLE_NHÂN SỰ"])) && (
                    <Dropdown as={Nav.Item}>

                        <Dropdown.Toggle
                            as={Nav.Link}
                            active={location.pathname.startsWith("/personnels")}
                        >
                            <FaUsers />
                            Nhân sự
                        </Dropdown.Toggle>

                        <Dropdown.Menu>

                            <LinkContainer to="/personnels/employees">
                                <Dropdown.Item>Nhân viên</Dropdown.Item>
                            </LinkContainer>

                            <LinkContainer to="/personnels/departments">
                                <Dropdown.Item>Phòng ban</Dropdown.Item>
                            </LinkContainer>

                            <LinkContainer to="/personnels/positions">
                                <Dropdown.Item>Chức vụ</Dropdown.Item>
                            </LinkContainer>

                            <LinkContainer to="/personnels/roles">
                                <Dropdown.Item>Vai trò</Dropdown.Item>
                            </LinkContainer>

                            <LinkContainer to="/personnels/users">
                                <Dropdown.Item>Người dùng</Dropdown.Item>
                            </LinkContainer>

                        </Dropdown.Menu>
                    </Dropdown>
                )}

                {/* ================= HỆ THỐNG ================= */}
                {(isAdmin || hasRole(["ROLE_QUẢN ĐỐC VẬN HÀNH"])) && (
                    <>
                        <Nav.Link as={Link} to="/system-equipments">
                            <FaCogs /> Hệ thống
                        </Nav.Link>

                        <Nav.Link as={Link} to="/equipments">
                            <FaCogs /> Thiết bị
                        </Nav.Link>

                        <Nav.Link as={Link} to="/equipment-types">
                            <FaCogs /> Loại thiết bị
                        </Nav.Link>
                    </>
                )}

                {/* ================= VẬT TƯ ================= */}
                {(isAdmin || hasRole(["ROLE_THỦ KHO VẬT TƯ"])) && (
                    <>
                        <div
                            className="sidebar-parent-menu"
                            onClick={() =>
                                setOpenMaterialMenu(!openMaterialMenu)
                            }
                        >
                            <FaWarehouse className="me-2" />
                            Quản lý danh mục vật tư
                        </div>

                        {openMaterialMenu && (
                            <div style={{ marginLeft: "20px" }}>

                                <Nav.Link as={Link} to="/consumable-materials">
                                    Vật tư tiêu hao
                                </Nav.Link>

                                <Nav.Link as={Link} to="/replacement-materials">
                                    Vật tư thay thế
                                </Nav.Link>

                            </div>
                        )}

                        <div
                            className="sidebar-parent-menu"
                            onClick={() =>
                                setOpenTransactionMenu(!openTransactionMenu)
                            }
                        >
                            <FaWarehouse className="me-2" />
                            Xuất/Nhập vật tư
                        </div>

                        {openTransactionMenu && (
                            <div style={{ marginLeft: "20px" }}>

                                <Nav.Link as={Link} to="/consumable-transactions">
                                    Vật tư tiêu hao
                                </Nav.Link>

                                <Nav.Link as={Link} to="/replacement-transactions">
                                    Vật tư thay thế
                                </Nav.Link>

                            </div>
                        )}
                    </>
                )}

                {/* ================= CCDC ================= */}
                {(isAdmin || hasRole(["ROLE_THỦ KHO CCDC"])) && (
                    <>
                        <Nav.Link as={Link} to="/tool">
                            <FaClipboardList />
                            Công cụ dụng cụ
                        </Nav.Link>

                        <Nav.Link as={Link} to="/tool/borrowings">
                            <FaClipboardList />
                            Quản lý mượn/trả
                        </Nav.Link>

                        <Nav.Link as={Link} to="/tool/user-borrow">
                            <FaClipboardList />
                            Đăng ký mượn đồ
                        </Nav.Link>
                    </>
                )}
                {/* ================= YÊU CẦU SỬA CHỮA ================= */}
                {(isAdmin || hasRole(["ROLE_TRƯỞNG CA","ROLE_TRƯỞNG KÍP"])) && (
                    <>
                        <Nav.Link as={Link} to="/repair-orders">
                            <FaWrench />
                            Yêu cầu sửa chữa
                        </Nav.Link>
                    </>
                )}
            </Nav>

        </div>
    );
};

export default Sidebar;