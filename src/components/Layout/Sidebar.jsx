import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaUsers, 
  FaCogs, 
  FaTools, 
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
        <Nav.Link as={Link} to="/kho" active={location.pathname === '/kho'}>
          <FaWarehouse /> Quản lý kho
        </Nav.Link>
        <Nav.Link as={Link} to="/ccdc" active={location.pathname === '/ccdc'}>
          <FaClipboardList /> Công cụ dụng cụ
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
