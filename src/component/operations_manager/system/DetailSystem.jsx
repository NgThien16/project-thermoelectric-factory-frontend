import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {detailSystem} from "../../../service/operations_manager/system/SystemService.js";

const DetailSystem = () => {

    const {id} = useParams();
    const [equipments, setEquipments] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            setEquipments(await detailSystem(id));
        };

        fetchData();

    }, [id]);

    return (
        <div className="container mt-4">

            <h2 className="fw-bold mb-3">Danh sách thiết bị trong hệ thống</h2>

            <div className="mb-3 d-flex gap-2">
                <Link to={'/system-equipments'} className="btn btn-outline-secondary">
                    ← Quay lại
                </Link>

                <Link
                    to={`/system-equipments/${id}/add-equipment`}
                    className="btn btn-dark"
                >
                    + Thêm thiết bị
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body p-0">

                    <table className="table table-hover mb-0">

                        <thead className="table-dark">
                        <tr>
                            <th>Tên</th>
                            <th>Mã KKS</th>
                            <th>Trạng thái</th>
                        </tr>
                        </thead>

                        <tbody>

                        {equipments.map((e) => (

                            <tr key={e.id}>

                                <td>
                                    <Link
                                        to={`/equipments/${e.id}`}
                                        className="text-primary fw-semibold text-decoration-none"
                                    >
                                        {e.name}
                                    </Link>
                                </td>

                                <td>{e.code}</td>

                                <td>
                                    <span className="badge bg-secondary">
                                        {e.status}
                                    </span>
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

export default DetailSystem;