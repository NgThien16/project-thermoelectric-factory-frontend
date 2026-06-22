import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Row, Col, Form, Badge } from 'react-bootstrap';
import { FaPlus, FaTrash, FaPaperPlane} from 'react-icons/fa';
import toolService from '../../service/tool/toolService.js';
import { toast } from 'react-toastify';

const UserToolBorrowing = () => {
  const [tools, setTools] = useState([]);
  const [tempList, setTempList] = useState([]);
  const [generalInfo, setGeneralInfo] = useState({
    borrowDate: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const [formItem, setFormItem] = useState({
    toolId: '',
    quantity: 1
  });

  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {

    try {

      const response =
          await toolService.getAllTools(
              searchName,
              '',
              searchCode,
              0,
              999
          );

      setTools(
          response.data.content || []
      );

    } catch (error) {

      console.error(
          'Error fetching tools:',
          error
      );
    }
  };

  const handleSearchTools = (e) => {
    if (e) e.preventDefault();
    fetchTools();
  };

  const handleAddToTempList = () => {
    if (!formItem.toolId) {
      toast.error('Vui lòng chọn CCDC');
      return;
    }
    if (formItem.quantity <= 0) {
      toast.error('Số lượng phải lớn hơn 0');
      return;
    }

    const selectedTool = tools.find(t => String(t.id) === String(formItem.toolId));
    if (!selectedTool) return;

    // Kiểm tra xem đã có trong danh sách chưa
    const existingItem = tempList.find(item => item.toolId === formItem.toolId);
    if (existingItem) {
      setTempList(tempList.map(item => 
        item.toolId === formItem.toolId 
          ? { ...item, quantity: item.quantity + parseInt(formItem.quantity) }
          : item
      ));
    } else {
      setTempList([...tempList, {
        toolId: formItem.toolId,
        code: selectedTool.code,
        name: selectedTool.name,
        quantity: parseInt(formItem.quantity)
      }]);
    }

    // Reset form lẻ
    setFormItem({ toolId: '', quantity: 1 });
  };

  const handleRemoveItem = (index) => {
    const newList = [...tempList];
    newList.splice(index, 1);
    setTempList(newList);
  };

  const handleSubmitAll = async () => {
    if (tempList.length === 0) {
      toast.error('Danh sách mượn trống');
      return;
    }
    if (!generalInfo.reason) {
      toast.error('Vui lòng nhập lý do mượn');
      return;
    }

    try {
      // Biến đổi tempList thành List<ToolBorrowing> khớp với Backend yêu cầu
      const payload = tempList.map(item => ({
        tool: { id: parseInt(item.toolId) },
        note: generalInfo.reason,
        quantity: item.quantity,
        status: "WAITING",
        borrowDate: new Date().toISOString()
      }));

      await toolService.borrowToolsBatch(payload);
      toast.success('Gửi yêu cầu mượn thành công!');
      setTempList([]);
      setGeneralInfo({ ...generalInfo, reason: '' });
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi yêu cầu');
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h3 className="mb-4">Tạo yêu cầu mượn CCDC</h3>

      {/* Thông tin chung */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white fw-bold">Thông tin chung</Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Ngày mượn</Form.Label>
                <Form.Control type="date" value={generalInfo.borrowDate} onChange={e => setGeneralInfo({...generalInfo, borrowDate: e.target.value})} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Lý do mượn</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Nhập lý do..." 
                  value={generalInfo.reason}
                  onChange={e => setGeneralInfo({...generalInfo, reason: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Form thêm lẻ */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white fw-bold">Thêm CCDC vào danh sách</Card.Header>
        <Card.Body>
          <Row className="g-3 mb-3 border-bottom pb-3">
            <Col md={4}>
              <Form.Control 
                placeholder="Lọc theo mã CCDC..." 
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchTools()}
              />
            </Col>
            <Col md={4}>
              <Form.Control 
                placeholder="Lọc theo tên CCDC..." 
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchTools()}
              />
            </Col>
            <Col md={4}>
              <Button variant="outline-primary" onClick={handleSearchTools} className="w-100">
                Lọc danh sách CCDC
              </Button>
            </Col>
          </Row>
          
          <Row className="align-items-end">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Chọn CCDC (đã lọc)</Form.Label>
                <Form.Select
                    value={formItem.toolId}
                    onChange={e =>
                        setFormItem({
                          ...formItem,
                          toolId: e.target.value
                        })
                    }
                >
                  <option value="">
                    -- Chọn CCDC --
                  </option>
                  {tools
                      .filter(t => t.availableQuantity > 0)
                      .map(t => (
                          <option
                              key={t.id}
                              value={t.id}
                          >
                            [{t.code}] - {t.name}
                            {' '}
                            (Kho: {t.availableQuantity})
                          </option>
                      ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Số lượng mượn</Form.Label>
                <Form.Control 
                  type="number" 
                  min="1" 
                  value={formItem.quantity}
                  onChange={e => setFormItem({...formItem, quantity: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Button variant="primary" className="w-100" onClick={handleAddToTempList}>
                <FaPlus /> Thêm vào danh sách
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Bảng tạm */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white fw-bold d-flex justify-content-between align-items-center">
          Danh sách mượn tạm thời
          <Badge bg="info">{tempList.length} món</Badge>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>STT</th>
                <th>ID CCDC</th>
                <th>Tên CCDC</th>
                <th>Số lượng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {tempList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">Chưa có món nào được thêm</td>
                </tr>
              ) : (
                tempList.map((item, index) => (
                  <tr key={item.toolId}>
                    <td>{index + 1}</td>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <Button variant="outline-danger" size="sm" onClick={() => handleRemoveItem(index)}>
                        <FaTrash /> Xóa
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Nút gửi tổng */}
      <div className="d-flex justify-content-end">
        <Button variant="success" size="lg" className="px-5 d-flex align-items-center gap-2" onClick={handleSubmitAll}>
          <FaPaperPlane /> Gửi yêu cầu mượn
        </Button>
      </div>
    </div>
  );
};

export default UserToolBorrowing;
