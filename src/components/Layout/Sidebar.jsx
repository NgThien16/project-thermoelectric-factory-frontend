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
import {useState} from "react";

const Sidebar = () => {
  const [openMaterialMenu, setOpenMaterialMenu] = useState(false);
  const [openTransactionMenu, setOpenTransactionMenu] = useState(false);
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
        <div
            className="sidebar-parent-menu"
            onClick={() => setOpenMaterialMenu(!openMaterialMenu)}
        >
          <FaWarehouse className="me-2" />
          Quản lý danh mục vật tư
        </div>
        {openMaterialMenu && (
            <div style={{ marginLeft: '20px' }}>

              <Nav.Link
                  as={Link}
                  to="/consumable-materials"
                  active={location.pathname === '/consumable-materials'}
              >
                Vật tư tiêu hao
              </Nav.Link>

              <Nav.Link
                  as={Link}
                  to="/replacement-materials"
                  active={location.pathname === '/replacement-materials'}
              >
                Vật tư thay thế
              </Nav.Link>

            </div>
        )}
        <div
            className="sidebar-parent-menu"
            onClick={() => setOpenTransactionMenu(!openTransactionMenu)}
        >
          <FaWarehouse className="me-2"/>
          Xuất/Nhập Vật Tư
        </div>

        {openTransactionMenu && (
            <div style={{ marginLeft: '20px' }}>

              <Nav.Link
                  as={Link}
                  to="/import-material"
                  active={location.pathname === '/consumable-transactions'}
              >
                Vật tư tiêu hao
              </Nav.Link>

              <Nav.Link
                  as={Link}
                  to="/export-material"
                  active={location.pathname === '/replacement-transactions'}
              >
                Vật tư thay thế
              </Nav.Link>

            </div>
        )}
        <Nav.Link as={Link} to="/ccdc" active={location.pathname === '/ccdc'}>
          <FaClipboardList /> Công cụ dụng cụ
        </Nav.Link>
        <Nav.Link as={Link} to="/ccdc/borrowings" active={location.pathname === '/ccdc/borrowings'}>
          <FaClipboardList /> Quản lý mượn/trả
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
