import { useEffect, useState } from "react";
import {
    Card,
    Row,
    Col,
    Alert
} from "react-bootstrap";

import {
    FaCogs,
    FaTools,
    FaWarehouse,
    FaClipboardList,
    FaUsers,
    FaWrench,
    FaIndustry
} from "react-icons/fa";

import useAuth from "../context/useAuth";
import {getDashboard} from "../service/getDashboard.js";
import "../styles/Dashboard.css";
import {ROLE} from "../utils/roleUtils.js";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalEquipments: 0,
        totalRepairOrders: 0,
        totalUsers: 0,
        totalTools: 0
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const res = await getDashboard();

            setStats(res);

        } catch (e) {

            console.log(e);
        }
    };

    const { user } = useAuth();

    const modules = [
        {
            title: "Quản đốc vận hành",
            icon: <FaCogs size={35}/>,
            description:
                "Quản lý hệ thống, thiết bị và thông tin vận hành."
        },
        {
            title: "Thiết bị",
            icon: <FaTools size={35}/>,
            description:
                "Danh mục thiết bị và thông số kỹ thuật."
        },
        {
            title: "Yêu cầu sửa chữa",
            icon: <FaWrench size={35}/>,
            description:
                "Theo dõi các yêu cầu sửa chữa."
        },
        {
            title: "Kho vật tư",
            icon: <FaWarehouse size={35}/>,
            description:
                "Quản lý vật tư tiêu hao và thay thế."
        },
        {
            title: "Kho CCDC",
            icon: <FaClipboardList size={35}/>,
            description:
                "Quản lý công cụ dụng cụ."
        },
        {
            title: "Nhân sự",
            icon: <FaUsers size={35}/>,
            description:
                "Quản lý nhân viên và tài khoản."
        }
    ];
    const ROLE_DISPLAY_MAP = {
        [ROLE.ADMIN]: "Admin",
        [ROLE.HR]: "Nhân sự",
        [ROLE.OPERATION]: "Quản đốc vận hành",
        [ROLE.MAINTENANCE_MANAGER]: "Quản đốc sửa chữa",
        [ROLE.TEAM_LEADER]: "Tổ trưởng",
        [ROLE.MATERIAL]: "Thủ kho vật tư",
        [ROLE.TOOL]: "Thủ kho CCDC",
        [ROLE.SHIFT_LEADER]: "Trưởng ca",
        [ROLE.SHIFT_LEADER_ALT]: "Trưởng kíp"
    };

    const getDisplayRole = (user) => {
        if (!user || !Array.isArray(user.roles) || user.roles.length === 0) {
            return user?.username || "";
        }

        const rawRole = user.roles[0];
        return ROLE_DISPLAY_MAP[rawRole] || rawRole.replace(/^ROLE_/, "");
    };

    return (
        <div className="container-fluid">

            {/* Banner */}
            <Card
                className="border-0 shadow-lg mb-4 text-white"
                style={{
                    background:
                        "linear-gradient(135deg,#0d6efd,#0dcaf0)"
                }}
            >
                <Card.Body className="p-4">

                    <div className="d-flex align-items-center">

                        <FaIndustry
                            size={55}
                            className="me-3"
                        />

                        <div>

                            <h2 className="fw-bold mb-1">
                                CMMS Nhiệt Điện
                            </h2>

                            <p className="mb-0">
                                Hệ thống quản lý bảo trì thiết bị
                                nhà máy nhiệt điện
                            </p>

                        </div>

                    </div>

                </Card.Body>
            </Card>

            {/* Welcome */}
            {!user ? (
                <Alert variant="info">
                    Vui lòng đăng nhập để sử dụng hệ thống.
                </Alert>
            ) : (
                <Alert variant="success">
                    Xin chào{" "}
                    <strong className="text-danger">
                        {getDisplayRole(user)}
                    </strong>
                    , chúc bạn một ngày làm việc hiệu quả.
                </Alert>
            )}

            {/* Statistics */}
            <Row className="g-4 mb-4">

                <Col md={3}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>

                            <h6>Tổng thiết bị</h6>

                            <h2 className="fw-bold text-primary">
                                {stats.totalEquipments}
                            </h2>

                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>

                            <h6>Yêu cầu sửa chữa</h6>

                            <h2 className="fw-bold text-warning">
                                {stats.totalRepairOrders}
                            </h2>

                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>

                            <h6>Nhân sự</h6>

                            <h2 className="fw-bold text-success">
                                {stats.totalUsers}
                            </h2>

                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>

                            <h6>Công cụ dụng cụ</h6>

                            <h2 className="fw-bold text-danger">
                                {stats.totalTools}
                            </h2>

                        </Card.Body>
                    </Card>
                </Col>

            </Row>

            {/* Modules */}
            <Row className="g-4">

                {modules.map((module, index) => (

                    <Col
                        key={index}
                        xl={4}
                        md={6}
                    >
                        <Card
                            className="h-100 border-0 shadow dashboard-card"
                        >
                            <Card.Body className="text-center p-4">

                                <div className="dashboard-icon mb-3">
                                    {module.icon}
                                </div>

                                <h5 className="fw-bold">
                                    {module.title}
                                </h5>

                                <p className="text-muted">
                                    {module.description}
                                </p>

                            </Card.Body>
                        </Card>
                    </Col>

                ))}

            </Row>

            {/* About */}
            <Card className="mt-5 border-0 shadow">

                <Card.Body>

                    <h4 className="fw-bold mb-3">
                        Giới thiệu hệ thống
                    </h4>

                    <p>
                        CMMS Thermoelectric hỗ trợ quản lý
                        bảo trì, thiết bị, vật tư, công cụ
                        dụng cụ và nhân sự trong nhà máy
                        nhiệt điện.
                    </p>

                    <ul>
                        <li>
                            Quản lý nhân sự và phân quyền.
                        </li>
                        <li>
                            Quản lý thiết bị theo hệ thống.
                        </li>
                        <li>
                            Quản lý kho vật tư và CCDC.
                        </li>
                        <li>
                            Theo dõi quy trình:
                            Tạo yêu cầu sửa chữa → Tạo phiếu công tác →
                            Biên bản đánh giá kĩ thuật →
                            Lịch sử sửa chữa
                        </li>
                    </ul>

                </Card.Body>

            </Card>

        </div>
    );
}
