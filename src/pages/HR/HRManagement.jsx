import React, { useState } from 'react';
import { Table, Button, Card, Row, Col, Form, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const HRManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = (edit = false) => {
    setIsEdit(edit);
    setShowModal(true);
  };

  return (
    <div className="p-4">
      <h3 className="mb-4">Quản lý Nhân sự</h3>
      
      <Row className="mb-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2">
                <Form.Control type="text" placeholder="Tìm kiếm nhân viên..." />
                <Button variant="primary" className="d-flex align-items-center gap-2">
                  <FaSearch /> Tìm
                </Button>
              </div>
              <Button variant="success" className="d-flex align-items-center gap-2" onClick={() => handleShow(false)}>
                <FaPlus /> Thêm nhân viên
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Họ và tên</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>NV001</td>
                <td>Nguyễn Văn A</td>
                <td>Phân xưởng Vận hành</td>
                <td>Quản đốc</td>
                <td>0901234567</td>
                <td><span className="badge bg-success">Đang làm việc</span></td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(true)}><FaEdit /></Button>
                  <Button variant="outline-danger" size="sm"><FaTrash /></Button>
                </td>
              </tr>
              <tr>
                <td>NV002</td>
                <td>Trần Thị B</td>
                <td>Phòng Kế hoạch vật tư</td>
                <td>Trưởng phòng</td>
                <td>0907654321</td>
                <td><span className="badge bg-success">Đang làm việc</span></td>
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(true)}><FaEdit /></Button>
                  <Button variant="outline-danger" size="sm"><FaTrash /></Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Thêm/Sửa Nhân viên */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mã nhân viên</Form.Label>
                  <Form.Control type="text" placeholder="Nhập mã nhân viên" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control type="text" placeholder="Nhập họ tên" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phòng ban</Form.Label>
                  <Form.Select>
                    <option>Chọn phòng ban</option>
                    <option>Phân xưởng Vận hành</option>
                    <option>Phòng Kế hoạch vật tư</option>
                    <option>Phân xưởng Sửa chữa</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chức vụ</Form.Label>
                  <Form.Control type="text" placeholder="Nhập chức vụ" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control type="text" placeholder="Nhập số điện thoại" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select>
                    <option value="active">Đang làm việc</option>
                    <option value="inactive">Đã nghỉ việc</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
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

export default HRManagement;
