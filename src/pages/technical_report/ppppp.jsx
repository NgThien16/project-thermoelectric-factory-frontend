import {useState, useEffect} from "react";
import TechnicalReportForm from "./TechnicalReportForm";
import {TechnicalReportService} from "../../service/technical_report/TechnicalReportService";
import {searchListEquipment} from "../../service/operations_manager/equipment/EquipmentService";
import {toast} from "react-toastify";
import { exportTechnicalReportPdf } from "../../pdf/TechnicalReportPdf";

// Modal chi tiết
const TechnicalReportDetail = ({report, equipmentList, onClose}) => {
    if (!report) return null;

    let content = {};
    try {
        content = report.content ? JSON.parse(report.content) : {};
    } catch {
        content = {};
    }

    const equipmentReports = content.equipmentReports || [];

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Chi tiết biên bản đánh giá kỹ thuật</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p><strong>ID biên bản:</strong> {report.id}</p>
                        {/*<p><strong>Work Order ID:</strong> {report.workOrder?.id}</p>*/}
                        <p><b>Phiếu công tác:</b> {report.workOrder?.code}</p>
                        {/*<p><strong>Người tạo:</strong> {report.createdBy?.fullName || report.createdBy?.username || "Không có dữ liệu"}</p>*/}
                        <p><strong>Ngày tạo:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                        <p><strong>Kết luận:</strong> {content.conclusion || "Không có dữ liệu"}</p>

                        <h6>Danh sách thiết bị đánh giá</h6>
                        {equipmentReports.length > 0 ? (
                            equipmentReports.map((eq, idx) => {
                                const eqObj = equipmentList.find(e => e.id === eq.equipmentId);
                                return (
                                    <div key={idx} className="border p-2 mb-2">
                                        <p><strong>Thiết bị {idx + 1}</strong></p>
                                        <p><strong>Mã code:</strong> {eqObj?.code || ""}</p>
                                        <p><strong>Tên thiết bị:</strong> {eq.equipmentName || ""}</p>
                                        <p><strong>Mô tả hư hỏng:</strong> {eq.damageDescription || ""}</p>
                                        {/*<p><strong>Nguyên nhân:</strong> {eq.cause || ""}</p>*/}
                                        <p><strong>Đánh giá kỹ thuật:</strong> {eq.assessment || ""}</p>
                                        <p><strong>Phương án xử lý:</strong> {eq.proposedSolution || ""}</p>
                                        {/*<p><strong>Vật tư đề xuất:</strong> {eq.replacements || "Không có"}</p>*/}
                                        {/*<h6>Vật tư thay thế</h6>*/}
                                        {/*{eq.replacements?.length > 0 ? (*/}
                                        {/*    eq.replacements.map((rep, ridx) => (*/}
                                        {/*        <div key={ridx}>*/}
                                        {/*            <p>{rep.name} - Số lượng: {rep.quantity}</p>*/}
                                        {/*        </div>*/}
                                        {/*    ))*/}
                                        {/*) : (*/}
                                        {/*    <p>Không có vật tư thay thế</p>*/}
                                        {/*)}*/}
                                    </div>
                                );
                            })
                        ) : (
                            <p>Không có thiết bị nào</p>
                        )}
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => exportTechnicalReportPdf(report)}
                    >
                        Xuất PDF
                    </button>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
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
    const [keyword, setKeyword] = useState("");
    const [deviceKeyword, setDeviceKeyword] = useState("");
    const [workOrderId, setWorkOrderId] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [detailReport, setDetailReport] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [equipmentList, setEquipmentList] = useState([]);


    const fetchReports = async () => {
        try {
            // const data = await TechnicalReportService.searchReports(keyword, workOrderId ? Number(workOrderId) : null, page, size);
            const data = await TechnicalReportService.searchReports(
                keyword,
                null,
                page,
                size
            );
            // Lọc theo tên thiết bị trong JSON content
            const filtered = (data.content || []).filter(r => {
                const content = r.content ? JSON.parse(r.content) : {};
                return content.equipmentReports?.some(eq =>
                    eq.equipmentName.toLowerCase().includes(deviceKeyword.toLowerCase())
                );
            });
            setReports(filtered);
            setTotalPages(data.totalPages);
        } catch {
            toast.error("Lỗi tải danh sách biên bản!");
        }
    };

    const fetchEquipments = async () => {
        try {
            const data = await searchListEquipment("", "", "", "", "", 0);
            setEquipmentList(data.data || []);
        } catch {
            toast.error("Lỗi tải danh sách thiết bị!");
        }
    };

    // useEffect(() => {
    //     fetchReports();
    //     fetchEquipments();
    // }, [page, keyword, deviceKeyword, workOrderId]);
    useEffect(() => {
        fetchReports();
        fetchEquipments();
    }, [page, keyword, deviceKeyword]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa biên bản này?")) {
            try {
                await TechnicalReportService.delete(id);
                fetchReports();
                toast.success("Xóa biên bản thành công!");
            } catch {
                toast.error("Không thể xóa biên bản!");
            }
        }
    };

    const handleEdit = (report) => {
        setSelectedReport(report);
        setShowForm(true);
    };

    const handleAdd = () => {
        setSelectedReport(null);
        setShowForm(true);
    };

    const handleViewDetail = (report) => {
        setDetailReport(report);
        setShowDetail(true);
    };

    return (
        <div>
            <h3>Danh sách Biên bản đánh giá kỹ thuật</h3>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex">
                    <input
                        type="text"
                        placeholder="Tên thiết bị"
                        value={deviceKeyword}
                        onChange={(e) => setDeviceKeyword(e.target.value)}
                        className="form-control"
                    />
                    <button onClick={fetchReports} className="btn btn-primary me-2">Tìm kiếm</button>
                    <button onClick={() => {
                        setDeviceKeyword("");
                        // setWorkOrderId("");
                        fetchReports();
                    }} className="btn btn-secondary">Quay lại
                    </button>
                </div>
                <button onClick={handleAdd} className="btn btn-success">Thêm mới</button>
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
                {reports.map((r, i) => {
                    const content = r.content ? JSON.parse(r.content) : {};
                    const firstEq = content.equipmentReports?.[0] || {};
                    const eqObj = equipmentList.find(eq => eq.id === firstEq?.equipmentId);

                    return (
                        <tr key={r.id}>
                            <td>{page * size + i + 1}</td>
                            {/*<td>{r.workOrder?.id}</td>*/}
                            <td>{r.workOrder?.code}</td>
                            {/*<td>{eqObj?.code || ""}</td>*/}
                            <td>{firstEq?.equipmentCode}</td>
                            <td>{firstEq?.equipmentName || ""}</td>
                            <td>{new Date(r.createdAt).toLocaleString()}</td>
                            <td>
                                <button className="btn btn-sm btn-primary" onClick={() => handleViewDetail(r)}>Chi
                                    tiết
                                </button>
                                {" "}
                                <button className="btn btn-sm btn-info" onClick={() => handleEdit(r)}>Sửa</button>
                                {" "}
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>Xóa
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            <div className="d-flex justify-content-center mt-3">
                <button
                    disabled={page <= 0}
                    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                    className="btn btn-secondary mx-2"
                >
                    Trang trước
                </button>
                <span className="align-self-center mx-2">
        Trang {page + 1} / {totalPages}
    </span>
                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(prev => prev + 1)}
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
                        fetchReports();
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