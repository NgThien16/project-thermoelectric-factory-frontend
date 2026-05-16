import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Row, Col, Form, Modal, Badge } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowRight,} from 'react-icons/fa';
import toolService from '../../service/tool/toolService.js';
import { toast } from 'react-toastify';

const ToolManagement = () => {
  const [tools, setTools] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search state
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');

  // Form state cho Tool
  const [toolForm, setToolForm] = useState({
    id: null,
    name: '',
    code: '',
    type: '',
    totalQuantity: 0,
    availableQuantity: 0,
    location: '',
    description: ''
  });

  // Form state cho Mượn đồ
  const [borrowForm, setBorrowForm] = useState({
    toolId: '',
    employee: '',
    purpose: '',
    quantity: 1
  });

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await toolService.getAllTools(searchName, searchType === 'Tất cả chủng loại' ? '' : searchType);
      setTools(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách CCDC');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (tool = null) => {
    if (tool) {
      setToolForm(tool);
      setIsEdit(true);
    } else {
      setToolForm({
        id: null,
        name: '',
        code: '',
        type: '',
        totalQuantity: 0,
        availableQuantity: 0,
        location: '',
        description: ''
      });
      setIsEdit(false);
    }
    setShowModal(true);
  };

  const handleSaveTool = async () => {
    try {
      if (isEdit) {
        await toolService.updateTool(toolForm.id, toolForm);
        toast.success('Cập nhật CCDC thành công');
      } else {
        await toolService.createTool(toolForm);
        toast.success('Thêm CCDC mới thành công');
      }
      setShowModal(false);
      fetchTools();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  const handleDeleteTool = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa CCDC này?')) {
      try {
        await toolService.deleteTool(id);
        toast.success('Đã xóa CCDC');
        fetchTools();
      } catch (error) {
        toast.error('Lỗi khi xóa CCDC');
      }
    }
  };

  const handleBorrow = async () => {
    console.log('Bắt đầu handleBorrow');
    console.log('borrowForm:', borrowForm);
    try {
      const selectedTool = tools.find(t => String(t.id) === String(borrowForm.toolId));
      console.log('selectedTool:', selectedTool);
      
      if (!selectedTool) {
        toast.error('Vui lòng chọn công cụ dụng cụ');
        return;
      }

      const payload = {
        tool: { id: parseInt(selectedTool.id) },
        employee: { id: parseInt(borrowForm.employee) },
        note: borrowForm.purpose,
        quantity: parseInt(borrowForm.quantity) || 0,
        status: "Đang mượn",
        borrowDate: new Date().toISOString()
      };

      if (isNaN(payload.employee.id)) {
        toast.error('Mã ID nhân viên phải là số');
        return;
      }

      console.log('Payload gửi đi (đã tối ưu):', payload);
      
      const response = await toolService.borrowTool(payload);
      console.log('Kết quả từ Backend:', response.data);
      
      toast.success('Mượn thành công');
      setShowBorrowModal(false);
      // Reset form
      setBorrowForm({
        toolId: '',
        employee: '',
        purpose: '',
        quantity: 1
      });
      fetchTools();
    } catch (error) {
      console.error('Lỗi chi tiết:', error);
      
      // Lấy thông báo lỗi cụ thể từ Backend
      let errorMessage = 'Lỗi khi thực hiện mượn';
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Quản lý Công cụ dụng cụ (CCDC)</h3>
        <div className="d-flex gap-2">
          <Button variant="info" className="d-flex align-items-center gap-2 text-white" onClick={() => setShowBorrowModal(true)}>
            <FaArrowRight /> Mượn đồ
          </Button>
          <Button variant="success" className="d-flex align-items-center gap-2" onClick={() => handleShowModal()}>
            <FaPlus /> Thêm CCDC mới
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={5}>
              <Form.Control 
                type="text" 
                placeholder="Tìm kiếm theo tên..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchTools()}
              />
            </Col>
            <Col md={3}>
              <Form.Select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option>Tất cả chủng loại</option>
                <option>Điện</option>
                <option>Cơ khí</option>
                <option>Xây dựng</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="primary" className="w-100" onClick={fetchTools}><FaSearch /> Tìm</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Mã</th>
                <th>Tên công cụ</th>
                <th>Loại</th>
                <th>Tổng/Sẵn có</th>
                <th>Vị trí</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.id}>
                  <td>{tool.code}</td>
                  <td>{tool.name}</td>
                  <td>{tool.type}</td>
                  <td>
                    {tool.totalQuantity} / <Badge bg={tool.availableQuantity > 0 ? 'success' : 'danger'}>{tool.availableQuantity}</Badge>
                  </td>
                  <td>{tool.location}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(tool)}><FaEdit /></Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTool(tool.id)}><FaTrash /></Button>
                  </td>
                </tr>
              ))}
              {tools.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">Chưa có dữ liệu công cụ dụng cụ</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Thêm/Sửa CCDC */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh sửa CCDC' : 'Thêm CCDC mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mã CCDC</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={toolForm.code} 
                    onChange={(e) => setToolForm({...toolForm, code: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên CCDC</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={toolForm.name}
                    onChange={(e) => setToolForm({...toolForm, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chủng loại</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={toolForm.type}
                    onChange={(e) => setToolForm({...toolForm, type: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vị trí để</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={toolForm.location}
                    onChange={(e) => setToolForm({...toolForm, location: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tổng số lượng</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={toolForm.totalQuantity}
                    onChange={(e) => setToolForm({...toolForm, totalQuantity: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng sẵn có</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={toolForm.availableQuantity}
                    onChange={(e) => setToolForm({...toolForm, availableQuantity: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={toolForm.description}
                onChange={(e) => setToolForm({...toolForm, description: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleSaveTool}>Lưu thông tin</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Mượn đồ */}
      <Modal show={showBorrowModal} onHide={() => setShowBorrowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Đăng ký mượn công cụ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Chọn công cụ</Form.Label>
              <Form.Select 
                value={borrowForm.toolId}
                onChange={(e) => setBorrowForm({...borrowForm, toolId: e.target.value})}
              >
                <option value="">-- Chọn CCDC --</option>
                {tools.filter(t => t.availableQuantity > 0).map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số lượng mượn</Form.Label>
              <Form.Control 
                type="number" 
                min="1"
                value={borrowForm.quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  setBorrowForm({...borrowForm, quantity: val === '' ? '' : parseInt(val)});
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mã ID Nhân viên mượn</Form.Label>
              <Form.Control
                type="number"
                value={borrowForm.employee}
                placeholder="Nhập mã ID nhân viên (ví dụ: 1)"
                onChange={(e) => setBorrowForm({...borrowForm, employee: e.target.value})}
              />
              <Form.Text className="text-muted">
                Lưu ý: Nhập số ID của nhân viên từ hệ thống
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mục đích sử dụng</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                value={borrowForm.purpose}
                placeholder="Ví dụ: Sửa chữa lò hơi tầng 2"
                onChange={(e) => setBorrowForm({...borrowForm, purpose: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBorrowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleBorrow}>Xác nhận mượn</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ToolManagement;
