import {
    Navbar,
    Container,
    Nav,
    Dropdown
} from "react-bootstrap";

import {
    FaUserCircle,
    FaBell
} from "react-icons/fa";

import useAuth from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

const TopNavbar = () => {

    const {
        user,
        logout
    } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        toast.success("Đăng xuất thành công");
        navigate("/");
    };

    return (
        <Navbar
            expand="lg"
            className="top-navbar px-3"
        >
            <Container fluid>
                <Navbar.Brand className={'fw-bold'}>
                        Hệ thống hỗ trợ quản lý thiết bị, vật tư,
                        công cụ dụng cụ và bảo trì trong nhà máy.
                </Navbar.Brand>

                <Nav className="ms-auto align-items-center">

                    <Nav.Link className="me-3">
                        <FaBell size={20}/>
                    </Nav.Link>

                    <Dropdown align="end">

                        <Dropdown.Toggle
                            variant="light"
                            id="dropdown-user"
                            className="d-flex align-items-center border-0 bg-transparent"
                        >
                            <FaUserCircle
                                size={24}
                                className="me-2"
                            />

                            <span>
                                {user?.username || "Khách"}
                            </span>

                        </Dropdown.Toggle>

                        <Dropdown.Menu>

                            {!user ? (

                                <Dropdown.Item
                                    href="/login"
                                >
                                    Đăng nhập
                                </Dropdown.Item>

                            ) : (

                                <>
                                    <Dropdown.Item disabled>
                                        {user.username}
                                    </Dropdown.Item>

                                    <Dropdown.Divider/>

                                    <Dropdown.Item
                                        onClick={handleLogout}
                                    >
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