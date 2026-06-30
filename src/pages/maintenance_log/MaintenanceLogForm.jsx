import { useEffect, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { MaintenanceLogService } from "../../service/maintenance_log/maintenanceLogService";

export default function MaintenanceLogForm({ show, onHide, onSuccess }) {

    const [workOrders, setWorkOrders] = useState([]);
    const [workOrderId, setWorkOrderId] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const [prevShow, setPrevShow] = useState(false);

    // Reset form ngay khi modal vừa mở (tránh setState trong effect)
    if (show && !prevShow) {
        setPrevShow(true);
        setWorkOrderId("");
        setDescription("");
        setError("");
    } else if (!show && prevShow) {
        setPrevShow(false);
    }

    useEffect(() => {
        if (!show) return;

        let active = true;

        const loadWorkOrders = async () => {
            try {
                const res = await MaintenanceLogService.getWorkOrders();
                if (active) {
                    setWorkOrders(res.data.content || res.data || []);
                }
            } catch (e) {
                console.log(e);
            }
        };

        loadWorkOrders();

        return () => {
            active = false;
        };
    }, [show]);

    const validate = () => {
        if (!workOrderId) {
            setError("Vui lòng chọn phiếu công tác");
            return false;
        }
        if (!description.trim()) {
            setError("Vui lòng nhập mô tả");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            await MaintenanceLogService.create({
                workOrderId,
                description
            });
            toast.success("Tạo lịch sử bảo trì thành công");
            onSuccess();
        } catch (e) {
            toast.error(e.response?.data?.message || "Tạo thất bại");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Tạo lịch sử bảo trì</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                <Form.Group className="mb-3">
                    <Form.Label>Phiếu công tác</Form.Label>
                    <Form.Select
                        value={workOrderId}
                        onChange={(e) => setWorkOrderId(e.target.value)}
                    >
                        <option value="">-- Chọn phiếu CT --</option>
                        {workOrders.map(wo => (
                            <option key={wo.id} value={wo.id}>
                                {wo.code}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Nhập mô tả bảo trì..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="success" onClick={handleSubmit} disabled={saving}>
                    {saving ? "Đang lưu..." : "Lưu"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}