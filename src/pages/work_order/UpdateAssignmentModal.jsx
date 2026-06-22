import { useState } from "react";
import { useEffect } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { updateWorkOrderAssignments } from "../../service/work_order/WorkOrderService";
import { EmployeeService } from "../../service/personnels_manager/EmployeeService.js";
import { WORK_ORDER_ROLES } from "../../utils/workOrderRoles";

const UpdateAssignmentModal = ({ show, onHide, workOrderId, currentAssignments, onUpdated }) => {

    const [assignments, setAssignments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // Theo dõi lần render trước để biết modal vừa được mở (show: false -> true)
    const [prevShow, setPrevShow] = useState(false);

    // Reset form ngay trong lúc render khi modal vừa mở - KHÔNG dùng effect cho việc này
    if (show && !prevShow) {
        setPrevShow(true);
        setError("");
        setAssignments(
            (currentAssignments || []).map(a => ({
                employeeId: a.employeeId,
                role: a.role
            }))
        );
    } else if (!show && prevShow) {
        setPrevShow(false);
    }

    // Effect chỉ dùng cho việc fetch dữ liệu (side-effect thực sự, có gọi API)
    useEffect(() => {
        if (!show) return;

        let active = true;

        const loadEmployees = async () => {
            const res = await EmployeeService.getAll();
            if (active) {
                setEmployees(res.data || res || []);
            }
        };
        loadEmployees();
        return () => {
            active = false;
        };
    }, [show]);

    const addRow = () => {
        setAssignments([...assignments, { employeeId: "", role: "" }]);
    };

    const removeRow = (index) => {
        setAssignments(assignments.filter((_, i) => i !== index));
    };

    const updateRow = (index, field, value) => {
        const arr = [...assignments];
        arr[index][field] = value;
        setAssignments(arr);
    };

    const validate = () => {
        if (assignments.length === 0) {
            setError("Phải có ít nhất 1 nhân sự được phân công");
            return false;
        }
        const employeeIds = [];
        for (const item of assignments) {
            if (!item.employeeId || !item.role) {
                setError("Vui lòng chọn đầy đủ nhân viên và vai trò cho từng dòng");
                return false;
            }
            if (employeeIds.includes(item.employeeId)) {
                setError("Một nhân viên không thể được phân công 2 vai trò trong cùng 1 phiếu");
                return false;
            }
            employeeIds.push(item.employeeId);
        }
        setError("");
        return true;
    };

    const save = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            await updateWorkOrderAssignments(workOrderId, { assignments });
            toast.success("Cập nhật phân công thành công");
            onUpdated();
            onHide();
        } catch (e) {
            toast.error(e.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Điều chỉnh phân công nhân sự</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-muted small">
                    Chỉ điều chỉnh nhân sự được phân công cho phiếu công tác này.
                    Thông tin yêu cầu sửa chữa / thiết bị sẽ không thay đổi.
                </p>

                {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                {assignments.map((item, index) => (
                    <div key={index} className="d-flex gap-2 mb-2">
                        <Form.Select
                            value={item.employeeId}
                            onChange={(e) => updateRow(index, "employeeId", e.target.value)}
                        >
                            <option value="">Chọn nhân viên</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.fullName}
                                </option>
                            ))}
                        </Form.Select>

                        <Form.Select
                            value={item.role}
                            onChange={(e) => updateRow(index, "role", e.target.value)}
                        >
                            <option value="">Chọn vai trò</option>
                            {WORK_ORDER_ROLES.map(r => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </Form.Select>

                        <Button variant="outline-danger" onClick={() => removeRow(index)}>
                            ×
                        </Button>
                    </div>
                ))}

                <Button variant="secondary" onClick={addRow}>
                    Thêm nhân sự
                </Button>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="success" onClick={save} disabled={saving}>
                    {saving ? "Đang lưu..." : "Lưu phân công"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default UpdateAssignmentModal;