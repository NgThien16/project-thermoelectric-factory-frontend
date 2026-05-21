import { Nav, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaUsers, FaChartLine, FaCogs, FaWarehouse, FaClipboardList } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import '../../styles/Layout.css';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h5>NHÀ MÁY NHIỆT ĐIỆN</h5>
            </div>
            <Nav className="flex-column mt-2">

                {/* Dashboard */}
                <LinkContainer to="/" exact>
                    <Nav.Link active={location.pathname === '/'}><FaChartLine /> Dashboard</Nav.Link>
                </LinkContainer>

                {/* Nhân sự Dropdown */}
                <Dropdown as={Nav.Item}>
                    <Dropdown.Toggle as={Nav.Link} active={location.pathname.startsWith('/personnels')}>
                        <FaUsers /> Nhân sự
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <LinkContainer to="/personnels/employees"><Dropdown.Item>Nhân viên</Dropdown.Item></LinkContainer>
                        <LinkContainer to="/personnels/departments"><Dropdown.Item>Phòng ban</Dropdown.Item></LinkContainer>
                        <LinkContainer to="/personnels/positions"><Dropdown.Item>Chức vụ</Dropdown.Item></LinkContainer>
                        <LinkContainer to="/personnels/roles"><Dropdown.Item>Vai trò</Dropdown.Item></LinkContainer>
                        <LinkContainer to="/personnels/users"><Dropdown.Item>Người dùng</Dropdown.Item></LinkContainer>
                    </Dropdown.Menu>
                </Dropdown>

                {/* Các menu khác */}
                <LinkContainer to="/system-equipments">
                    <Nav.Link active={location.pathname.startsWith('/system-equipments')}><FaCogs /> Hệ thống</Nav.Link>
                </LinkContainer>

                <LinkContainer to="/equipments">
                    <Nav.Link active={location.pathname.startsWith('/equipments')}><FaCogs /> Thiết bị</Nav.Link>
                </LinkContainer>

                <LinkContainer to="/equipment-types">
                    <Nav.Link active={location.pathname.startsWith('/equipment-types')}><FaCogs /> Loại thiết bị</Nav.Link>
                </LinkContainer>

                <LinkContainer to="/consumable-material">
                    <Nav.Link active={location.pathname === '/consumable-material'}><FaWarehouse /> Quản lý vật tư tiêu hao</Nav.Link>
                </LinkContainer>

                <LinkContainer to="/replacement-material">
                    <Nav.Link active={location.pathname === '/replacement-material'}><FaWarehouse /> Quản lý vật tư thay thế</Nav.Link>
                </LinkContainer>

                <LinkContainer to="/ccdc">
                    <Nav.Link active={location.pathname === '/ccdc'}><FaClipboardList /> Công cụ dụng cụ</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/ccdc/borrowings">
                    <Nav.Link active={location.pathname === '/ccdc/borrowings'}><FaClipboardList /> Quản lý mượn/trả</Nav.Link>
                </LinkContainer>

            </Nav>
        </div>
    );
};

export default Sidebar;