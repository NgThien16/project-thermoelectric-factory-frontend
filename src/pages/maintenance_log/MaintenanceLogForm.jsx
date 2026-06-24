import { useState } from "react";
import { MaintenanceLogService } from "../../service/maintenance_log/maintenanceLogService";

export default function MaintenanceLogForm({ onClose, onSuccess }) {

    const [workOrderId, setWorkOrderId] = useState("");
    const [equipmentId, setEquipmentId] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        await MaintenanceLogService.create({
            workOrderId,
            equipmentId,
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

            // đổi lại formik và gọi 2 api
            <input
                placeholder="WorkOrder ID"
                onChange={(e) => setWorkOrderId(e.target.value)}
            />

            <input
                placeholder="Equipment ID"
                onChange={(e) => setEquipmentId(e.target.value)}
            />

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