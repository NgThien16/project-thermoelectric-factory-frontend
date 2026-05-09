import React from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { FaUserCircle, FaBell } from 'react-icons/fa';

const TopNavbar = () => {
  return (
    <Navbar expand="lg" className="top-navbar px-3">
      <Container fluid>
        <Navbar.Brand href="#">Hệ thống Quản lý Thiết bị & Bảo trì</Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          <Nav.Link href="#" className="me-3">
            <FaBell size={20} />
          </Nav.Link>
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center border-0 bg-transparent">
              <FaUserCircle size={24} className="me-2" />
              <span>Admin</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#profile">Hồ sơ</Dropdown.Item>
              <Dropdown.Item href="#settings">Cài đặt</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#logout">Đăng xuất</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
