import { Nav } from "react-bootstrap";
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
    const [openPersonnelMenu, setOpenPersonnelMenu] =
        useState(false);
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
                    <>
                        <div
                            className="sidebar-parent-menu"
                            onClick={() =>
                                setOpenPersonnelMenu(
                                    !openPersonnelMenu
                                )
                            }
                        >
                            <FaUsers className="me-2" />
                            Nhân sự
                        </div>

                        {openPersonnelMenu && (
                            <div className="sidebar-submenu">

                                <Nav.Link
                                    as={Link}
                                    to="/personnels/employees"
                                    active={location.pathname.startsWith("/personnels/employees")}
                                >
                                    Nhân viên
                                </Nav.Link>

                                <Nav.Link
                                    as={Link}
                                    to="/personnels/departments"
                                    active={location.pathname.startsWith("/personnels/departments")}
                                >
                                    Phòng ban
                                </Nav.Link>

                                <Nav.Link
                                    as={Link}
                                    to="/personnels/positions"
                                    active={location.pathname.startsWith("/personnels/positions")}
                                >
                                    Chức vụ
                                </Nav.Link>

                                <Nav.Link
                                    as={Link}
                                    to="/personnels/roles"
                                    active={location.pathname.startsWith("/personnels/roles")}
                                >
                                    Vai trò
                                </Nav.Link>

                                <Nav.Link
                                    as={Link}
                                    to="/personnels/users"
                                    active={location.pathname.startsWith("/personnels/users")}
                                >
                                    Người dùng
                                </Nav.Link>

                            </div>
                        )}
                    </>
                )}

                {/* ================= BIÊN BẢN KỸ THUẬT ================= */}
                {(
                    isAdmin ||
                    hasRole([
                        "ROLE_QUẢN ĐỐC SỬA CHỮA",
                        "ROLE_TỔ TRƯỞNG"
                    ])
                ) && (
                    <LinkContainer to="/technical-reports">
                        <Nav.Link
                            active={location.pathname.startsWith("/technical-reports")}
                        >
                            <FaClipboardList />
                            Biên bản kỹ thuật
                        </Nav.Link>
                    </LinkContainer>
                )}

                {/* ================= HỆ THỐNG ================= */}
                {(isAdmin || hasRole(["ROLE_QUẢN ĐỐC VẬN HÀNH"])) && (
                    <>
                        <Nav.Link
                            as={Link}
                            to="/system-equipments"
                            active={location.pathname.startsWith("/system-equipments")}
                        >
                            <FaCogs /> Hệ thống
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/equipments"
                            active={location.pathname.startsWith("/equipments")}
                        >
                            <FaCogs /> Thiết bị
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/equipment-types"
                            active={location.pathname.startsWith("/equipment-types")}
                        >
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

                                <Nav.Link
                                    as={Link}
                                    to="/consumable-materials"
                                    active={location.pathname.startsWith("/consumable-materials")}
                                >
                                    Vật tư tiêu hao
                                </Nav.Link>

                                <Nav.Link
                                    as={Link}
                                    to="/replacement-materials"
                                    active={location.pathname.startsWith("/replacement-materials")}
                                >
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

                                <Nav.Link
                                    as={Link}
                                    to="/consumable-transactions"
                                    active={location.pathname.startsWith("/consumable-transactions")}
                                >
                                    Vật tư tiêu hao
                                </Nav.Link>

                                <Nav.Link
                                    as={Link}
                                    to="/replacement-transactions"
                                    active={location.pathname.startsWith("/replacement-transactions")}
                                >
                                    Vật tư thay thế
                                </Nav.Link>

                            </div>
                        )}
                    </>
                )}

                {/* ================= CCDC ================= */}
                {(isAdmin || hasRole(["ROLE_THỦ KHO CCDC"])) && (
                    <>
                        <Nav.Link
                            as={Link}
                            to="/tool"
                            active={
                                location.pathname === "/tool"
                            }
                        >
                            <FaClipboardList />
                            Công cụ dụng cụ
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/tool/borrowings"
                            active={location.pathname.startsWith("/tool/borrowings")}
                        >
                            <FaClipboardList />
                            Quản lý mượn/trả
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/tool/user-borrow"
                            active={location.pathname.startsWith("/tool/user-borrow")}
                        >
                            <FaClipboardList />
                            Đăng ký mượn đồ
                        </Nav.Link>
                    </>
                )}
                {/* ================= YÊU CẦU SỬA CHỮA ================= */}
                {(isAdmin || hasRole(["ROLE_TRƯỞNG CA","ROLE_TRƯỞNG KÍP"])) && (
                    <>
                        <Nav.Link
                            as={Link}
                            to="/repair-orders"
                            active={location.pathname.startsWith("/repair-orders")}
                        >
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