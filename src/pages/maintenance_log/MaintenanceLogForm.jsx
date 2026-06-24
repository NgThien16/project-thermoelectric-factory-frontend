import { useEffect, useState } from "react";
import { MaintenanceLogService } from "../../service/maintenance_log/maintenanceLogService";

export default function MaintenanceLogForm({ onClose, onSuccess }) {

    const [workOrders, setWorkOrders] = useState([]);

    const [workOrderId, setWorkOrderId] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        MaintenanceLogService.getWorkOrders()
            .then(res => setWorkOrders(res.data.content || res.data));
    }, []);

    const handleSubmit = async () => {

        await MaintenanceLogService.create({
            workOrderId,
            description
        });

        onSuccess();
    };

    return (
        <div style={{
            position: "fixed",
            top: 100,
            left: 200,
            background: "white",
            padding: 20,
            border: "1px solid black"
        }}>

            <h3>Tạo Maintenance Log</h3>

            {/* WORK ORDER DROPDOWN */}
            <select onChange={(e) => setWorkOrderId(e.target.value)}>
                <option>-- Chọn WorkOrder --</option>

                {workOrders.map(wo => (
                    <option key={wo.id} value={wo.id}>
                        {wo.code}
                    </option>
                ))}
            </select>

            {/* DESCRIPTION */}
            <textarea
                placeholder="Mô tả"
                onChange={(e) => setDescription(e.target.value)}
            />

            <div>
                <button onClick={handleSubmit}>Save</button>
                <button onClick={onClose}>Cancel</button>
            </div>

        </div>
    );
}