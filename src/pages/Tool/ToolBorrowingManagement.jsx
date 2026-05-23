import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaSearch, FaCheck, FaEye } from 'react-icons/fa';
import toolService from '../../service/tool/toolService.js';
import { toast } from 'react-toastify';

const ToolBorrowingManagement = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    toolId: '',
    user: '',
    status: ''
  });

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async (customFilters = null) => {
    try {
      setLoading(true);
      const response = await toolService.getAllBorrowings(customFilters || filters);
      console.log('[DEBUG_LOG] Borrowings response data:', response.data);
      setBorrowings(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Không thể tải danh sách mượn đồ');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    console.log('[DEBUG_LOG] Searching borrowings with filters:', filters);
    fetchBorrowings();
  };

  const openDetail = (ticket) => {
    setSelectedTicket(ticket);
    // Giả sử ticket có trường items chứa danh sách các món đồ mượn bên trong
    // Nếu backend chưa hỗ trợ, chúng ta giả định ticket chính là 1 dòng đơn lẻ nhưng hiển thị chi tiết
    setSelectedItems([]); 
    setShowDetailModal(true);
  };

  const handleToggleItem = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTicket) {
      const items = selectedTicket.items || [selectedTicket];
      if (selectedItems.length === items.length) {
        setSelectedItems([]);
      } else {
        setSelectedItems(items.map(item => item.id));
      }
    }
  };

  const handleConfirmReturn = async () => {
    if (selectedItems.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một món để trả');
      return;
    }

    try {
      console.log('[DEBUG_LOG] Confirming returns for IDs:', selectedItems);
      await toolService.confirmReturns(selectedItems);
      toast.success('Xác nhận trả đồ thành công');
      setShowDetailModal(false);
      fetchBorrowings();
    } catch (error) {
      toast.error('Lỗi khi thực hiện trả đồ');
      console.error('[DEBUG_LOG] Error in handleConfirmReturn:', error);
    }
  };

  const handleApproveBorrow = async () => {
    if (selectedItems.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một món để duyệt');
      return;
    }

    try {
      setLoading(true);
      console.log('[DEBUG_LOG] Approving borrowings for IDs:', selectedItems);
      
      const promises = selectedItems.map(id => toolService.confirmBorrowing(id));
      await Promise.all(promises);
      
      toast.success('Duyệt cho mượn thành công');
      setShowDetailModal(false);
      setSelectedItems([]);
      fetchBorrowings();
    } catch (error) {
      console.error('[DEBUG_LOG] Error in handleApproveBorrow:', error);
      
      // Fallback: Nếu endpoint confirm riêng biệt bị lỗi, thử dùng update chung
      try {
        console.log('[DEBUG_LOG] Falling back to updateBorrowing...');
        const fallbackPromises = selectedItems.map(id => 
          toolService.updateBorrowing(id, { status: 'BORROWED' })
        );
        await Promise.all(fallbackPromises);
        toast.success('Duyệt cho mượn thành công');
        setShowDetailModal(false);
        setSelectedItems([]);
        fetchBorrowings();
      } catch (fallbackError) {
        toast.error('Lỗi khi duyệt cho mượn');
        console.error('[DEBUG_LOG] Fallback error:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Chờ duyệt':
      case 'WAITING': 
        return <Badge bg="secondary">Chờ duyệt</Badge>;
      case 'Đang mượn':
      case 'BORROWED': 
        return <Badge bg="warning" text="dark">Đang mượn</Badge>;
      case 'Đã trả':
      case 'RETURNED': 
        return <Badge bg="success">Đã trả</Badge>;
      default: return <Badge bg="info">{status}</Badge>;
    }
  };

  return (
    <div className="p-4">
      <h3 className="mb-4">Quản lý & Xử lý Trả đồ (Thủ kho)</h3>

      {/* Phần 1: Bộ lọc tìm kiếm */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label>Tìm theo CCDC (Mã/Tên)</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Nhập mã hoặc tên..."
                  value={filters.toolId}
                  onChange={(e) => setFilters({...filters, toolId: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Tìm theo Người mượn (Tên/ID)</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Nhập tên hoặc mã NV..."
                  value={filters.user}
                  onChange={(e) => setFilters({...filters, user: e.target.value})}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Tìm theo Trạng thái</Form.Label>
                <Form.Select 
                  value={filters.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    const updatedFilters = {...filters, status: newStatus};
                    setFilters(updatedFilters);
                    fetchBorrowings(updatedFilters);
                  }}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="WAITING">Chờ duyệt</option>
                  <option value="BORROWED">Đang mượn</option>
                  <option value="RETURNED">Đã trả</option>
                </Form.Select>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button variant="primary" type="submit" className="w-100 d-flex align-items-center justify-content-center gap-2">
                  <FaSearch /> Tìm kiếm
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Phần 2: Bảng danh sách phiếu mượn */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Mã phiếu</th>
                <th>Người mượn</th>
                <th>Ngày mượn</th>
                <th>Tên CCDC</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center">Đang tải dữ liệu...</td></tr>
              ) : borrowings.length === 0 ? (
                <tr><td colSpan="6" className="text-center">Không tìm thấy phiếu mượn nào</td></tr>
              ) : (
                borrowings.map((b) => (
                  <tr key={b.id}>
                    <td>TICKET-{b.id}</td>
                    <td>{b.employee?.fullName || b.employee?.name || 'N/A'} (ID: {b.employee?.id || '?'})</td>
                    <td>{b.borrowDate ? new Date(b.borrowDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                    <td>{b.tool?.name || 'N/A'}</td>
                    <td>{getStatusBadge(b.status)}</td>
                    <td>
                      <Button variant="outline-info" size="sm" onClick={() => openDetail(b)}>
                        <FaEye /> Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Chi tiết & Xử lý trả đồ */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết phiếu mượn: TICKET-{selectedTicket?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTicket && (
            <>
              <div className="mb-4">
                <p><strong>Người mượn:</strong> {selectedTicket.employee?.fullName || selectedTicket.employee?.name} (ID: {selectedTicket.employee?.id})</p>
                <p><strong>Lý do:</strong> {selectedTicket.note || 'Không có'}</p>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Danh sách món đồ</h5>
                {(['Đang mượn', 'BORROWED', 'Chờ duyệt', 'WAITING'].includes(selectedTicket.status)) && (
                  <Button variant="outline-secondary" size="sm" onClick={handleSelectAll}>
                    {(selectedTicket.items || [{...selectedTicket}]).length === selectedItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </Button>
                )}
              </div>

              <Table bordered hover>
                <thead className="table-light">
                  <tr>
                    {(['Đang mượn', 'BORROWED', 'Chờ duyệt', 'WAITING'].includes(selectedTicket.status)) && <th><Form.Check readOnly checked={selectedItems.length > 0 && selectedItems.length === (selectedTicket.items || [{...selectedTicket}]).length} /></th>}
                    <th>CCDC</th>
                    <th>Số lượng</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mocking items if not present for demonstration */}
                  {(selectedTicket.items || [{...selectedTicket}]).map((item) => (
                    <tr key={item.id}>
                      {(['Đang mượn', 'BORROWED', 'Chờ duyệt', 'WAITING'].includes(selectedTicket.status)) && (
                        <td>
                          <Form.Check 
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleToggleItem(item.id)}
                            disabled={item.status === 'Đã trả' || item.status === 'RETURNED'}
                          />
                        </td>
                      )}
                      <td>[{item.tool?.code || 'N/A'}] - {item.tool?.name || 'N/A'}</td>
                      <td>{item.quantity}</td>
                      <td>{getStatusBadge(item.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Đóng</Button>
          {['Chờ duyệt', 'WAITING'].includes(selectedTicket?.status) && (
            <Button variant="primary" onClick={handleApproveBorrow}>
              <FaCheck /> Duyệt cho mượn
            </Button>
          )}
          {['Đang mượn', 'BORROWED'].includes(selectedTicket?.status) && (
            <Button variant="success" onClick={handleConfirmReturn}>
              <FaCheck /> Xác nhận trả đồ
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ToolBorrowingManagement;
