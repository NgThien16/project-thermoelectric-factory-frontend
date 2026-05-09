import {useEffect, useState} from "react";
import {getEquipmentsByType} from "../../../service/operations_manager/equipment/EquipmentTypeService.js";
import {Link, useParams} from "react-router-dom";

const EquipmentByType = () => {

    const {typeId} = useParams();
    const [equipments, setEquipments] = useState([]);

    useEffect(() => {

        const fetchData = async () => {

            const res = await getEquipmentsByType(typeId);
            setEquipments(res);
        };

        fetchData();

    }, [typeId]);

    return (
        <div className="container mt-4">

            <h2 className="fw-bold mb-3">Danh sách thiết bị</h2>

            <Link to={'/equipment-types'} className="btn btn-outline-secondary mb-3">
                ← Quay lại
            </Link>

            <div className="card shadow-sm">

                <div className="card-body p-0">

                    <table className="table table-hover mb-0">

                        <thead className="table-dark">
                        <tr>
                            <th>Tên thiết bị</th>
                            <th>KKS</th>
                        </tr>
                        </thead>

                        <tbody>

                        {equipments.map((e) => (

                            <tr key={e.id}>

                                <td>
                                    <Link
                                        className="text-primary fw-semibold text-decoration-none"
                                        to={`/equipment-types/${typeId}/equipments/${e.id}/detail`}
                                    >
                                        {e.name}
                                    </Link>
                                </td>

                                <td>{e.code}</td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default EquipmentByType;