import {
    Navbar, Container, Nav, Dropdown,
} from "react-bootstrap";
import { FaUserCircle, FaBell } from "react-icons/fa";
import useAuth from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
// Import thêm hàm API mới của bạn ở đây
import {
    getWorkOrderNotification,
    getPendingMaterialCount,
    getRequestMaterialCount
} from "../../service/work_order/NotificationService";

const TopNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Đăng xuất thành công");
        navigate("/");
    };

    // Tách thành các state riêng biệt để dễ quản lý từng loại thông báo
    const [workOrderCount, setWorkOrderCount] = useState(0);
    const [requestMaterialCount, setRequestMaterialCount] = useState(0);
    const [pendingMaterialCount, setPendingMaterialCount] = useState(0);

    const canSeeManagerNotification = user?.roles?.some(role =>
        ["ROLE_ADMIN", "ROLE_QUẢN ĐỐC SỬA CHỮA", "ROLE_TỔ TRƯỞNG"].includes(role)
    );

    const canSeeWarehouseNotification = user?.roles?.some(role =>
        ["ROLE_THỦ KHO VẬT TƯ"].includes(role)
    );

    // Tính tổng số lượng thông báo hiển thị trên Badge quả chuông
    const totalNotificationCount = canSeeManagerNotification
        ? (workOrderCount + requestMaterialCount)
        : canSeeWarehouseNotification
            ? pendingMaterialCount
            : 0;

    useEffect(() => {
        if (!user) return;

        const loadNotification = async () => {
            try {
                if (canSeeManagerNotification) {
                    // Gọi đồng thời cả 2 API của Quản đốc bằng Promise.all để tối ưu hiệu năng
                    const [workOrderRes, materialRes] = await Promise.all([
                        getWorkOrderNotification(),
                        getRequestMaterialCount()
                    ]);

                    setWorkOrderCount(workOrderRes?.count || 0);
                    // Kiểm tra nếu API trả về Object { count: X } hoặc trả về trực tiếp số X
                    setRequestMaterialCount(materialRes?.count ?? materialRes ?? 0);
                } else if (canSeeWarehouseNotification) {
                    const count = await getPendingMaterialCount();
                    setPendingMaterialCount(count?.count ?? count ?? 0);
                }
            } catch (e) {
                console.error("Lỗi tải thông báo:", e);
            }
        };

        loadNotification();
        const interval = setInterval(loadNotification, 30000);
        return () => clearInterval(interval);
    }, [user, canSeeManagerNotification, canSeeWarehouseNotification]);

    return (
        <Navbar expand="lg" className="top-navbar px-3">
            <Container fluid>
                <Navbar.Brand className="fw-bold">
                    Hệ thống hỗ trợ quản lý thiết bị, vật tư,
                    công cụ dụng cụ và bảo trì trong nhà máy.
                </Navbar.Brand>

                <Nav className="ms-auto align-items-center">
                    {(canSeeManagerNotification || canSeeWarehouseNotification) && (
                        <Dropdown align="end" className="me-3">
                            <Dropdown.Toggle
                                as={Nav.Link}
                                className="position-relative p-0"
                                id="dropdown-notification"
                            >
                                <FaBell size={20} className={totalNotificationCount > 0 ? "text-warning" : ""} />
                                {totalNotificationCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {totalNotificationCount}
                                    </span>
                                )}
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ minWidth: "340px" }}>
                                <Dropdown.Header>Thông báo</Dropdown.Header>

                                {totalNotificationCount > 0 ? (
                                    <>
                                        {/* THÔNG BÁO 1 CỦA QUẢN ĐỐC: Yêu cầu sửa chữa */}
                                        {canSeeManagerNotification && workOrderCount > 0 && (
                                            <Dropdown.Item onClick={() => navigate("/work-orders/repair-orders")}>
                                                Có <b>{workOrderCount}</b> yêu cầu sửa chữa cần được tạo Phiếu Công Tác !!
                                            </Dropdown.Item>
                                        )}

                                        {/* THÔNG BÁO 2 CỦA QUẢN ĐỐC: Yêu cầu vật tư mới */}
                                        {canSeeManagerNotification && requestMaterialCount > 0 && (
                                            <Dropdown.Item onClick={() => navigate("/material-export/supply-slip")}>
                                                Có <b>{requestMaterialCount}</b> yêu cầu cấp phát vật tư mới cần xử lý !!
                                            </Dropdown.Item>
                                        )}

                                        {/* THÔNG BÁO CỦA THỦ KHO */}
                                        {canSeeWarehouseNotification && pendingMaterialCount > 0 && (
                                            <Dropdown.Item onClick={() => navigate("/material-export/release")}>
                                                Có <b>{pendingMaterialCount}</b> phiếu vật tư đang chờ cấp phát !!
                                            </Dropdown.Item>
                                        )}
                                    </>
                                ) : (
                                    <Dropdown.Item disabled className="text-muted">
                                        Không có thông báo nào gần đây !!
                                    </Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    )}

                    {/* Phần user dropdown giữ nguyên */}
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
                                <Dropdown.Item href="/login">Đăng nhập</Dropdown.Item>
                            ) : (
                                <>
                                    <Dropdown.Item disabled>{user.username}</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
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