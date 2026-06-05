import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Card, Table, Modal } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { PositionService } from "../../service/personnels_manager/PositionService.js";

export default function PositionPage() {
    const [positions, setPositions] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [editData, setEditData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const pageSize = 5;

    const fetchPositions = async () => {
        try {
            const res = await PositionService.searchPositions(keyword, page,5);
            setPositions(res.content || []);
            setTotalPages(res.totalPages);
        } catch {
            toast.error("Lỗi khi tải dữ liệu chức vụ!");
        }
    };

    useEffect(() => {
        fetchPositions();
    }, [keyword, page]);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            if (editData) await PositionService.update(editData.id, values);
            else await PositionService.create(values);

            toast.success(editData ? "Cập nhật chức vụ thành công!" : "Tạo mới chức vụ thành công!");
            resetForm();
            setEditData(null);
            fetchPositions();
        } catch {
            toast.error("Lỗi khi lưu chức vụ!");
        }
    };

    const handleDelete = async () => {
        if (!selectedPosition) return;
        try {
            await PositionService.delete(selectedPosition.id);
            toast.success("Xóa chức vụ thành công!");
            setShowModal(false);
            setSelectedPosition(null);
            fetchPositions();
        } catch {
            toast.error("Không thể xóa chức vụ vì đang có nhân viên sử dụng");
        }
    };

    return (
        <div className="p-4">
            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3>Danh sách chức vụ</h3>
                        <FaPlus style={{ cursor: "pointer" }} onClick={() => setEditData(null)} />
                    </div>

                    <Formik enableReinitialize initialValues={editData || { name: "" }} onSubmit={handleSubmit}>
                        <Form className="d-flex mb-3">
                            <Field name="name" placeholder="Tên chức vụ" className="form-control me-2" />
                            <Button type="submit">{editData ? "Cập nhật" : "Tạo mới"}</Button>
                        </Form>
                    </Formik>

                    <div className="d-flex mb-3">
                        <input
                            className="form-control me-2"
                            placeholder="Tìm kiếm chức vụ"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button variant="primary" className="me-2" onClick={() => setKeyword(inputValue)}>
                            <FaSearch /> Tìm kiếm
                        </Button>
                        <Button variant="secondary" onClick={() => { setInputValue(""); setKeyword(""); setPage(0); }}>
                            Quay lại
                        </Button>
                    </div>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {positions.map((pos,i) => (
                            <tr key={pos.id}>
                                <td>{page * pageSize + i+1}</td>
                                <td>{pos.name}</td>
                                <td>
                                    <FaEdit style={{ cursor: "pointer", marginRight: "8px" }} onClick={() => setEditData(pos)} />
                                    <FaTrash style={{ cursor: "pointer" }} onClick={() => { setSelectedPosition(pos); setShowModal(true); }} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <Button disabled={page === 0} onClick={() => setPage(prev => Math.max(prev - 1, 0))}>Trước</Button>
                        <span>Trang {page + 1} / {totalPages}</span>
                        <Button disabled={page + 1 >= totalPages} onClick={() => setPage(prev => prev + 1)}>Sau</Button>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>Xác nhận xóa</Modal.Title></Modal.Header>
                <Modal.Body>Bạn có chắc muốn xóa chức vụ "{selectedPosition?.name}" không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}