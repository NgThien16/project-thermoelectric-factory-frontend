import {
    Navbar,
    Container,
    Nav,
    Dropdown,
} from "react-bootstrap";

import {
    FaUserCircle, FaBell
} from "react-icons/fa";

import useAuth from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getWorkOrderNotification } from "../../service/work_order/NotificationService";

const TopNavbar = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        toast.success(
            "Đăng xuất thành công"
        );

        navigate("/");
    };
    const [notificationCount, setNotificationCount] = useState(0);

    const canSeeNotification =
        user?.roles?.some(role =>
            [
                "ROLE_ADMIN",
                "ROLE_QUẢN ĐỐC SỬA CHỮA",
                "ROLE_TỔ TRƯỞNG"
            ].includes(role)
        );

    useEffect(() => {
        if (!user || !canSeeNotification) {
            return;
        }
        const loadNotification = async () => {
            try {
                const res = await getWorkOrderNotification();
                setNotificationCount(res.count || 0);
            } catch (e) {
                console.error("Lỗi tải thông báo:", e);
            }
        };
        loadNotification();
        const interval = setInterval(loadNotification, 30000);
        return () => clearInterval(interval);
    }, [user, canSeeNotification]);

    const handleNotificationClick = () => {
        navigate("/work-orders/repair-orders");
    };

    return (
        <Navbar expand="lg" className="top-navbar px-3">
            <Container fluid>

                <Navbar.Brand className="fw-bold">
                    Hệ thống hỗ trợ quản lý thiết bị, vật tư,
                    công cụ dụng cụ và bảo trì trong nhà máy.
                </Navbar.Brand>

                <Nav className="ms-auto align-items-center">
                    {canSeeNotification && (
                        <Dropdown align="end" className="me-3">
                            <Dropdown.Toggle
                                as={Nav.Link}
                                className="position-relative p-0"
                                id="dropdown-notification"
                            >
                                <FaBell size={20} className={notificationCount > 0 ? "text-warning" : ""} />
                                {notificationCount > 0 && (
                                    <span className="
                                    position-absolute
                                    top-0
                                    start-100
                                    translate-middle
                                    badge
                                    rounded-pill
                                    bg-danger">
                                    {notificationCount}
                                </span>
                                )}
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ minWidth: "320px" }}>
                                <Dropdown.Header>Thông báo</Dropdown.Header>
                                {notificationCount > 0 ? (
                                    <Dropdown.Item onClick={handleNotificationClick}>
                                        Có <b>{notificationCount}</b> yêu cầu sửa chữa cần được tạo Phiếu Công Tác !!
                                    </Dropdown.Item>
                                ) : (
                                    <Dropdown.Item disabled className="text-muted">
                                        Không có thông báo nào gần đây !!
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    )}

                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="light"
                            id="dropdown-user"
                            className="border-0 bg-transparent shadow-none d-flex align-items-center"
                        >
                            <FaUserCircle size={24} className="me-2" />
                            <span>{user?.username || "Khách"}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {!user ? (
                                <Dropdown.Item href="/login">
                                    Đăng nhập
                                </Dropdown.Item>
                            ) : (
                                <>
                                    <Dropdown.Item disabled>
                                        {user.username}
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>
                                        Đăng xuất
                                    </Dropdown.Item>

                                </>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>

                </Nav>
            </Container>

        </Navbar>
    );
};

export default TopNavbar;