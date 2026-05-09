import React, { useState } from 'react';
import { Table, Button, Card, Row, Col, Badge, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaTools, FaHistory, FaEdit, FaTrash } from 'react-icons/fa';

const EquipmentManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = (edit = false) => {
    setIsEdit(edit);
    setShowModal(true);
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Quản lý Thiết bị & Hệ thống</h3>
        <Button variant="success" className="d-flex align-items-center gap-2" onClick={() => handleShow(false)}>
          <FaPlus /> Thêm thiết bị
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm bg-primary text-white">
            <Card.Body>
              <Card.Title>Tổng số thiết bị</Card.Title>
              <h2>150</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm bg-success text-white">
            <Card.Body>
              <Card.Title>Đang vận hành</Card.Title>
              <h2>142</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm bg-warning text-white">
            <Card.Body>
              <Card.Title>Cần bảo trì</Card.Title>
              <h2>5</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 shadow-sm bg-danger text-white">
            <Card.Body>
              <Card.Title>Đang hỏng</Card.Title>
              <h2>3</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Mã thiết bị</th>
                <th>Tên thiết bị</th>
                <th>Hệ thống</th>
                <th>Vị trí</th>
                <th>Trạng thái</th>
                <th>Ngày bảo trì gần nhất</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TB-BOILER-01</td>
                <td>Lò hơi số 1</td>
                <td>Hệ thống Lò hơi</td>
                <td>Tầng 1 - Khu A</td>
                <td><Badge bg="success">Đang vận hành</Badge></td>
                <td>20/04/2026</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(true)}><FaEdit /></Button>
                  <Button variant="outline-info" size="sm" className="me-2"><FaTools /></Button>
                  <Button variant="outline-danger" size="sm"><FaTrash /></Button>
                </td>
              </tr>
              <tr>
                <td>TB-TURBINE-02</td>
                <td>Tuabin áp suất thấp</td>
                <td>Hệ thống Tuabin</td>
                <td>Tầng 2 - Khu B</td>
                <td><Badge bg="danger">Đang hỏng</Badge></td>
                <td>15/03/2026</td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(true)}><FaEdit /></Button>
                  <Button variant="outline-info" size="sm" className="me-2"><FaTools /></Button>
                  <Button variant="outline-danger" size="sm"><FaTrash /></Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Thêm/Sửa Thiết bị */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mã thiết bị</Form.Label>
                  <Form.Control type="text" placeholder="Ví dụ: TB-BOILER-01" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên thiết bị</Form.Label>
                  <Form.Control type="text" placeholder="Nhập tên thiết bị" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hệ thống</Form.Label>
                  <Form.Select>
                    <option>Chọn hệ thống</option>
                    <option>Hệ thống Lò hơi</option>
                    <option>Hệ thống Tuabin</option>
                    <option>Hệ thống Máy phát</option>
                    <option>Hệ thống Xử lý nước</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vị trí lắp đặt</Form.Label>
                  <Form.Control type="text" placeholder="Nhập vị trí" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select>
                    <option value="operating">Đang vận hành</option>
                    <option value="maintenance">Đang bảo trì</option>
                    <option value="broken">Đang hỏng</option>
                    <option value="standby">Dự phòng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày bảo trì gần nhất</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Thông số kỹ thuật chính</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Nhập các thông số quan trọng..." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleClose}>
            {isEdit ? 'Lưu thay đổi' : 'Thêm mới'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EquipmentManagement;
