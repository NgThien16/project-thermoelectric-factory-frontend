import { Nav, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaUsers, FaChartLine, FaCogs, FaWarehouse, FaClipboardList } from 'react-icons/fa';
import { Link,useLocation } from 'react-router-dom';
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
          <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} active={location.pathname.startsWith('/personnels')}>
                  <FaUsers /> Nhân sự
              </Dropdown.Toggle>
              <Dropdown.Menu>
                  <LinkContainer to="/personnels/employees"><Dropdown.Item>Nhân viên</Dropdown.Item></LinkContainer>
                  <LinkContainer to="/personnels/work_positions"><Dropdown.Item>Vị trí công việc</Dropdown.Item></LinkContainer>
                  <LinkContainer to="/personnels/employees/{employeeId}/positions"><Dropdown.Item>Vị trí công việc nhân viên</Dropdown.Item></LinkContainer>
                  <LinkContainer to="/personnels/departments"><Dropdown.Item>Phòng ban</Dropdown.Item></LinkContainer>
                  <LinkContainer to="/personnels/positions"><Dropdown.Item>Chức vụ</Dropdown.Item></LinkContainer>
                  <LinkContainer to="/personnels/roles"><Dropdown.Item>Vai trò</Dropdown.Item></LinkContainer>
                  <LinkContainer to="/personnels/users"><Dropdown.Item>Người dùng</Dropdown.Item></LinkContainer>
              </Dropdown.Menu>
          </Dropdown>
          <LinkContainer to="/technical-reports">
              <Nav.Link active={location.pathname.startsWith('/technical-reports')}>
                  <FaClipboardList /> Biên bản kỹ thuật
              </Nav.Link>
          </LinkContainer>
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
                  to="/consumable-transactions"
                  active={location.pathname === '/consumable-transactions'}
              >
                Vật tư tiêu hao
              </Nav.Link>

              <Nav.Link
                  as={Link}
                  to="/replacement-transactions"
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