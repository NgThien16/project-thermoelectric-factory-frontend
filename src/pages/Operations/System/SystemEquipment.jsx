import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {getListSystem} from "../../../service/operations_manager/system/SystemService.js";

const SystemEquipment = () => {

    const [systemList, setSystemList] = useState([]);

    useEffect(() => {

        const fetData = async () => {
            setSystemList(await getListSystem()||[]);
        };

        fetData();

    }, []);

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Hệ thống thiết bị</h3>
                <Link
                    to={"/system-equipments/add"}
                    className="btn btn-success d-flex align-items-center gap-2"
                >
                    + Thêm mới hệ thống
                </Link>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                        <tr>
                            <th>Tên hệ thống</th>
                            <th>Ghi chú</th>
                        </tr>
                        </thead>
                        <tbody>
                        {systemList.map((s) => (
                            <tr key={s.id}>
                                <td>
                                    <Link
                                        to={`/system-equipments/${s.id}/equipments`}
                                        className="text-decoration-none fw-semibold text-primary"
                                    >
                                        {s.name}
                                    </Link>
                                </td>
                                <td className="text-muted">
                                    {s.description}
                                </td>
                            </tr>
                        ))}
                        {systemList.length === 0 && (
                            <tr>
                                <td colSpan="2" className="text-center py-4 text-muted">
                                    Chưa có dữ liệu hệ thống
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SystemEquipment;