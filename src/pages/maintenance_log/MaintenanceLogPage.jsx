import { useEffect, useState } from "react";
import { MaintenanceLogService } from "../../service/maintenance_log/maintenanceLogService";
import MaintenanceLogForm from "./MaintenanceLogForm";

export default function MaintenanceLogPage() {

    const [data, setData] = useState([]);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [equipmentName, setEquipmentName] = useState("");

    const [showForm, setShowForm] = useState(false);

    const fetchData = async (pageIndex = 0, name = "") => {
        const res = await MaintenanceLogService.search(pageIndex, 5, name);

        setData(res.data.content);
        setTotalPages(res.data.totalPages);
        setPage(pageIndex);
    };

    useEffect(() => {
        fetchData(0, "");
    }, []);

    const handleSearch = () => {
        fetchData(0, equipmentName);
    };

    return (
        <div>

            <h2>Lịch sử bảo trì</h2>

            {/* SEARCH */}
            <div style={{ marginBottom: 15 }}>
                <input
                    placeholder="Tìm theo tên thiết bị"
                    value={equipmentName}
                    onChange={(e) => setEquipmentName(e.target.value)}
                />

                <button onClick={handleSearch}>
                    Tìm kiếm
                </button>

                <button onClick={() => setShowForm(true)}>
                    + Tạo log
                </button>
            </div>

            {/* TABLE */}
            <table border="1" width="100%">
                <thead>
                <tr>
                    <th>Phiếu CT</th>
                    <th>Thiết bị</th>
                    <th>Mã TB</th>
                    <th>Mô tả</th>
                    <th>Ngày</th>
                </tr>
                </thead>

                <tbody>
                {data.map(item => (
                    <tr key={item.id}>
                        <td>{item.workOrderCode}</td>
                        <td>{item.equipmentName}</td>
                        <td>{item.equipmentCode}</td>
                        <td>{item.description}</td>
                        <td>{item.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* PAGINATION */}
            <div style={{ marginTop: 20 }}>
                <button
                    disabled={page === 0}
                    onClick={() => fetchData(page - 1, equipmentName)}
                >
                    Trước
                </button>

                <span> {page + 1} / {totalPages} </span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => fetchData(page + 1, equipmentName)}
                >
                    Sau
                </button>
            </div>

            {/* FORM */}
            {showForm && (
                <MaintenanceLogForm
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                        setShowForm(false);
                        fetchData(page, equipmentName);
                    }}
                />
            )}

        </div>
    );
}