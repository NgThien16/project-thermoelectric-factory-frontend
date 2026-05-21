import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Card, Table, Modal } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

import { EmployeeService } from "../../service/personnels_manager/EmployeeService.js";
import { DepartmentService } from "../../service/personnels_manager/DepartmentService.js";
import { PositionService } from "../../service/personnels_manager/PositionService.js";

export default function EmployeePage() {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);

    const [inputValue, setInputValue] = useState("");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [editData, setEditData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const fetchAll = async () => {
        try {
            const res = await EmployeeService.searchEmployees(keyword, page,3);
            setEmployees(res.content || []);
            setTotalPages(res.totalPages);

            const depRes = await DepartmentService.getAll();
            setDepartments(depRes.data || []);

            const posRes = await PositionService.getAll();
            setPositions(posRes.data || []);
        } catch {
            toast.error("Lỗi khi tải dữ liệu nhân viên!");
        }
    };

    useEffect(() => { fetchAll(); }, [keyword, page]);

    const handleSubmit = async (values, { resetForm }) => {
        try {
            if (editData) await EmployeeService.update(editData.id, values);
            else await EmployeeService.create(values);

            toast.success(editData ? "Cập nhật nhân viên thành công!" : "Tạo nhân viên thành công!");
            resetForm();
            setEditData(null);
            fetchAll();
        } catch {
            toast.error("Lỗi khi lưu nhân viên!");
        }
    };

    const handleDelete = async () => {
        if (!selectedEmployee) return;
        try {
            await EmployeeService.delete(selectedEmployee.id);
            toast.success("Xóa nhân viên thành công!");
            setShowModal(false);
            setSelectedEmployee(null);
            fetchAll();
        } catch {
            toast.error("Không thể xóa nhân viên do dữ liệu liên quan");
        }
    };

    // const selectedPosition = employees.positionId.find((p)=>(
    //     p.id === selectedEmployee.positionId
    // ));
    // // const selectedDepartment = selectedEmployee.departmentId.id;
    return (
        <div className="p-4">
            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3>Danh sách nhân viên</h3>
                        <FaPlus style={{ cursor: "pointer" }} onClick={() => setEditData(null)} />
                    </div>

                    <Formik
                        initialValues={editData || { fullName: "", departmentId: "", positionId: "" }}
                        enableReinitialize={true}
                        onSubmit={handleSubmit}
                    >
                        <Form className="d-flex mb-3">
                            <Field name="fullName" placeholder="Họ tên" className="form-control me-2" />
                            <Field as="select" name="departmentId" className="form-control me-2">
                                <option value="">Chọn phòng ban</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </Field>
                            <Field as="select" name="positionId" className="form-control me-2">
                                <option value="">Chọn chức vụ</option>
                                {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </Field>
                            <Button type="submit">{editData ? "Cập nhật" : "Tạo mới"}</Button>
                        </Form>
                    </Formik>

                    {/* Search + Reset */}
                    <div className="d-flex mb-3">
                        <input
                            className="form-control me-2"
                            placeholder="Tìm kiếm nhân viên"
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

                    {/* Table */}
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ tên</th>
                            <th>Phòng ban</th>
                            <th>Chức vụ</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employees.map((emp,i) => (
                            <tr key={emp.id}>
                                <td>{i+1}</td>
                                <td>{emp.fullName}</td>
                                <td>{emp.department?.name}</td>
                                <td>{emp.position?.name}</td>
                                <td>
                                    <FaEdit style={{ cursor: "pointer", marginRight: "8px" }} onClick={() => setEditData(emp)} />
                                    <FaTrash style={{ cursor: "pointer" }} onClick={() => { setSelectedEmployee(emp); setShowModal(true); }} />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <Button disabled={page === 0} onClick={() => setPage(prev => Math.max(prev - 1, 0))}>Trước</Button>
                        <span>Trang {page + 1} / {totalPages}</span>
                        <Button disabled={page + 1 >= totalPages} onClick={() => setPage(prev => prev + 1)}>Sau</Button>
                    </div>

                </Card.Body>
            </Card>

            {/* Modal confirm delete */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton><Modal.Title>Xác nhận xóa</Modal.Title></Modal.Header>
                <Modal.Body>Bạn có chắc muốn xóa nhân viên "{selectedEmployee?.fullName}" không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}