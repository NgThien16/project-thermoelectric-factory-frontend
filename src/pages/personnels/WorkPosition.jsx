import { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

import { WorkPositionService } from "../../service/personnels_manager/WorkPositionService.js";

export default function WorkPositionPage() {
    const [positions, setPositions] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(5);

    const [editData, setEditData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [positionName, setPositionName] = useState("");

    const fetchAll = async () => {
        try {
            const res = await WorkPositionService.searchPositions(keyword, page, pageSize);
            setPositions(res.content || []);
            setTotalPages(res.totalPages || 1);
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi tải dữ liệu vị trí!");
        }
    };

    useEffect(() => { fetchAll(); }, [keyword, page]);

    const handleSave = async () => {
        try {
            if (editData) await WorkPositionService.update(editData.id, { name: positionName });
            else await WorkPositionService.create({ name: positionName });

            toast.success(editData ? "Cập nhật thành công!" : "Tạo vị trí thành công!");
            setShowModal(false);
            setEditData(null);
            setPositionName("");
            setPage(totalPages - 1);
            fetchAll();
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi lưu vị trí!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await WorkPositionService.delete(id);
            toast.success("Xóa vị trí thành công!");
            fetchAll();
        } catch (err) {
            console.error(err);
            toast.error("Không thể xóa vị trí!");
        }
    };

    return (
        <Card className="p-3">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Danh sách Work Positions</h3>
                    <FaPlus style={{ cursor: "pointer" }} onClick={() => { setEditData(null); setPositionName(""); setShowModal(true); }} />
                </div>

                <div className="d-flex mb-3">
                    <input
                        className="form-control me-2"
                        placeholder="Tìm kiếm vị trí"
                        value={keyword}
                        onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
                    />
                    <Button variant="primary" onClick={fetchAll}><FaSearch /> Tìm kiếm</Button>
                </div>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên vị trí</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {positions.length === 0 ? (
                        <tr><td colSpan="3" className="text-center">Không có vị trí nào</td></tr>
                    ) : positions.map((pos, idx) => (
                        <tr key={pos.id}>
                            <td>{page * pageSize + idx + 1}</td>
                            <td>{pos.name}</td>
                            <td>
                                <FaEdit style={{ cursor: "pointer", marginRight: "8px" }} onClick={() => { setEditData(pos); setPositionName(pos.name); setShowModal(true); }} />
                                <FaTrash style={{ cursor: "pointer" }} onClick={() => handleDelete(pos.id)} />
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

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editData ? "Cập nhật vị trí" : "Tạo vị trí mới"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control
                            type="text"
                            placeholder="Tên vị trí"
                            value={positionName}
                            onChange={(e) => setPositionName(e.target.value)}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button variant="primary" onClick={handleSave}>{editData ? "Cập nhật" : "Tạo mới"}</Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>
    );
}