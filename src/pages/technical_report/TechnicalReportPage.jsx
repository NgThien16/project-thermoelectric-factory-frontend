import { useCallback, useEffect, useState } from "react";
import TechnicalReportForm from "./TechnicalReportForm";
import { TechnicalReportService } from "../../service/technical_report/TechnicalReportService";
import { searchListEquipment } from "../../service/operations_manager/equipment/EquipmentService";
import { toast } from "react-toastify";
import { exportTechnicalReportPdf } from "../../pdf/TechnicalReportPdf";
import { showList } from "../../service/work_order/WorkOrderService.js";

const parseJsonSafe = (value) => {
    try {
        return value ? JSON.parse(value) : {};
    } catch {
        return {};
    }
};

const getResponseData = (response) => response?.data ?? response;

const extractArray = (response) => {
    const data = getResponseData(response);

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.content)) return data.data.content;

    return [];
};

const getWorkOrderCode = (report) => {
    return report?.workOrderCode || report?.workOrder?.code || "";
};

const getEquipmentReports = (report) => {
    const content = parseJsonSafe(report?.content);

    if (Array.isArray(content.equipmentReports) && content.equipmentReports.length > 0) {
        return content.equipmentReports;
    }

    if (report?.equipmentCode || report?.equipmentName) {
        return [
            {
                equipmentId: report.equipmentId || "",
                equipmentCode: report.equipmentCode || "",
                equipmentName: report.equipmentName || "",
                damageDescription: report.damageDescription || "",
                assessment: report.assessment || "",
                proposedSolution: report.proposedSolution || "",
            },
        ];
    }

    return [];
};

const getConclusion = (report) => {
    const content = parseJsonSafe(report?.content);
    return content.conclusion || report?.conclusion || "";
};

