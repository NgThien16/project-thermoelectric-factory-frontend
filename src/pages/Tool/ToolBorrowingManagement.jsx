import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaReply, FaEdit, FaSearch } from 'react-icons/fa';
import toolService from '../../service/tool/toolService.js';
import { toast } from 'react-toastify';

const ToolBorrowingManagement = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBorrowing, setSelectedBorrowing] = useState(null);
  const [editForm, setEditForm] = useState({
    id: null,
    employeeId: '',
    toolId: '',
    quantity: 0,
    note: '',
    status: ''
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const response = await toolService.getAllBorrowings();
      // Giả định backend trả về mảng trực tiếp hoặc trong response.data
      setBorrowings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Không thể tải danh sách mượn đồ');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm('Xác nhận trả công cụ này?')) {
      try {
        await toolService.returnTool(id);
        toast.success('Đã trả công cụ thành công');
        fetchBorrowings();
      } catch (error) {
        toast.error('Lỗi khi thực hiện trả đồ');
        console.error(error);
      }
    }
  };

  const handleShowEdit = (borrowing) => {
    setSelectedBorrowing(borrowing);
    setEditForm({
      id: borrowing.id,
      employeeId: borrowing.employee?.id || '',
      toolId: borrowing.tool?.id || '',
      quantity: borrowing.quantity,
      note: borrowing.note || '',
      status: borrowing.status
    });
    setShowEditModal(true);
  };

  const handleUpdateBorrowing = async () => {
    try {
      const payload = {
        id: editForm.id,
        employee: { id: parseInt(editForm.employeeId) },
        tool: { id: parseInt(editForm.toolId) },
        quantity: parseInt(editForm.quantity),
        note: editForm.note,
        status: editForm.status
      };

      await toolService.updateBorrowing(editForm.id, payload);
      
      toast.success('Cập nhật thông tin thành công');
      setShowEditModal(false);
      fetchBorrowings();
    } catch (error) {
      toast.error('Lỗi khi cập nhật thông tin');
      console.error(error);
    }
  };

  const filteredBorrowings = borrowings.filter(b => 
    b.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.tool?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(b.employee?.id).includes(searchTerm)
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Quản lý mượn/trả CCDC</h3>
      </div>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="d-flex gap-2">
                <Form.Control 
                  type="text" 
                  placeholder="Tìm kiếm theo tên nhân viên hoặc công cụ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary" className="d-flex align-items-center gap-2">
                  <FaSearch /> Tìm
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Người mượn</th>
                <th>Công cụ</th>
                <th>Số lượng</th>
                <th>Ngày mượn</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center">Đang tải dữ liệu...</td></tr>
              ) : filteredBorrowings.length === 0 ? (
                <tr><td colSpan="8" className="text-center">Không có dữ liệu mượn đồ</td></tr>
              ) : (
                filteredBorrowings.map((borrowing) => (
                  <tr key={borrowing.id}>
                    <td>{borrowing.id}</td>
                    <td>
                      <div><strong>{borrowing.employee?.name || 'N/A'}</strong></div>
                      <small className="text-muted">ID: {borrowing.employee?.id}</small>
                    </td>
                    <td>{borrowing.tool?.name || 'N/A'}</td>
                    <td>{borrowing.quantity}</td>
                    <td>{borrowing.borrowDate ? new Date(borrowing.borrowDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                    <td>
                      {borrowing.status === 'Đã trả' ? (
                        <Badge bg="success">Đã trả</Badge>
                      ) : (
                        <Badge bg="warning" text="dark">Đang mượn</Badge>
                      )}
                    </td>
                    <td>{borrowing.note}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleShowEdit(borrowing)}
                        >
                          <FaEdit /> Sửa
                        </Button>
                        {borrowing.status !== 'Đã trả' ? (
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            onClick={() => handleReturn(borrowing.id)}
                          >
                            <FaReply /> Trả đồ
                          </Button>
                        ) : (
                          <span className="text-success small fw-bold">Đã trả rồi</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Sửa */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa thông tin mượn đồ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nhân viên (ID)</Form.Label>
              <Form.Control 
                type="number" 
                value={editForm.employeeId} 
                onChange={(e) => setEditForm({...editForm, employeeId: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Công cụ (ID)</Form.Label>
              <Form.Control 
                type="number" 
                value={editForm.toolId} 
                onChange={(e) => setEditForm({...editForm, toolId: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số lượng</Form.Label>
              <Form.Control 
                type="number" 
                value={editForm.quantity} 
                onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select 
                value={editForm.status} 
                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
              >
                <option value="Đang mượn">Đang mượn</option>
                <option value="Đã trả">Đã trả</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={editForm.note} 
                onChange={(e) => setEditForm({...editForm, note: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleUpdateBorrowing}>Lưu thay đổi</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ToolBorrowingManagement;
