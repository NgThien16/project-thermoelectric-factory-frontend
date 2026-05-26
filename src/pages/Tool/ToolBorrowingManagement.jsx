import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Badge,
  Modal,
  Form,
  Row,
  Col,
  Pagination
} from 'react-bootstrap';

import {
  FaSearch,
  FaCheck,
  FaEye
} from 'react-icons/fa';

import toolService from '../../service/tool/toolService.js';
import { toast } from 'react-toastify';

const ToolBorrowingManagement = () => {

  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    toolId: '',
    user: '',
    status: ''
  });

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ================= FETCH =================

  const fetchBorrowings = async (
      page = currentPage,
      customFilters = filters
  ) => {

    try {

      setLoading(true);

      const response =
          await toolService.getAllBorrowings({

            ...customFilters,

            page: page,

            size: 5
          });

      console.log(
          '[DEBUG_LOG] Borrowings response data:',
          response.data
      );

      setBorrowings(
          response.data.content || []
      );

      setTotalPages(
          response.data.totalPages || 0
      );

    } catch (error) {

      toast.error(
          'Không thể tải danh sách mượn đồ'
      );

      console.error(error);

    } finally {

      setLoading(false);
    }
  };

  // ================= USE EFFECT =================

  useEffect(() => {

    fetchBorrowings(currentPage, filters);

  }, [currentPage]);

  // ================= SEARCH =================

  const handleSearch = (e) => {

    if (e) e.preventDefault();

    setCurrentPage(0);

    fetchBorrowings(0, filters);
  };

  // ================= DETAIL =================

  const openDetail = (ticket) => {

    setSelectedTicket(ticket);

    setSelectedItems([ticket.id]);

    setShowDetailModal(true);
  };

  // ================= RETURN =================

  const handleConfirmReturn = async () => {

    if (selectedItems.length === 0) {

      toast.warning(
          'Vui lòng chọn ít nhất một món để trả'
      );

      return;
    }

    try {

      await toolService.confirmReturns(
          selectedItems
      );

      toast.success(
          'Xác nhận trả đồ thành công'
      );

      setShowDetailModal(false);

      fetchBorrowings();

    } catch (error) {

      toast.error(
          'Lỗi khi thực hiện trả đồ'
      );

      console.error(error);
    }
  };

  // ================= APPROVE =================

  const handleApproveBorrow = async () => {

    if (selectedItems.length === 0) {

      toast.warning(
          'Vui lòng chọn ít nhất một món để duyệt'
      );

      return;
    }

    try {

      setLoading(true);

      const promises =
          selectedItems.map(id =>
              toolService.confirmBorrowing(id)
          );

      await Promise.all(promises);

      toast.success(
          'Duyệt cho mượn thành công'
      );

      setShowDetailModal(false);

      setSelectedItems([]);

      fetchBorrowings();

    } catch (error) {

      console.error(error);

      try {

        const fallbackPromises =
            selectedItems.map(id =>

                toolService.updateBorrowing(
                    id,
                    {
                      status: 'BORROWED'
                    }
                )
            );

        await Promise.all(fallbackPromises);

        toast.success(
            'Duyệt cho mượn thành công'
        );

        setShowDetailModal(false);

        setSelectedItems([]);

        fetchBorrowings();

      } catch (fallbackError) {

        toast.error(
            'Lỗi khi duyệt cho mượn'
        );

        console.error(fallbackError);
      }

    } finally {

      setLoading(false);
    }
  };

  // ================= STATUS =================

  const getStatusBadge = (status) => {

    switch (status) {

      case 'WAITING':
        return (
            <Badge bg="secondary">
              Chờ duyệt
            </Badge>
        );

      case 'BORROWED':
        return (
            <Badge bg="warning" text="dark">
              Đang mượn
            </Badge>
        );

      case 'RETURNED':
        return (
            <Badge bg="success">
              Đã trả
            </Badge>
        );

      default:
        return (
            <Badge bg="info">
              {status}
            </Badge>
        );
    }
  };

  return (

      <div className="p-4">

        <h3 className="mb-4">
          Quản lý & Xử lý Trả đồ (Thủ kho)
        </h3>

        {/* SEARCH */}

        <Card className="border-0 shadow-sm mb-4">

          <Card.Body>

            <Form onSubmit={handleSearch}>

              <Row className="g-3">

                <Col md={3}>

                  <Form.Label>
                    Tìm theo CCDC
                  </Form.Label>

                  <Form.Control
                      type="text"
                      placeholder="Mã hoặc tên..."
                      value={filters.toolId}
                      onChange={(e) =>
                          setFilters({
                            ...filters,
                            toolId: e.target.value
                          })
                      }
                  />
                </Col>

                <Col md={3}>

                  <Form.Label>
                    Tìm người mượn
                  </Form.Label>

                  <Form.Control
                      type="text"
                      placeholder="Tên hoặc ID..."
                      value={filters.user}
                      onChange={(e) =>
                          setFilters({
                            ...filters,
                            user: e.target.value
                          })
                      }
                  />
                </Col>

                <Col md={3}>

                  <Form.Label>
                    Trạng thái
                  </Form.Label>

                  <Form.Select
                      value={filters.status}
                      onChange={(e) => {

                        const updatedFilters = {
                          ...filters,
                          status: e.target.value
                        };

                        setFilters(updatedFilters);

                        setCurrentPage(0);

                        fetchBorrowings(
                            0,
                            updatedFilters
                        );
                      }}
                  >

                    <option value="">
                      Tất cả trạng thái
                    </option>

                    <option value="WAITING">
                      Chờ duyệt
                    </option>

                    <option value="BORROWED">
                      Đang mượn
                    </option>

                    <option value="RETURNED">
                      Đã trả
                    </option>

                  </Form.Select>
                </Col>

                <Col
                    md={3}
                    className="d-flex align-items-end"
                >

                  <Button
                      variant="primary"
                      type="submit"
                      className="w-100 d-flex align-items-center justify-content-center gap-2"
                  >

                    <FaSearch />

                    Tìm kiếm

                  </Button>

                </Col>

              </Row>

            </Form>

          </Card.Body>

        </Card>

        {/* TABLE */}

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

                  <tr>
                    <td colSpan="6" className="text-center">
                      Đang tải dữ liệu...
                    </td>
                  </tr>

              ) : borrowings.length === 0 ? (

                  <tr>
                    <td colSpan="6" className="text-center">
                      Không có dữ liệu
                    </td>
                  </tr>

              ) : (

                  borrowings.map((b) => (

                      <tr key={b.id}>

                        <td>
                          TICKET-{b.id}
                        </td>

                        <td>
                          {b.employee?.fullName ||
                              b.employee?.name ||
                              'N/A'}
                          {' '}
                          (ID:
                          {' '}
                          {b.employee?.id || '?'})
                        </td>

                        <td>
                          {b.borrowDate
                              ? new Date(
                                  b.borrowDate
                              ).toLocaleDateString('vi-VN')
                              : 'N/A'}
                        </td>

                        <td>
                          {b.tool?.name || 'N/A'}
                        </td>

                        <td>
                          {getStatusBadge(b.status)}
                        </td>

                        <td>

                          <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() =>
                                  openDetail(b)
                              }
                          >

                            <FaEye />

                            {' '}
                            Chi tiết

                          </Button>

                        </td>

                      </tr>
                  ))
              )}

              </tbody>

            </Table>

            {/* PAGINATION */}

            <div className="d-flex justify-content-center mt-3">

              <Pagination>

                <Pagination.Prev
                    disabled={currentPage === 0}
                    onClick={() => {

                      const prev =
                          currentPage - 1;

                      setCurrentPage(prev);

                      fetchBorrowings(
                          prev,
                          filters
                      );
                    }}
                />

                {[...Array(totalPages).keys()].map(
                    (page) => (

                        <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => {

                              setCurrentPage(page);

                              fetchBorrowings(
                                  page,
                                  filters
                              );
                            }}
                        >

                          {page + 1}

                        </Pagination.Item>
                    )
                )}

                <Pagination.Next
                    disabled={
                        currentPage ===
                        totalPages - 1
                    }
                    onClick={() => {

                      const next =
                          currentPage + 1;

                      setCurrentPage(next);

                      fetchBorrowings(
                          next,
                          filters
                      );
                    }}
                />

              </Pagination>

            </div>

          </Card.Body>

        </Card>

        {/* DETAIL MODAL */}

        <Modal
            show={showDetailModal}
            onHide={() =>
                setShowDetailModal(false)
            }
            size="lg"
        >

          <Modal.Header closeButton>

            <Modal.Title>
              Chi tiết phiếu mượn
            </Modal.Title>

          </Modal.Header>

          <Modal.Body>

            {selectedTicket && (

                <>
                  <p>
                    <strong>Người mượn:</strong>
                    {' '}
                    {selectedTicket.employee?.fullName}
                  </p>

                  <p>
                    <strong>Lý do:</strong>
                    {' '}
                    {selectedTicket.note}
                  </p>

                  <Table bordered>

                    <thead>

                    <tr>
                      <th>CCDC</th>
                      <th>Số lượng</th>
                      <th>Trạng thái</th>
                    </tr>

                    </thead>

                    <tbody>

                    {(selectedTicket.items ||
                        [selectedTicket]).map(item => (

                        <tr key={item.id}>

                          <td>
                            [{item.tool?.code}]
                            {' '}
                            {item.tool?.name}
                          </td>

                          <td>
                            {item.quantity}
                          </td>

                          <td>
                            {getStatusBadge(item.status)}
                          </td>

                        </tr>
                    ))}

                    </tbody>

                  </Table>
                </>
            )}

          </Modal.Body>

          <Modal.Footer>

            <Button
                variant="secondary"
                onClick={() =>
                    setShowDetailModal(false)
                }
            >
              Đóng
            </Button>

            {selectedTicket?.status ===
                'WAITING' && (

                    <Button
                        variant="primary"
                        onClick={handleApproveBorrow}
                    >

                      <FaCheck />

                      {' '}
                      Duyệt cho mượn

                    </Button>
                )}

            {selectedTicket?.status ===
                'BORROWED' && (

                    <Button
                        variant="success"
                        onClick={handleConfirmReturn}
                    >

                      <FaCheck />

                      {' '}
                      Xác nhận trả

                    </Button>
                )}

          </Modal.Footer>

        </Modal>

      </div>
  );
};

export default ToolBorrowingManagement;