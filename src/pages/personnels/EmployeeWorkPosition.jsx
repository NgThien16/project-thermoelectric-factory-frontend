import { useEffect, useState } from "react";
import { Card, Table, Button, Dropdown } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

import { EmployeeService } from "../../service/personnels_manager/EmployeeService.js";
import { WorkPositionService } from "../../service/personnels_manager/WorkPositionService.js";
import { EmployeeWorkPositionService } from "../../service/personnels_manager/EmployeeWorkPositionService.js";

export default function EmployeeWorkPositionPage() {
    const [employees, setEmployees] = useState([]);
    const [positions, setPositions] = useState([]);
    const [employeePositions, setEmployeePositions] = useState({});
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;

    const fetchAll = async () => {
        try {
            const res = await EmployeeService.searchEmployees(keyword, page, pageSize);
            setEmployees(res.content || []);
            setTotalPages(res.totalPages || 1);

            const posRes = await WorkPositionService.getAll();
            setPositions(posRes || []);

            const empPosMap = {};
            for (const emp of res.content) {
                const ep = await EmployeeWorkPositionService.getPositions(emp.id);
                empPosMap[emp.id] = Array.isArray(ep) ? ep.map(p => p.id) : [];
            }
            setEmployeePositions(empPosMap);
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi tải dữ liệu nhân viên!");
        }
    };

    useEffect(() => { fetchAll(); }, [keyword, page]);

    const handleAssignPosition = async (empId, posId) => {
        try {
            await EmployeeWorkPositionService.assignPosition(empId, posId);
            toast.success("Gán vị trí thành công!");
            fetchAll();
        } catch (err) {
            console.error(err);
            toast.error("Không thể gán vị trí!");
        }
    };

    const handleRemovePosition = async (empId, posId) => {
        try {
            await EmployeeWorkPositionService.removePosition(empId, posId);
            toast.success("Gỡ vị trí thành công!");
            fetchAll();
        } catch (err) {
            console.error(err);
            toast.error("Không thể gỡ vị trí!");
        }
    };

    return (
        <Card className="p-3">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Danh sách nhân viên & vị trí</h3>
                </div>

                <div className="d-flex mb-3">
                    <input
                        className="form-control me-2"
                        placeholder="Tìm kiếm nhân viên"
                        value={keyword}
                        onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
                    />
                    <Button variant="primary" onClick={fetchAll}><FaSearch /> Tìm kiếm</Button>
                </div>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ tên</th>
                        <th>Vị trí công việc</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.length === 0 ? (
                        <tr><td colSpan="5" className="text-center">Không có nhân viên nào</td></tr>
                    ) : employees.map((emp, idx) => (
                        <tr key={emp.id}>
                            <td>{page * pageSize + idx + 1}</td>
                            <td>{emp.fullName}</td>
                            <td>
                                <Dropdown>
                                    <Dropdown.Toggle variant="secondary" size="sm">Vị trí</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {positions.map(pos => {
                                            const hasPos = employeePositions[emp.id]?.includes(pos.id);
                                            return (
                                                <Dropdown.Item key={pos.id} className="d-flex justify-content-between align-items-center">
                                                    <span>{pos.name}</span>
                                                    {hasPos ? (
                                                        <Button size="sm" variant="warning" onClick={() => handleRemovePosition(emp.id, pos.id)}>
                                                            Gỡ
                                                        </Button>
                                                    ) : (
                                                        <Button size="sm" variant="success" onClick={() => handleAssignPosition(emp.id, pos.id)}>
                                                            Gán
                                                        </Button>
                                                    )}
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
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
    );
}