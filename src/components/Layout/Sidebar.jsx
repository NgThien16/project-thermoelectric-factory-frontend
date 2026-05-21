import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaUsers, 
  FaCogs,
  FaWarehouse, 
  FaChartLine,
  FaClipboardList
} from 'react-icons/fa';
import '../../styles/Layout.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h5>NHÀ MÁY NHIỆT ĐIỆN</h5>
      </div>
      <Nav className="flex-column mt-2">
        <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
          <FaChartLine /> Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/nhan-su" active={location.pathname === '/nhan-su'}>
          <FaUsers /> Nhân sự
        </Nav.Link>
        <Nav.Link as={Link} to="/system-equipments" active={location.pathname.startsWith('/system-equipments')}>
          <FaCogs /> Hệ thống
        </Nav.Link>
        <Nav.Link as={Link} to="/equipments" active={location.pathname.startsWith('/equipments')}>
          <FaCogs /> Thiết bị
        </Nav.Link>
        <Nav.Link as={Link} to="/equipment-types" active={location.pathname.startsWith('/equipment-types')}>
          <FaCogs /> Loại thiết bị
        </Nav.Link>
        <Nav.Link as={Link} to="/consumable-material" active={location.pathname === '/consumable-material'}>
          <FaWarehouse /> Quản lý vật tư tiêu hao
        </Nav.Link>
        <Nav.Link as={Link} to="/replacement-material" active={location.pathname === '/replacement-material'}>
          <FaWarehouse /> Quản lý vật tư thay thế
        </Nav.Link>
        <Nav.Link as={Link} to="/tool" active={location.pathname === '/tool'}>
          <FaClipboardList /> Công cụ dụng cụ
        </Nav.Link>
        <Nav.Link as={Link} to="/tool/borrowings" active={location.pathname === '/tool/borrowings'}>
          <FaClipboardList /> Quản lý mượn/trả
        </Nav.Link>
        <Nav.Link as={Link} to="/tool/user-borrow" active={location.pathname === '/tool/user-borrow'}>
          <FaClipboardList /> Đăng ký mượn đồ
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
