import {Card, Row, Col, Alert} from "react-bootstrap";
import {
    FaCogs,
    FaTools,
    FaWarehouse,
    FaClipboardList,
    FaUsers,
    FaWrench
} from "react-icons/fa";
import useAuth from "../context/useAuth";

export default function Dashboard() {
    const { user } = useAuth();

    const modules = [
        {
            title: "Quản đốc vận hành",
            icon: <FaCogs size={40}/>,
            description:
                "Quản lý hệ thống, thiết bị và các thông tin vận hành."
        },
        {
            title: "Thiết bị",
            icon: <FaTools size={40}/>,
            description:
                "Quản lý danh mục thiết bị, loại thiết bị và thông tin chi tiết."
        },
        {
            title: "Yêu cầu sửa chữa",
            icon: <FaWrench size={40}/>,
            description:
                "Tạo và theo dõi các yêu cầu sửa chữa thiết bị trong nhà máy."
        },
        {
            title: "Kho vật tư",
            icon: <FaWarehouse size={40}/>,
            description:
                "Quản lý vật tư tiêu hao, vật tư thay thế và các giao dịch nhập xuất."
        },
        {
            title: "Kho CCDC",
            icon: <FaClipboardList size={40}/>,
            description:
                "Quản lý công cụ dụng cụ và các phiếu mượn trả."
        },
        {
            title: "Nhân sự",
            icon: <FaUsers size={40}/>,
            description:
                "Quản lý nhân viên, tài khoản, phòng ban và phân quyền."
        }
    ];

    return (
        <div className="container-fluid p-4">

            <div className="mb-4">
                <h2 className="fw-bold">
                    Hệ thống quản lý nhà máy nhiệt điện
                </h2>

                <p className="text-muted mb-0">
                    Hệ thống hỗ trợ quản lý thiết bị, vật tư,
                    công cụ dụng cụ và bảo trì trong nhà máy.
                </p>
            </div>

            {!user ? (
                <Alert variant="info">
                    <b>Thông báo</b>: Để sử dụng hệ thống, vui lòng đăng nhập bằng
                    tài khoản đã được cung cấp.
                </Alert>
            ) : (
                <Alert variant="success">
                    Chào mừng <b className={'text-danger'}>{user.username}</b>, hệ thống đã sẵn sàng sử dụng.
                </Alert>
            )}

            <Row className="g-4 mt-2">

                {modules.map((module, index) => (
                    <Col
                        key={index}
                        xl={3}
                        lg={4}
                        md={6}
                    >
                        <Card className="h-100 shadow-sm border-0">

                            <Card.Body className="text-center">

                                <div className="mb-3 text-primary">
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

            <Card className="mt-5 border-0 shadow-sm">

                <Card.Body>

                    <h4 className="mb-3">
                        Giới thiệu hệ thống
                    </h4>

                    <p>
                        Hệ thống được xây dựng nhằm hỗ trợ công tác quản lý
                        thiết bị, vật tư, công cụ dụng cụ và nhân sự trong
                        nhà máy nhiệt điện.
                    </p>

                    <p>
                        Các chức năng được phân quyền theo từng bộ phận nhằm
                        đảm bảo tính bảo mật và phù hợp với quy trình vận hành
                        thực tế của doanh nghiệp.
                    </p>

                    <ul>
                        <li>
                            Quản lý hệ thống và thiết bị.
                        </li>
                        <li>
                            Quản lý vật tư tiêu hao và vật tư thay thế.
                        </li>
                        <li>
                            Quản lý công cụ dụng cụ và phiếu mượn trả.
                        </li>
                        <li>
                            Quản lý nhân viên, phòng ban và tài khoản.
                        </li>
                        <li>
                            Phân quyền truy cập theo vai trò người dùng.
                        </li>
                    </ul>

                </Card.Body>

            </Card>

        </div>
    );
}