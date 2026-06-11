import {
    Navbar,
    Container,
    Nav,
    Dropdown,
} from "react-bootstrap";

import {
    FaUserCircle,
    FaSignOutAlt,
    FaSignInAlt
} from "react-icons/fa";

import useAuth from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TopNavbar = () => {

    const {
        user,
        logout
    } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        toast.success(
            "Đăng xuất thành công"
        );

        navigate("/");
    };

    return (
        <Navbar
            expand="lg"
            className="top-navbar px-4"
        >
            <Container fluid>

                <Navbar.Brand
                    className="fw-semibold text-secondary"
                >
                    CMMS Nhiệt Điện
                </Navbar.Brand>

                <Nav className="ms-auto align-items-center">

                    {/* User */}
                    <Dropdown align="end">

                        <Dropdown.Toggle
                            variant="light"
                            id="dropdown-user"
                            className="border-0 bg-transparent shadow-none d-flex align-items-center"
                        >

                            <FaUserCircle
                                size={32}
                                className="text-primary me-2"
                            />

                            <div
                                className="text-start"
                            >
                                <div
                                    className="fw-semibold"
                                >
                                    {
                                        user?.username ||
                                        "Khách"
                                    }
                                </div>

                                {/*{*/}
                                {/*    user && (*/}
                                {/*        <small*/}
                                {/*            className="text-muted"*/}
                                {/*        >*/}
                                {/*            {*/}
                                {/*                user.roles?.[0]*/}
                                {/*                    ?.replace(*/}
                                {/*                        "ROLE_",*/}
                                {/*                        ""*/}
                                {/*                    )*/}
                                {/*            }*/}
                                {/*        </small>*/}
                                {/*    )*/}
                                {/*}*/}
                            </div>

                        </Dropdown.Toggle>

                        <Dropdown.Menu
                            className="shadow border-0"
                        >

                            {!user ? (

                                <Dropdown.Item
                                    onClick={() =>
                                        navigate(
                                            "/login"
                                        )
                                    }
                                >
                                    <FaSignInAlt className="me-2" />
                                    Đăng nhập
                                </Dropdown.Item>

                            ) : (

                                <>
                                    <Dropdown.Header>
                                        Xin chào,
                                        {" "}
                                        <strong>
                                            {user.username}
                                        </strong>
                                    </Dropdown.Header>

                                    <Dropdown.Divider />

                                    <Dropdown.Item
                                        onClick={
                                            handleLogout
                                        }
                                    >
                                        <FaSignOutAlt className="me-2" />
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