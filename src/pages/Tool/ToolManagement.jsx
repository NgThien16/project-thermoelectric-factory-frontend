import React, { useState, useEffect } from 'react';
import {Table, Button, Card, Row, Col, Form, Modal, Badge, Spinner} from 'react-bootstrap';
import {FaPlus, FaEdit, FaTrash, FaSearch} from 'react-icons/fa';
import toolService from '../../service/tool/toolService.js';
import { toast } from 'react-toastify';
const ToolManagement = () => {

  // =====================================================
  // STATE
  // =====================================================

  const [tools, setTools] = useState([]);

  // Dynamic tool types
  const [toolTypes, setToolTypes] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [pageSize] = useState(5);

  // Search
  const [searchName, setSearchName] = useState('');

  const [searchCode, setSearchCode] = useState('');

  const [searchType, setSearchType] = useState('');

  // Form
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

  // =====================================================
  // LOAD TOOLS
  // =====================================================

  const fetchTools = async () => {

    try {

      setLoading(true);

      const response =
        await toolService.getAllTools(
          searchName,
          searchType,
          searchCode,
          currentPage,
          pageSize
        );

      console.log(
        '[DEBUG_LOG] Pagination response:',
        response.data
      );

      setTools(response.data.content || []);

      setTotalPages(
        response.data.totalPages || 0
      );

    } catch (error) {

      console.error(error);

      toast.error(
        'Không thể tải danh sách CCDC'
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // LOAD TOOL TYPES
  // =====================================================

  const fetchToolTypes = async () => {

    try {

      const response =
        await toolService.getAllTools(
          '',
          '',
          '',
          0,
          999
        );

      const allTools =
        response.data.content || [];

      const uniqueTypes =
        [...new Set(
          allTools
            .map(tool => tool.type)
            .filter(type => type)
        )];

      setToolTypes(uniqueTypes);

    } catch (error) {

      console.error(
        'Lỗi load chủng loại:',
        error
      );
    }
  };

  // =====================================================
  // USE EFFECT
  // =====================================================

  useEffect(() => {

    fetchTools();

  }, [currentPage]);

  useEffect(() => {

    fetchToolTypes();

  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearchClick = () => {

    console.log(
      '[DEBUG_LOG] Searching tools:',
      {
        searchName,
        searchCode,
        searchType
      }
    );

    setCurrentPage(0);

    fetchTools();
  };

  // =====================================================
  // MODAL
  // =====================================================

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

  // =====================================================
  // SAVE TOOL
  // =====================================================

  const handleSaveTool = async () => {

    try {

      if (isEdit) {

        await toolService.updateTool(
          toolForm.id,
          toolForm
        );

        toast.success(
          'Cập nhật CCDC thành công'
        );

      } else {

        await toolService.createTool(
          toolForm
        );

        toast.success(
          'Thêm CCDC mới thành công'
        );

        // reload type
        fetchToolTypes();
      }

      setShowModal(false);

      fetchTools();

    } catch (error) {

      console.error(error);

      toast.error(
        'Có lỗi xảy ra khi lưu dữ liệu'
      );
    }
  };

  // =====================================================
  // DELETE TOOL
  // =====================================================

  const handleDeleteTool = async (id) => {

    const confirmDelete =
      window.confirm(
        'Bạn có chắc chắn muốn xóa CCDC này?'
      );

    if (!confirmDelete) return;

    try {

      await toolService.deleteTool(id);

      toast.success(
        'Đã xóa CCDC'
      );

      fetchTools();

      fetchToolTypes();

    } catch (error) {

      console.error(error);

      toast.error(
        'Lỗi khi xóa CCDC'
      );
    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="p-4">

      {/* HEADER */}

      <div
        className="
          d-flex
          justify-content-between
          align-items-center
          mb-4
        "
      >

        <h3>
          Quản lý Công cụ dụng cụ (CCDC)
        </h3>

        <Button
          variant="success"
          className="
            d-flex
            align-items-center
            gap-2
          "
          onClick={() =>
            handleShowModal()
          }
        >
          <FaPlus />
          Thêm CCDC mới
        </Button>

      </div>

      {/* SEARCH */}

      <Card className="border-0 shadow-sm mb-4">

        <Card.Body>

          <Row className="g-3">

            <Col md={4}>

              <Form.Control
                type="text"
                placeholder="Mã CCDC..."
                value={searchCode}
                onChange={(e) =>
                  setSearchCode(
                    e.target.value
                  )
                }
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  handleSearchClick()
                }
              />

            </Col>

            <Col md={4}>

              <Form.Control
                type="text"
                placeholder="Tên CCDC..."
                value={searchName}
                onChange={(e) =>
                  setSearchName(
                    e.target.value
                  )
                }
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  handleSearchClick()
                }
              />

            </Col>

            <Col md={2}>

              <Form.Select
                value={searchType}
                onChange={(e) =>
                  setSearchType(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Tất cả chủng loại
                </option>

                {toolTypes.map((type, index) => (

                  <option
                    key={index}
                    value={type}
                  >
                    {type}
                  </option>

                ))}

              </Form.Select>

            </Col>

            <Col md={2}>

              <Button
                variant="primary"
                className="w-100"
                onClick={
                  handleSearchClick
                }
              >

                <FaSearch />
                {' '}
                Tìm

              </Button>

            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* TABLE */}

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

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center"
                  >

                    <Spinner
                      animation="border"
                    />

                  </td>

                </tr>

              ) : tools.length > 0 ? (

                tools.map((tool) => (

                  <tr key={tool.id}>

                    <td>
                      {tool.code}
                    </td>

                    <td>
                      {tool.name}
                    </td>

                    <td>
                      {tool.type}
                    </td>

                    <td>

                      {tool.totalQuantity}

                      {' / '}

                      <Badge
                        bg={
                          tool.availableQuantity > 0
                            ? 'success'
                            : 'danger'
                        }
                      >

                        {tool.availableQuantity}

                      </Badge>

                    </td>

                    <td>
                      {tool.location}
                    </td>

                    <td>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          handleShowModal(tool)
                        }
                      >

                        <FaEdit />

                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          handleDeleteTool(tool.id)
                        }
                      >

                        <FaTrash />

                      </Button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="
                      text-center
                      text-muted
                    "
                  >

                    Chưa có dữ liệu công cụ dụng cụ

                  </td>

                </tr>

              )}

            </tbody>

          </Table>

          {/* PAGINATION */}

          <div
            className="
              d-flex
              justify-content-between
              align-items-center
              mt-3
            "
          >

            <div>

              Trang {currentPage + 1}
              {' / '}
              {totalPages || 1}

            </div>

            <div className="d-flex gap-2">

              <Button
                variant="outline-primary"
                disabled={currentPage === 0}
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >

                Prev

              </Button>

              <Button
                variant="outline-primary"
                disabled={
                  currentPage + 1 >= totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
              >

                Next

              </Button>

            </div>

          </div>

        </Card.Body>

      </Card>

      {/* MODAL */}

      <Modal
        show={showModal}
        onHide={() =>
          setShowModal(false)
        }
        size="lg"
      >

        <Modal.Header closeButton>

          <Modal.Title>

            {isEdit
              ? 'Chỉnh sửa CCDC'
              : 'Thêm CCDC mới'}

          </Modal.Title>

        </Modal.Header>

        <Modal.Body>

          <Form>

            <Row>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Mã CCDC
                  </Form.Label>

                  <Form.Control
                    type="text"
                    value={toolForm.code}
                    onChange={(e) =>
                      setToolForm({
                        ...toolForm,
                        code:
                          e.target.value
                      })
                    }
                  />

                </Form.Group>

              </Col>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Tên CCDC
                  </Form.Label>

                  <Form.Control
                    type="text"
                    value={toolForm.name}
                    onChange={(e) =>
                      setToolForm({
                        ...toolForm,
                        name:
                          e.target.value
                      })
                    }
                  />

                </Form.Group>

              </Col>

            </Row>

            <Row>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Chủng loại
                  </Form.Label>

                  <Form.Control
                    type="text"
                    value={toolForm.type}
                    onChange={(e) =>
                      setToolForm({
                        ...toolForm,
                        type:
                          e.target.value
                      })
                    }
                  />

                </Form.Group>

              </Col>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Vị trí để
                  </Form.Label>

                  <Form.Control
                    type="text"
                    value={toolForm.location}
                    onChange={(e) =>
                      setToolForm({
                        ...toolForm,
                        location:
                          e.target.value
                      })
                    }
                  />

                </Form.Group>

              </Col>

            </Row>

            <Row>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Tổng số lượng
                  </Form.Label>

                  <Form.Control
                    type="number"
                    value={
                      toolForm.totalQuantity
                    }
                    onChange={(e) =>
                      setToolForm({
                        ...toolForm,
                        totalQuantity:
                          parseInt(
                            e.target.value
                          ) || 0
                      })
                    }
                  />

                </Form.Group>

              </Col>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Số lượng sẵn có
                  </Form.Label>

                  <Form.Control
                    type="number"
                    value={
                      toolForm.availableQuantity
                    }
                    onChange={(e) =>
                      setToolForm({
                        ...toolForm,
                        availableQuantity:
                          parseInt(
                            e.target.value
                          ) || 0
                      })
                    }
                  />

                </Form.Group>

              </Col>

            </Row>

            <Form.Group className="mb-3">

              <Form.Label>
                Mô tả
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={3}
                value={
                  toolForm.description
                }
                onChange={(e) =>
                  setToolForm({
                    ...toolForm,
                    description:
                      e.target.value
                  })
                }
              />

            </Form.Group>

          </Form>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() =>
              setShowModal(false)
            }
          >

            Hủy

          </Button>

          <Button
            variant="primary"
            onClick={
              handleSaveTool
            }
          >

            Lưu thông tin

          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
};

export default ToolManagement;