const TechnicalReportDetail = ({ report, equipmentList, onClose }) => {
    if (!report) return null;

    const equipmentReports = getEquipmentReports(report);
    const conclusion = getConclusion(report);

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Chi tiết biên bản đánh giá kỹ thuật
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>

                    <div className="modal-body">
                        <p>
                            <strong>ID biên bản:</strong> {report.id}
                        </p>

                        <p>
                            <strong>Phiếu công tác:</strong>{" "}
                            {getWorkOrderCode(report) || "Không có dữ liệu"}
                        </p>

                        <p>
                            <strong>Người tạo:</strong>{" "}
                            {report.createdBy?.fullName ||
                                report.createdBy?.username ||
                                report.createdByName ||
                                "Không có dữ liệu"}
                        </p>

                        <p>
                            <strong>Ngày tạo:</strong>{" "}
                            {report.createdAt
                                ? new Date(report.createdAt).toLocaleString()
                                : "Không có dữ liệu"}
                        </p>

                        <p>
                            <strong>Kết luận:</strong>{" "}
                            {conclusion || "Không có dữ liệu"}
                        </p>

                        <h6>Danh sách thiết bị đánh giá</h6>

                        {equipmentReports.length > 0 ? (
                            equipmentReports.map((eq, idx) => {
                                const eqObj = equipmentList.find(
                                    (item) => Number(item.id) === Number(eq.equipmentId)
                                );

                                return (
                                    <div key={idx} className="border p-2 mb-2">
                                        <p>
                                            <strong>Thiết bị {idx + 1}</strong>
                                        </p>

                                        <p>
                                            <strong>Mã thiết bị:</strong>{" "}
                                            {eq.equipmentCode ||
                                                eqObj?.code ||
                                                "Không có dữ liệu"}
                                        </p>

                                        <p>
                                            <strong>Tên thiết bị:</strong>{" "}
                                            {eq.equipmentName ||
                                                eqObj?.name ||
                                                "Không có dữ liệu"}
                                        </p>

                                        <p>
                                            <strong>Mô tả hư hỏng:</strong>{" "}
                                            {eq.damageDescription || "Không có dữ liệu"}
                                        </p>

                                        <p>
                                            <strong>Đánh giá kỹ thuật:</strong>{" "}
                                            {eq.assessment || "Không có dữ liệu"}
                                        </p>

                                        <p>
                                            <strong>Phương án xử lý:</strong>{" "}
                                            {eq.proposedSolution || "Không có dữ liệu"}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Không có thiết bị nào</p>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-primary"
                            onClick={() => exportTechnicalReportPdf(report)}
                        >
                            Xuất PDF
                        </button>

                        <button className="btn btn-secondary" onClick={onClose}>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TechnicalReportPage = () => {
    const [reports, setReports] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [workOrderCode, setWorkOrderCode] = useState("");
    const [workOrderList, setWorkOrderList] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);

    const [selectedReport, setSelectedReport] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [detailReport, setDetailReport] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const enrichReportsWithDetail = async (summaryList) => {
        return Promise.all(
            summaryList.map(async (summary) => {
                try {
                    const detailResponse = await TechnicalReportService.getById(summary.id);
                    const detail = getResponseData(detailResponse);

                    return {
                        ...summary,
                        ...detail,
                        workOrderCode:
                            summary.workOrderCode ||
                            detail?.workOrderCode ||
                            detail?.workOrder?.code ||
                            "",
                        equipmentCode:
                            summary.equipmentCode || detail?.equipmentCode || "",
                        equipmentName:
                            summary.equipmentName || detail?.equipmentName || "",
                    };
                } catch (error) {
                    console.error(`Không lấy được chi tiết report ID ${summary.id}:`, error);
                    return summary;
                }
            })
        );
    };

    const fetchReports = useCallback(
        async (targetPage = page, targetWorkOrderCode = workOrderCode) => {
            try {
                const data = await TechnicalReportService.searchReports(
                    targetWorkOrderCode,
                    targetPage,
                    size
                );

                const summaryList = data?.content || [];
                const fullList = await enrichReportsWithDetail(summaryList);

                setReports(fullList);
                setTotalPages(data?.totalPages || 0);
            } catch (error) {
                console.error("Lỗi tải danh sách biên bản:", error);
                toast.error("Lỗi tải danh sách biên bản!");
                setReports([]);
                setTotalPages(0);
            }
        },
        [page, size, workOrderCode]
    );

    const fetchWorkOrders = async () => {
        try {
            const response = await showList();
            const list = extractArray(response);
            setWorkOrderList(list);
        } catch (error) {
            console.error("Lỗi tải danh sách phiếu công tác:", error);
            toast.error("Lỗi tải danh sách phiếu công tác!");
            setWorkOrderList([]);
        }
    };

    const fetchEquipments = async () => {
        try {
            const response = await searchListEquipment("", "", "", "", "", 0);
            const list = extractArray(response);
            setEquipmentList(list);
        } catch (error) {
            console.error("Lỗi tải danh sách thiết bị:", error);
            toast.error("Lỗi tải danh sách thiết bị!");
            setEquipmentList([]);
        }
    };

    useEffect(() => {
        fetchWorkOrders();
        fetchEquipments();
    }, []);

    useEffect(() => {
        fetchReports(page, workOrderCode);
    }, [page, fetchReports, workOrderCode]);

    const handleSearch = () => {
        setPage(0);
        fetchReports(0, workOrderCode);
    };

    const handleReset = () => {
        setWorkOrderCode("");
        setPage(0);
        fetchReports(0, "");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa biên bản này?")) return;

        try {
            await TechnicalReportService.delete(id);
            toast.success("Xóa biên bản thành công!");
            fetchReports(page, workOrderCode);
        } catch (error) {
            console.error("Không thể xóa biên bản:", error);
            toast.error("Không thể xóa biên bản!");
        }
    };

    const handleEdit = async (report) => {
        try {
            const response = await TechnicalReportService.getById(report.id);
            const detail = getResponseData(response);

            setSelectedReport({
                ...report,
                ...detail,
                workOrderCode:
                    report.workOrderCode ||
                    detail?.workOrderCode ||
                    detail?.workOrder?.code ||
                    "",
            });

            setShowForm(true);
        } catch (error) {
            console.error("Không lấy được chi tiết để sửa:", error);
            toast.error("Không lấy được chi tiết biên bản!");
        }
    };

    const handleAdd = () => {
        setSelectedReport(null);
        setShowForm(true);
    };

    const handleViewDetail = async (report) => {
        try {
            const response = await TechnicalReportService.getById(report.id);
            const detail = getResponseData(response);

            setDetailReport({
                ...report,
                ...detail,
                workOrderCode:
                    report.workOrderCode ||
                    detail?.workOrderCode ||
                    detail?.workOrder?.code ||
                    "",
            });

            setShowDetail(true);
        } catch (error) {
            console.error("Không lấy được chi tiết biên bản:", error);

            setDetailReport(report);
            setShowDetail(true);

            toast.warning("Không lấy được dữ liệu chi tiết mới nhất.");
        }
    };

    return (
        <div>
            <h3>Danh sách Biên bản đánh giá kỹ thuật</h3>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex">
                    <select
                        name="workOrderCode"
                        value={workOrderCode}
                        onChange={(e) => setWorkOrderCode(e.target.value)}
                        className="form-control me-2"
                    >
                        <option value="">---Mã phiếu công tác---</option>

                        {workOrderList.map((w, index) => {
                            const code = w.code || w.workOrderCode || "";

                            return (
                                <option key={w.id || `${code}-${index}`} value={code}>
                                    {code}
                                </option>
                            );
                        })}
                    </select>

                    <button onClick={handleSearch} className="btn btn-primary me-2">
                        Tìm kiếm
                    </button>

                    <button onClick={handleReset} className="btn btn-secondary">
                        Quay lại
                    </button>
                </div>

                <button onClick={handleAdd} className="btn btn-success">
                    Thêm mới
                </button>
            </div>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>STT</th>
                    <th>Phiếu công tác</th>
                    <th>Mã thiết bị</th>
                    <th>Tên thiết bị</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                </tr>
                </thead>

                <tbody>
                {reports.length > 0 ? (
                    reports.map((r, i) => {
                        const equipmentReports = getEquipmentReports(r);

                        const equipmentCodes =
                            equipmentReports.length > 0
                                ? equipmentReports
                                    .map((eq) => eq.equipmentCode)
                                    .filter(Boolean)
                                    .join(", ")
                                : r.equipmentCode || "";

                        const equipmentNames =
                            equipmentReports.length > 0
                                ? equipmentReports
                                    .map((eq) => eq.equipmentName)
                                    .filter(Boolean)
                                    .join(", ")
                                : r.equipmentName || "";

                        return (
                            <tr key={r.id}>
                                <td>{page * size + i + 1}</td>

                                <td>{getWorkOrderCode(r)}</td>

                                <td>{equipmentCodes}</td>

                                <td>{equipmentNames}</td>

                                <td>
                                    {r.createdAt
                                        ? new Date(r.createdAt).toLocaleString()
                                        : ""}
                                </td>

                                <td>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleViewDetail(r)}
                                    >
                                        Chi tiết
                                    </button>

                                    {" "}

                                    <button
                                        className="btn btn-sm btn-info"
                                        onClick={() => handleEdit(r)}
                                    >
                                        Sửa
                                    </button>

                                    {" "}

                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(r.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center">
                            Không có dữ liệu
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className="d-flex justify-content-center mt-3">
                <button
                    disabled={page <= 0}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    className="btn btn-secondary mx-2"
                >
                    Trang trước
                </button>

                <span className="align-self-center mx-2">
                    Trang {totalPages === 0 ? 0 : page + 1} / {totalPages}
                </span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="btn btn-secondary mx-2"
                >
                    Trang sau
                </button>
            </div>

            {showForm && (
                <TechnicalReportForm
                    report={selectedReport}
                    onClose={() => setShowForm(false)}
                    onSave={() => {
                        setShowForm(false);
                        fetchReports(page, workOrderCode);
                    }}
                    equipmentList={equipmentList}
                />
            )}

            {showDetail && (
                <TechnicalReportDetail
                    report={detailReport}
                    equipmentList={equipmentList}
                    onClose={() => {
                        setShowDetail(false);
                        setDetailReport(null);
                    }}
                />
            )}
        </div>
    );
};

export default TechnicalReportPage;