import { useState, useEffect } from "react";
import { TechnicalReportService } from "../../service/technical_report/TechnicalReportService";
import TechnicalReportForm from "./TechnicalReportForm";

const TechnicalReportDetail = ({ report, onClose }) => {
    if (!report) return null;

    const parseContent = () => {
        try {
            return report?.content ? JSON.parse(report.content) : {};
        } catch {
            return {};
        }
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "";
        return new Date(dateValue).toLocaleString();
    };

    // const renderReplacements = (replacements) => {
    //     if (!replacements || replacements.length === 0) {
    //         return <span>Không có</span>;
    //     }
    //
    //     if (typeof replacements === "string") {
    //         return <div style={{ whiteSpace: "pre-line" }}>{replacements}</div>;
    //     }
    //
    //     if (Array.isArray(replacements)) {
    //         return (
    //             <ul className="mb-0">
    //                 {replacements.map((item, index) => (
    //                     <li key={index}>
    //                         {item.name || `Vật tư ID: ${item.materialId || ""}`}
    //                         {item.quantity ? ` - SL: ${item.quantity}` : ""}
    //                         {item.note ? ` - ${item.note}` : ""}
    //                     </li>
    //                 ))}
    //             </ul>
    //         );
    //     }
    //
    //     return <span>Không có</span>;
    // };

    const content = parseContent();
    const equipmentReports = content.equipmentReports || [];

    return (
        <div
            className="modal show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.3)" }}
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content p-3">
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
                        <div className="mb-3">
                            <p className="mb-1">
                                <strong>ID biên bản:</strong> {report.id}
                            </p>
                            <p className="mb-1">
                                <strong>Work Order ID:</strong> {report.workOrder?.id}
                            </p>
                            <p className="mb-1">
                                <strong>Người tạo:</strong>{" "}
                                {report.createdBy?.username || report.createdBy?.id || "Không có dữ liệu"}
                            </p>
                            <p className="mb-1">
                                <strong>Ngày tạo:</strong> {formatDate(report.createdAt)}
                            </p>
                        </div>

                        <hr />

                        <h5 className="mb-3">Danh sách thiết bị đánh giá</h5>

                        {equipmentReports.length === 0 ? (
                            <p>Không có dữ liệu thiết bị trong biên bản.</p>
                        ) : (
                            equipmentReports.map((eq, index) => (
                                <div key={index} className="border rounded p-3 mb-3">
                                    <h6 className="mb-3">Thiết bị {index + 1}</h6>

                                    <p>
                                        <strong>ID thiết bị:</strong> {eq.equipmentId || ""}
                                    </p>

                                    <p>
                                        <strong>Tên thiết bị:</strong> {eq.equipmentName || ""}
                                    </p>

                                    <p>
                                        <strong>Mô tả hư hỏng:</strong>
                                    </p>
                                    <div className="border rounded p-2 mb-2 bg-light">
                                        {eq.damageDescription || "Không có"}
                                    </div>

                                    {/*<p>*/}
                                    {/*    <strong>Nguyên nhân:</strong>*/}
                                    {/*</p>*/}
                                    {/*<div className="border rounded p-2 mb-2 bg-light">*/}
                                    {/*    {eq.cause || "Không có"}*/}
                                    {/*</div>*/}

                                    <p>
                                        <strong>Đánh giá kỹ thuật:</strong>
                                    </p>
                                    <div className="border rounded p-2 mb-2 bg-light">
                                        {eq.assessment || "Không có"}
                                    </div>

                                    <p>
                                        <strong>Phương án xử lý:</strong>
                                    </p>
                                    <div className="border rounded p-2 mb-2 bg-light">
                                        {eq.proposedSolution || "Không có"}
                                    </div>

                                    {/*<p>*/}
                                    {/*    <strong>Vật tư đề xuất:</strong>*/}
                                    {/*</p>*/}
                                    {/*<div className="border rounded p-2 bg-light">*/}
                                    {/*    {renderReplacements(eq.replacements)}*/}
                                    {/*</div>*/}
                                </div>
                            ))
                        )}

                        <hr />

                        <h5>Kết luận</h5>
                        <div className="border rounded p-3 bg-light">
                            {content.conclusion || "Không có kết luận"}
                        </div>
                    </div>

                    <div className="modal-footer">
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
    const [keyword, setKeyword] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [detailReport, setDetailReport] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const fetchReports = async () => {
        const data = await TechnicalReportService.searchReports(keyword, null, page, size);
        setReports(data.content || []);
        setTotalPages(data.totalPages || 0);
    };

    useEffect(() => {
        fetchReports();
    }, [page, keyword]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa biên bản này?")) {
            await TechnicalReportService.delete(id);
            fetchReports();
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

            <div className="mb-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />

                <button onClick={handleAdd} className="btn btn-primary ml-2">
                    Thêm mới
                </button>
            </div>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>WorkOrder</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                </tr>
                </thead>

                <tbody>
                {reports.map((r) => (
                    <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.workOrder?.id}</td>
                        <td>{new Date(r.createdAt).toLocaleString()}</td>
                        <td>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleViewDetail(r)}
                            >
                                Chi tiết
                            </button>{" "}

                            <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleEdit(r)}
                            >
                                Sửa
                            </button>{" "}

                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(r.id)}
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div>
                <button
                    disabled={page <= 0}
                    onClick={() => setPage(page - 1)}
                    className="btn btn-secondary"
                >
                    Trang trước
                </button>

                <span className="mx-2">{page + 1} / {totalPages}</span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="btn btn-secondary"
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
                />
            )}

            {showDetail && (
                <TechnicalReportDetail
                    report={detailReport}
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