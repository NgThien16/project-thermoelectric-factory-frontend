import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Table, Badge, Spinner } from "react-bootstrap";
import { FaArrowLeft, FaPlus, FaSave, FaTrash, FaFileAlt, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { exportMaterialsToWorkOrder } from "../../service/materials_manager/ExportMaterialService.js";
import { getAllMaterialsForDropdown as getConsumablesFromApi } from "../../service/materials_manager/consumable/ConsumableCategoryService.js";
import { getAllMaterialsForDropdown as getReplacementsFromApi } from "../../service/materials_manager/replacement/ReplacementCategoryService.js";
import axiosInstance from "../../api/axiosInstance.js";

import { TechnicalReportService } from "../../service/technical_report/TechnicalReportService.js";

export default function Export() {
    const navigate = useNavigate();
    const { requestId } = useParams();

    const [consumablesList, setConsumablesList] = useState([]);
    const [replacementsList, setReplacementsList] = useState([]);
    const [searchConsumable, setSearchConsumable] = useState("");
    const [searchReplacement, setSearchReplacement] = useState("");
    const [tempItems, setTempItems] = useState([]);
    const [repairRequest, setRepairRequest] = useState(null);
    const [loadingRequest, setLoadingRequest] = useState(true);

    const [workOrderData, setWorkOrderData] = useState(null);

    const [formInput, setFormInput] = useState({
        selectedType: "CONSUMABLE",
        consumableId: "",
        replacementId: "",
        quantity: ""
    });

    // Trạng thái ReadOnly đóng băng màn hình nếu đã xuất kho thành công
    const isReadOnly = workOrderData?.materialStatus === "DA_CAP_PHAT";

    useEffect(() => {
        if (requestId && requestId !== "undefined" && requestId !== "null" && !isNaN(requestId)) {
            loadWorkOrderDetails(requestId);
            loadRealTechnicalReport(requestId);
        }
        loadAllMaterialsFromDatabase();
    }, [requestId]);

    // Tự động load lại danh sách vật tư cũ lên bảng nếu trạng thái là CHO_CAP_PHAT
    const loadWorkOrderDetails = async (id) => {
        try {
            const response = await axiosInstance.get(`/material-export/work-order/${id}`);
            if (response && response.data) {
                setWorkOrderData(response.data);

                // Nếu đang ở trạng thái CHO_CAP_PHAT -> Quản đốc chỉnh sửa dữ liệu cũ
                if (response.data.materialStatus === "CHO_CAP_PHAT") {
                    const [consRes, repRes] = await Promise.all([
                        axiosInstance.get(`/material-export/work-order-consumables/work-order/${id}`),
                        axiosInstance.get(`/material-export/work-order-replacements/work-order/${id}`)
                    ]);

                    const loadedItems = [];
                    // Sử dụng Optional Chaining (?.) để phòng tránh dữ liệu lỗi/null từ API danh mục
                    if (consRes.data && Array.isArray(consRes.data)) {
                        consRes.data.forEach(item => {
                            if (item.material) {
                                loadedItems.push({
                                    uniqueKey: `CONSUMABLE_${item.material.id}`,
                                    materialId: item.material.id,
                                    materialCode: item.material.code,
                                    materialName: item.material.name,
                                    type: "CONSUMABLE",
                                    typeName: "Tiêu hao",
                                    quantity: item.quantity
                                });
                            }
                        });
                    }
                    if (repRes.data && Array.isArray(repRes.data)) {
                        repRes.data.forEach(item => {
                            if (item.material) {
                                loadedItems.push({
                                    uniqueKey: `REPLACEMENT_${item.material.id}`,
                                    materialId: item.material.id,
                                    materialCode: item.material.code,
                                    materialName: item.material.name,
                                    type: "REPLACEMENT",
                                    typeName: "Thay thế",
                                    quantity: item.quantity
                                });
                            }
                        });
                    }
                    setTempItems(loadedItems);
                }
            }
        } catch (error) {
            console.error("Lỗi khi tải trạng thái phiếu từ API:", error);
            setWorkOrderData({ materialStatus: "CHUA_YEU_CAU_CAP_PHAT" });
        }
    };

    const loadRealTechnicalReport = async (id) => {
        setLoadingRequest(true);
        try {
            const response = await TechnicalReportService.getByWorkOrder(id);
            if (response && response.data && response.data.length > 0) {
                setRepairRequest(response.data[0]);
            } else {
                setRepairRequest({
                    content: "Chưa có biên bản đánh giá kỹ thuật cho phiếu sửa chữa này."
                });
            }
        } catch (error) {
            console.error("Lỗi khi tải biên bản kỹ thuật thực tế:", error);
            setRepairRequest({
                content: "Không thể kết nối đến máy chủ để tải biên bản đánh giá kỹ thuật."
            });
        } finally {
            setLoadingRequest(false);
        }
    };

    const loadAllMaterialsFromDatabase = async () => {
        try {
            const consumableData = await getConsumablesFromApi();
            setConsumablesList(Array.isArray(consumableData) ? consumableData : []);

            const replacementData = await getReplacementsFromApi();
            setReplacementsList(Array.isArray(replacementData) ? replacementData : []);
        } catch (error) {
            console.error("Lỗi tải danh mục vật tư:", error);
            // Không kích hoạt toast lỗi làm phiền người dùng khi token hoặc quyền hạn bị 403 cục bộ
        }
    };

    const filteredConsumables = consumablesList.filter(item =>
        (item.name && item.name.toLowerCase().includes(searchConsumable.toLowerCase())) ||
        (item.code && item.code.toLowerCase().includes(searchConsumable.toLowerCase()))
    );

    const filteredReplacements = replacementsList.filter(item =>
        (item.name && item.name.toLowerCase().includes(searchReplacement.toLowerCase())) ||
        (item.code && item.code.toLowerCase().includes(searchReplacement.toLowerCase()))
    );

    const handleAddRow = () => {
        if (isReadOnly) return;
        const { selectedType, consumableId, replacementId, quantity } = formInput;
        if (!quantity || quantity <= 0) return toast.error("Số lượng cấp phát phải lớn hơn 0!");

        let selectedMaterial = null;
        let uniqueKey = "";

        if (selectedType === "CONSUMABLE") {
            if (!consumableId) return toast.error("Vui lòng chọn vật tư tiêu hao!");
            selectedMaterial = consumablesList.find(item => item.id === parseInt(consumableId));
            uniqueKey = `CONSUMABLE_${consumableId}`;
        } else {
            if (!replacementId) return toast.error("Vui lòng chọn phụ tùng thay thế!");
            selectedMaterial = replacementsList.find(item => item.id === parseInt(replacementId));
            uniqueKey = `REPLACEMENT_${replacementId}`;
        }

        if (!selectedMaterial) return toast.error("Vật tư không hợp lệ!");

        const isExist = tempItems.some(item => item.uniqueKey === uniqueKey);
        if (isExist) return toast.warning("Mặt hàng này đã có trong danh sách chờ cấp!");

        const newRow = {
            uniqueKey,
            materialId: selectedMaterial.id,
            materialCode: selectedMaterial.code,
            materialName: selectedMaterial.name,
            type: selectedType,
            typeName: selectedType === "CONSUMABLE" ? "Tiêu hao" : "Thay thế",
            quantity: parseInt(quantity)
        };

        setTempItems([...tempItems, newRow]);
        setFormInput({ ...formInput, consumableId: "", replacementId: "", quantity: "" });
        setSearchConsumable("");
        setSearchReplacement("");
        toast.success("Đã thêm vào danh sách chờ!");
    };

    const handleRemoveRow = (index) => {
        if (isReadOnly) return;
        const updated = [...tempItems];
        updated.splice(index, 1);
        setTempItems(updated);
    };

    const handleFinalExport = async () => {
        if (tempItems.length === 0) return toast.error("Danh sách chờ cấp đang trống!");

        // Cấu trúc dữ liệu gửi lên Backend
        const finalPayload = {
            workOrderId: parseInt(requestId),
            consumables: tempItems
                .filter(item => item.type === "CONSUMABLE")
                .map(item => ({ materialId: item.materialId, quantity: item.quantity })),
            replacements: tempItems
                .filter(item => item.type === "REPLACEMENT")
                .map(item => ({ materialId: item.materialId, quantity: item.quantity }))
        };

        // In thử payload ra console trước khi gửi để bạn tự kiểm tra xem cấu trúc chuẩn chưa
        console.log("Dữ liệu chuẩn bị gửi lên Backend (Payload):", finalPayload);

        try {
            // Bọc lệnh gọi API vào block try để kiểm soát lỗi
            const isSuccess = await exportMaterialsToWorkOrder(finalPayload);
            if (isSuccess !== false) {
                toast.success("🚀 Đã gửi yêu cầu cấp phát vật tư thành công!");
                navigate("/material-export/supply-slip");
            } else {
                toast.error("Cấp phát thất bại, vui lòng kiểm tra lại hệ thống.");
            }
        } catch (error) {
            console.error("Lỗi khi gọi API cấp phát vật tư:", error);

            // Đoạn này sẽ in chi tiết "tại sao lỗi" từ Spring Boot trả về
            if (error.response && error.response.data) {
                console.log("👉 CHI TIẾT LỖI TỪ BACKEND TRẢ VỀ:", error.response.data);

                // Nếu backend có trả về chuỗi thông báo lỗi cụ thể (ví dụ: error.response.data.message)
                const serverMessage = error.response.data.message || error.response.data;
                toast.error(`Lỗi từ hệ thống: ${JSON.stringify(serverMessage)}`);
            } else {
                toast.error("Không thể kết nối đến máy chủ hoặc dữ liệu không hợp lệ (400)!");
            }
        }
    };

    // 🛡️ PHÒNG VỆ AN TOÀN: Hàm hiển thị nội dung biên bản phòng chống crash JSON hoàn hảo
    const renderReportContent = () => {
        if (!repairRequest || !repairRequest.content) {
            return "Không có dữ liệu biên bản kỹ thuật.";
        }

        const contentStr = repairRequest.content.trim();

        // Chỉ tiến hành kiểm tra JSON nếu ký tự bắt đầu thực sự là dấu ngoặc nhọn đặc trưng của JSON Object
        if (contentStr.startsWith("{")) {
            try {
                const parsedData = JSON.parse(contentStr);
                let formattedText = `[BIÊN BẢN ĐÁNH GIÁ KỸ THUẬT PHIẾU #${parsedData.workOrderId || requestId}]\n\n`;

                if (parsedData.equipmentReports && Array.isArray(parsedData.equipmentReports)) {
                    formattedText += `🛠️ DANH SÁCH THIẾT BỊ KHẢO SÁT CHI TIẾT:\n`;
                    parsedData.equipmentReports.forEach((eq, idx) => {
                        formattedText += `${idx + 1}. ${eq.equipmentName || "Tên thiết bị trống"} (Mã ID: ${eq.equipmentId})\n`;
                        if (eq.description) formattedText += `   - Hiện trạng khảo sát: ${eq.description}\n`;
                    });
                    return formattedText;
                }
            } catch (e) {
                console.warn("Nội dung có ký tự giống JSON nhưng parse thất bại, chuyển sang hiển thị văn bản thường.");
            }
        }

        // Trả về văn bản thuần nếu không lọt vào block JSON hoặc parse lỗi
        return repairRequest.content;
    };

    return (
        <div className="container-fluid mt-4 px-4">
            <Card className="shadow border-0 mb-4">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <h4 className="mb-0 fw-bold">Quản đốc sửa chữa</h4>
                    <Button as={Link} to="/material-export/supply-slip" variant="light">
                        <FaArrowLeft className="me-2" /> Quay lại danh sách
                    </Button>
                </Card.Header>
            </Card>

            {workOrderData?.materialStatus === "CHO_CAP_PHAT" && (
                <div className="alert alert-warning border-0 shadow-sm fw-bold mb-4">
                    📝 Phiếu sửa chữa này đang ở trạng thái <span className="text-danger">CHỜ CẤP PHÁT</span>. Hệ thống đã nạp lại danh sách vật tư cũ, bạn có thể chỉnh sửa và bấm cập nhật lại!
                </div>
            )}

            <Row className="g-4">
                <Col lg={4} md={5}>
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Header className="bg-light border-bottom py-3">
                            <h5 className="mb-0 text-secondary fw-bold">
                                <FaFileAlt className="me-2 text-warning" /> Biên bản đánh giá kĩ thuật
                            </h5>
                        </Card.Header>
                        <Card.Body className="bg-light-subtle d-flex flex-column">
                            {loadingRequest ? (
                                <div className="text-center py-5 flex-grow-1 d-flex align-items-center justify-content-center">
                                    <Spinner animation="border" variant="primary" className="me-2"/>
                                    <span>Đang tải biên bản...</span>
                                </div>
                            ) : (
                                <div className="p-3 bg-white border rounded flex-grow-1 text-muted" style={{ minHeight: "380px", whiteSpace: "pre-line", fontSize: "0.95rem" }}>
                                    {renderReportContent()}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={8} md={7}>
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Body className="py-4">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold text-dark me-4">Hình thức vật tư cấp:</Form.Label>
                                <Form.Check
                                    inline label="Vật tư tiêu hao" name="materialTypeGroup" type="radio" id="radio-consumable"
                                    disabled={isReadOnly} checked={formInput.selectedType === "CONSUMABLE"}
                                    onChange={() => setFormInput({ ...formInput, selectedType: "CONSUMABLE" })}
                                    className="fw-bold text-info"
                                />
                                <Form.Check
                                    inline label="Phụ tùng thay thế" name="materialTypeGroup" type="radio" id="radio-replacement"
                                    disabled={isReadOnly} checked={formInput.selectedType === "REPLACEMENT"}
                                    onChange={() => setFormInput({ ...formInput, selectedType: "REPLACEMENT" })}
                                    className="fw-bold text-warning"
                                />
                            </Form.Group>

                            <Row className="g-3 align-items-end">
                                {formInput.selectedType === "CONSUMABLE" && (
                                    <Col md={6}>
                                        <Form.Label className="fw-bold text-secondary">Chọn vật tư tiêu hao</Form.Label>
                                        <div className="input-group mb-2">
                                            <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" size={13}/></span>
                                            <Form.Control
                                                type="text" placeholder="Gõ tên hoặc mã để tìm..." className="border-start-0 ps-1"
                                                disabled={isReadOnly} value={searchConsumable} onChange={e => setSearchConsumable(e.target.value)}
                                            />
                                        </div>
                                        <Form.Select disabled={isReadOnly} value={formInput.consumableId} onChange={e => setFormInput({ ...formInput, consumableId: e.target.value })}>
                                            <option value="">-- Chọn trong danh sách tiêu hao ({filteredConsumables.length}) --</option>
                                            {filteredConsumables.map((item) => (
                                                <option key={item.id} value={item.id}>{`[${item.code}] ${item.name}`}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                )}

                                {formInput.selectedType === "REPLACEMENT" && (
                                    <Col md={6}>
                                        <Form.Label className="fw-bold text-secondary">Chọn phụ tùng thay thế</Form.Label>
                                        <div className="input-group mb-2">
                                            <span className="input-group-text bg-white border-end-0"><FaSearch className="text-muted" size={13}/></span>
                                            <Form.Control
                                                type="text" placeholder="Gõ tên hoặc mã phụ tùng để tìm..." className="border-start-0 ps-1"
                                                disabled={isReadOnly} value={searchReplacement} onChange={e => setSearchReplacement(e.target.value)}
                                            />
                                        </div>
                                        <Form.Select disabled={isReadOnly} value={formInput.replacementId} onChange={e => setFormInput({ ...formInput, replacementId: e.target.value })}>
                                            <option value="">-- Chọn trong danh sách thay thế ({filteredReplacements.length}) --</option>
                                            {filteredReplacements.map((item) => (
                                                <option key={item.id} value={item.id}>{`[${item.code}] ${item.name}`}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                )}

                                <Col md={3}>
                                    <Form.Label className="fw-bold text-secondary">Số lượng</Form.Label>
                                    <Form.Control type="number" min="1" placeholder="Nhập SL" disabled={isReadOnly} value={formInput.quantity} onChange={e => setFormInput({ ...formInput, quantity: e.target.value })} />
                                </Col>
                                <Col md={3}>
                                    <Button variant="primary" className="w-100 fw-bold py-2" onClick={handleAddRow} disabled={isReadOnly}>
                                        <FaPlus className="me-2" /> Thêm cấp
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-light py-3">
                            <h5 className="mb-0 fw-bold text-secondary">Danh sách chờ cấp phát tổng hợp</h5>
                        </Card.Header>
                        <Card.Body className="d-flex flex-column" style={{ minHeight: "310px" }}>
                            <div className="flex-grow-1">
                                <Table bordered hover responsive className="align-middle text-center mb-0">
                                    <thead className="table-dark">
                                    <tr>
                                        <th style={{ width: "8%" }}>STT</th>
                                        <th>Phân loại</th>
                                        <th>Mã vật tư</th>
                                        <th>Tên vật tư vật liệu</th>
                                        <th style={{ width: "15%" }}>Số lượng</th>
                                        <th style={{ width: "12%" }}>Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {tempItems.length > 0 ? (
                                        tempItems.map((item, index) => (
                                            <tr key={item.uniqueKey}>
                                                <td className="fw-bold text-muted">{index + 1}</td>
                                                <td><Badge bg={item.type === "CONSUMABLE" ? "info" : "warning"} className="text-white">{item.typeName}</Badge></td>
                                                <td className="fw-bold text-primary">{item.materialCode}</td>
                                                <td className="text-start">{item.materialName}</td>
                                                <td className="fw-bold text-success">{item.quantity}</td>
                                                <td>
                                                    <Button size="sm" variant="outline-danger" disabled={isReadOnly} onClick={() => handleRemoveRow(index)}>
                                                        <FaTrash />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="text-muted py-5">Chưa có vật tư nào được chọn vào danh sách cấp phát.</td></tr>
                                    )}
                                    </tbody>
                                </Table>
                            </div>

                            {isReadOnly ? (
                                <div className="d-flex justify-content-end mt-4">
                                    <div className="alert alert-info border-0 shadow-sm fw-bold px-5 py-3 text-center w-100 mb-0">
                                        🔒 Danh sách yêu cầu cấp phát này đã được hoàn tất xuất kho thực tế (Chế độ xem lại).
                                        <br />
                                        <span className="text-success fs-6 fw-semibold">
                                            Trạng thái vật tư hiện tại: ĐÃ CẤP PHÁT (DA_CAP_PHAT)
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                tempItems.length > 0 && (
                                    <div className="d-flex justify-content-end mt-4">
                                        <Button variant="success" size="lg" className="px-5 fw-bold shadow-sm" onClick={handleFinalExport}>
                                            <FaSave className="me-2" /> {workOrderData?.materialStatus === "CHO_CAP_PHAT" ? "Cập nhật yêu cầu cấp" : "Xác nhận cấp vật tư"}
                                        </Button>
                                    </div>
                                )
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}