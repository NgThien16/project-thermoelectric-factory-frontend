import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {getListSystem} from "../../../service/operations_manager/system/SystemService.js";

const SystemEquipment = () => {

    const [systemList, setSystemList] = useState([]);

    useEffect(() => {

        const fetData = async () => {
            setSystemList(await getListSystem());
        };

        fetData();

    }, []);

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold">Hệ thống thiết bị</h2>

                <Link to={'/'} className="btn btn-outline-secondary">
                    Trang chủ
                </Link>
            </div>

            <Link
                to={"/system-equipments/add"}
                className="btn btn-dark mb-3"
            >
                + Thêm mới hệ thống
            </Link>

            <div className="card shadow-sm">
                <div className="card-body p-0">

                    <table className="table table-hover table-striped mb-0">

                        <thead className="table-dark">
                        <tr>
                            <th>Tên hệ thống</th>
                            <th>Ghi chú</th>
                        </tr>
                        </thead>

                        <tbody>

                        {systemList.map((s) => (

                            <tr key={s.id} style={{cursor: "pointer"}}>

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

                        </tbody>

                    </table>

                </div>
            </div>

        </div>
    );
};

export default SystemEquipment;