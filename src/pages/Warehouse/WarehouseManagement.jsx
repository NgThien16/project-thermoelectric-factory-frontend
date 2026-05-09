import React, { useState } from 'react';
import { Table, Button, Card, Row, Col, Form, Modal, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBoxOpen } from 'react-icons/fa';

const WarehouseManagement = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Quản lý Kho Vật tư</h3>
        <Button variant="success" className="d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <FaPlus /> Nhập kho mới
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary text-white p-3 rounded-circle me-3">
                <FaBoxOpen size={24} />
              </div>
              <div>
                <p className="text-muted mb-0">Tổng mặt hàng</p>
                <h4 className="mb-0">1,240</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={5}>
              <Form.Control type="text" placeholder="Tìm theo mã hoặc tên vật tư..." />
            </Col>
            <Col md={3}>
              <Form.Select>
                <option>Tất cả loại vật tư</option>
                <option>Vật tư thay thế</option>
                <option>Vật tư tiêu hao</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="primary" className="w-100">
                <FaSearch /> Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Mã VT</th>
                <th>Tên vật tư</th>
                <th>Loại</th>
                <th>Đơn vị</th>
                <th>Tồn kho</th>
                <th>Vị trí</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>VT-001</td>
                <td>Gioăng cao su chịu nhiệt</td>
                <td>Tiêu hao</td>
                <td>Cái</td>
                <td><Badge bg="success">150</Badge></td>
                <td>Kệ A1-02</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2"><FaEdit /></Button>
                  <Button variant="outline-danger" size="sm"><FaTrash /></Button>
                </td>
              </tr>
              <tr>
                <td>VT-002</td>
                <td>Vòng bi SKF 6205</td>
                <td>Thay thế</td>
                <td>Bộ</td>
                <td><Badge bg="danger">5</Badge></td>
                <td>Kệ B2-05</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2"><FaEdit /></Button>
                  <Button variant="outline-danger" size="sm"><FaTrash /></Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nhập kho / Cập nhật vật tư</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên vật tư</Form.Label>
                  <Form.Control type="text" placeholder="Nhập tên..." />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mã vật tư</Form.Label>
                  <Form.Control type="text" placeholder="Nhập mã..." />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Số lượng</Form.Label>
                  <Form.Control type="number" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Đơn vị tính</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Vị trí trong kho</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>Lưu thông tin</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WarehouseManagement;
