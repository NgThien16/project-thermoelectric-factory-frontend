import { useState } from "react";
import { TechnicalReportService } from "../../service/technical_report/TechnicalReportService";
import useAuth from "../../context/useAuth";

const TechnicalReportForm = ({ report, onClose, onSave }) => {
    const { user: currentUser } = useAuth();

    const [workOrderId, setWorkOrderId] = useState(report?.workOrder?.id || "");
    const [conclusion, setConclusion] = useState(
        report?.content ? JSON.parse(report.content).conclusion : ""
    );
    const [equipmentReports, setEquipmentReports] = useState(
        report?.content ? JSON.parse(report.content).equipmentReports : []
    );

    const handleAddEquipment = () => {
        setEquipmentReports([
            ...equipmentReports,
            {
                equipmentId: "",
                equipmentName: "",
                damageDescription: "",
                cause: "",
                assessment: "",
                proposedSolution: "",
                replacements: [
                    { materialId: "", name: "", quantity: 1 }
                ]
            }
        ]);
    };

    const handleEquipmentChange = (eqIndex, field, value) => {
        const newList = [...equipmentReports];
        newList[eqIndex][field] = value;
        setEquipmentReports(newList);
    };

    const handleRemoveEquipment = (eqIndex) => {
        const newList = [...equipmentReports];
        newList.splice(eqIndex, 1);
        setEquipmentReports(newList);
    };

    const handleAddReplacement = (eqIndex) => {
        const newList = [...equipmentReports];
        newList[eqIndex].replacements.push({ materialId: "", name: "", quantity: 1 });
        setEquipmentReports(newList);
    };

    const handleReplacementChange = (eqIndex, repIndex, field, value) => {
        const newList = [...equipmentReports];
        newList[eqIndex].replacements[repIndex][field] =
            field === "quantity" ? Number(value) : value;
        setEquipmentReports(newList);
    };

    const handleRemoveReplacement = (eqIndex, repIndex) => {
        const newList = [...equipmentReports];
        newList[eqIndex].replacements.splice(repIndex, 1);
        setEquipmentReports(newList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!workOrderId) {
            alert("Vui lòng nhập Work Order ID");
            return;
        }
        if (!equipmentReports || equipmentReports.length === 0) {
            alert("Vui lòng thêm ít nhất 1 thiết bị");
            return;
        }

        const dto = {
            workOrderId: Number(workOrderId),
            createdBy: currentUser?.id,
            conclusion: conclusion || "",
            equipmentReports: equipmentReports.map((eq) => ({
                equipmentId: Number(eq.equipmentId),
                equipmentName: eq.equipmentName || "",
                damageDescription: eq.damageDescription || "",
                cause: eq.cause || "",
                assessment: eq.assessment || "",
                proposedSolution: eq.proposedSolution || "",
                replacements: eq.replacements || []
            }))
        };

        try {
            if (report) {
                await TechnicalReportService.update(report.id, dto);
            } else {
                await TechnicalReportService.create(dto);
            }
            onSave();
        } catch (error) {
            console.error("Lỗi khi lưu biên bản:", error);
            console.error("Backend trả về:", error.response?.data);
            alert("Lưu biên bản thất bại! Xem console để biết chi tiết.");
        }
    };

    return (
        <div
            className="modal show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.3)" }}
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content p-3">
                    <div className="modal-header">
                        <h5 className="modal-title">{report ? "Sửa biên bản" : "Thêm biên bản"}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label>Work Order ID</label>
                            <input
                                type="number"
                                className="form-control"
                                value={workOrderId}
                                onChange={(e) => setWorkOrderId(e.target.value)}
                                required
                            />
                        </div>

                        {equipmentReports.map((eq, eqIndex) => (
                            <div key={eqIndex} className="border p-3 mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6>Thiết bị {eqIndex + 1}</h6>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleRemoveEquipment(eqIndex)}
                                    >
                                        Xóa
                                    </button>
                                </div>

                                <input
                                    type="number"
                                    placeholder="ID thiết bị"
                                    className="form-control mb-2"
                                    value={eq.equipmentId}
                                    onChange={(e) =>
                                        handleEquipmentChange(eqIndex, "equipmentId", e.target.value)
                                    }
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Tên thiết bị"
                                    className="form-control mb-2"
                                    value={eq.equipmentName}
                                    onChange={(e) =>
                                        handleEquipmentChange(eqIndex, "equipmentName", e.target.value)
                                    }
                                />
                                <textarea
                                    placeholder="Mô tả hư hỏng"
                                    className="form-control mb-2"
                                    value={eq.damageDescription}
                                    onChange={(e) =>
                                        handleEquipmentChange(eqIndex, "damageDescription", e.target.value)
                                    }
                                />
                                <textarea
                                    placeholder="Nguyên nhân"
                                    className="form-control mb-2"
                                    value={eq.cause}
                                    onChange={(e) =>
                                        handleEquipmentChange(eqIndex, "cause", e.target.value)
                                    }
                                />
                                <textarea
                                    placeholder="Đánh giá kỹ thuật"
                                    className="form-control mb-2"
                                    value={eq.assessment}
                                    onChange={(e) =>
                                        handleEquipmentChange(eqIndex, "assessment", e.target.value)
                                    }
                                />
                                <textarea
                                    placeholder="Phương án xử lý"
                                    className="form-control mb-2"
                                    value={eq.proposedSolution}
                                    onChange={(e) =>
                                        handleEquipmentChange(eqIndex, "proposedSolution", e.target.value)
                                    }
                                />

                                {/*<h6>Vật tư đề xuất</h6>*/}
                                {/*{eq.replacements.map((rep, repIndex) => (*/}
                                {/*    <div key={repIndex} className="d-flex mb-2">*/}
                                {/*        <input*/}
                                {/*            type="text"*/}
                                {/*            placeholder="Tên vật tư"*/}
                                {/*            className="form-control me-2"*/}
                                {/*            value={rep.name}*/}
                                {/*            onChange={(e) =>*/}
                                {/*                handleReplacementChange(eqIndex, repIndex, "name", e.target.value)*/}
                                {/*            }*/}
                                {/*        />*/}
                                {/*        <input*/}
                                {/*            type="number"*/}
                                {/*            placeholder="Số lượng"*/}
                                {/*            className="form-control me-2"*/}
                                {/*            value={rep.quantity}*/}
                                {/*            onChange={(e) =>*/}
                                {/*                handleReplacementChange(eqIndex, repIndex, "quantity", e.target.value)*/}
                                {/*            }*/}
                                {/*        />*/}
                                {/*        <button*/}
                                {/*            type="button"*/}
                                {/*            className="btn btn-sm btn-danger"*/}
                                {/*            onClick={() => handleRemoveReplacement(eqIndex, repIndex)}*/}
                                {/*        >*/}
                                {/*            Xóa*/}
                                {/*        </button>*/}
                                {/*    </div>*/}
                                {/*))}*/}
                                {/*<button*/}
                                {/*    type="button"*/}
                                {/*    className="btn btn-sm btn-secondary"*/}
                                {/*    onClick={() => handleAddReplacement(eqIndex)}*/}
                                {/*>*/}
                                {/*    Thêm vật tư*/}
                                {/*</button>*/}
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-secondary mb-3"
                            onClick={handleAddEquipment}
                        >
                            Thêm thiết bị
                        </button>

                        <textarea
                            placeholder="Kết luận"
                            className="form-control mb-3"
                            value={conclusion}
                            onChange={(e) => setConclusion(e.target.value)}
                        />

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary me-2">
                                Lưu
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TechnicalReportForm;