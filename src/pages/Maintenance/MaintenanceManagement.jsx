import React, { useState } from 'react';
import { Table, Button, Card, Row, Col, Form, Modal, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from 'react-icons/fa';

const MaintenanceManagement = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Quản lý Sửa chữa & Bảo trì</h3>
        <Button variant="success" className="d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <FaPlus /> Tạo yêu cầu mới
        </Button>
      </div>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Control type="text" placeholder="Tìm kiếm phiếu sửa chữa..." />
            </Col>
            <Col md={3}>
              <Form.Select>
                <option>Tất cả trạng thái</option>
                <option>Chờ duyệt</option>
                <option>Đang thực hiện</option>
                <option>Đã hoàn thành</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="primary" className="w-100 d-flex align-items-center justify-content-center gap-2">
                <FaSearch /> Lọc
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
                <th>Mã phiếu</th>
                <th>Thiết bị</th>
                <th>Nội dung</th>
                <th>Người yêu cầu</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>REQ-001</td>
                <td>Lò hơi số 1</td>
                <td>Thay gioăng ống dẫn hơi</td>
                <td>Nguyễn Văn A</td>
                <td>08/05/2026</td>
                <td><Badge bg="warning" text="dark">Chờ duyệt</Badge></td>
                <td>
                  <Button variant="outline-info" size="sm" className="me-2"><FaEye /></Button>
                  <Button variant="outline-primary" size="sm" className="me-2"><FaEdit /></Button>
                  <Button variant="outline-danger" size="sm"><FaTrash /></Button>
                </td>
              </tr>
              <tr>
                <td>REQ-002</td>
                <td>Máy nén khí C</td>
                <td>Bảo trì định kỳ</td>
                <td>Trần Văn C</td>
                <td>07/05/2026</td>
                <td><Badge bg="info">Đang thực hiện</Badge></td>
                <td>
                  <Button variant="outline-info" size="sm" className="me-2"><FaEye /></Button>
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
          <Modal.Title>Tạo Yêu cầu Sửa chữa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Thiết bị</Form.Label>
                  <Form.Select>
                    <option>Chọn thiết bị...</option>
                    <option>Lò hơi số 1</option>
                    <option>Tuabin 1</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mức độ ưu tiên</Form.Label>
                  <Form.Select>
                    <option>Thường</option>
                    <option>Khẩn cấp</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả hư hỏng/Nội dung bảo trì</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Nhập chi tiết..." />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>Lưu phiếu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MaintenanceManagement;
