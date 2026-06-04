import { useState } from "react";
import { TechnicalReportService } from "../../service/technical_report/TechnicalReportService.js";

const TechnicalReportForm = ({ report, onClose, onSave }) => {
    const parseContent = () => {
        try {
            return report?.content ? JSON.parse(report.content) : {};
        } catch {
            return {};
        }
    };

    const content = parseContent();

    const [workOrderId, setWorkOrderId] = useState(report?.workOrder?.id || "");
    const [conclusion, setConclusion] = useState(content.conclusion || "");
    const [equipmentReports, setEquipmentReports] = useState(content.equipmentReports || []);

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
                replacements: ""
            }
        ]);
    };

    const handleEquipmentChange = (index, field, value) => {
        const newList = [...equipmentReports];
        newList[index][field] = value;
        setEquipmentReports(newList);
    };

    const handleRemoveEquipment = (index) => {
        const newList = [...equipmentReports];
        newList.splice(index, 1);
        setEquipmentReports(newList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dto = {
            workOrderId: Number(workOrderId),
            createdBy: 12,
            conclusion,
            equipmentReports
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
            alert("Lưu biên bản thất bại!");
        }
    };

    return (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.3)" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content p-3">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {report ? "Sửa biên bản đánh giá kỹ thuật" : "Thêm biên bản đánh giá kỹ thuật"}
                        </h5>
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

                        {equipmentReports.map((eq, idx) => (
                            <div key={idx} className="border rounded p-3 mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">Thiết bị {idx + 1}</h6>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleRemoveEquipment(idx)}
                                    >
                                        Xóa
                                    </button>
                                </div>

                                <div className="form-group mb-2">
                                    <label>ID thiết bị</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={eq.equipmentId}
                                        onChange={(e) => handleEquipmentChange(idx, "equipmentId", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-2">
                                    <label>Tên thiết bị</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={eq.equipmentName}
                                        onChange={(e) => handleEquipmentChange(idx, "equipmentName", e.target.value)}
                                    />
                                </div>

                                <div className="form-group mb-2">
                                    <label>Mô tả hư hỏng</label>
                                    <textarea
                                        className="form-control"
                                        value={eq.damageDescription}
                                        onChange={(e) => handleEquipmentChange(idx, "damageDescription", e.target.value)}
                                    />
                                </div>

                                {/*<div className="form-group mb-2">*/}
                                {/*    <label>Nguyên nhân</label>*/}
                                {/*    <textarea*/}
                                {/*        className="form-control"*/}
                                {/*        value={eq.cause}*/}
                                {/*        onChange={(e) => handleEquipmentChange(idx, "cause", e.target.value)}*/}
                                {/*    />*/}
                                {/*</div>*/}

                                <div className="form-group mb-2">
                                    <label>Đánh giá kỹ thuật</label>
                                    <textarea
                                        className="form-control"
                                        value={eq.assessment}
                                        onChange={(e) => handleEquipmentChange(idx, "assessment", e.target.value)}
                                    />
                                </div>

                                <div className="form-group mb-2">
                                    <label>Phương án xử lý</label>
                                    <textarea
                                        className="form-control"
                                        value={eq.proposedSolution}
                                        onChange={(e) => handleEquipmentChange(idx, "proposedSolution", e.target.value)}
                                    />
                                </div>

                                {/*<div className="form-group mb-2">*/}
                                {/*    <label>Vật tư đề xuất</label>*/}
                                {/*    <textarea*/}
                                {/*        className="form-control"*/}
                                {/*        value={eq.replacements || ""}*/}
                                {/*        onChange={(e) => handleEquipmentChange(idx, "replacements", e.target.value)}*/}
                                {/*        placeholder={"Vật tư"}*/}
                                {/*    />*/}
                                {/*</div>*/}
                            </div>
                        ))}

                        <button type="button" className="btn btn-secondary mb-3" onClick={handleAddEquipment}>
                            Thêm thiết bị
                        </button>

                        <div className="form-group mb-3">
                            <label>Kết luận</label>
                            <textarea
                                className="form-control"
                                value={conclusion}
                                onChange={(e) => setConclusion(e.target.value)}
                            />
                        </div>

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