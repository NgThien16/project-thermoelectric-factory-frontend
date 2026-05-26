import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {getDetail} from "../../../service/operations_manager/equipment/EquipmentService.js";

const TypeDetail = () => {

    const {typeId, equipmentId} = useParams();
    const [detail, setDetail] = useState(null);

    useEffect(() => {

        const fetchData = async () => {

            const res = await getDetail(typeId, equipmentId);
            setDetail(res);
        };

        fetchData();

    }, [typeId, equipmentId]);

    if (!detail) {
        return <h4 className="text-center mt-4">Đang tải dữ liệu...</h4>;
    }

    return (
        <div className="container mt-4">

            <h2 className="fw-bold mb-3">Chi tiết thiết bị <span className={'text-danger'}>--{detail.name}--</span></h2>

            <div className="card shadow-sm mb-3">

                <div className="card-body">

                    <div><b>Loại thiết bị:</b> {detail.type}</div>
                    <div><b>Mã KKS:</b> {detail.kks}</div>

                </div>

            </div>

            <div className="card shadow-sm">

                <div className="card-body p-0">

                    <table className="table table-striped mb-0">

                        <thead className="table-dark">
                        <tr>
                            <th>Thông số</th>
                            <th>Đơn vị</th>
                            <th>Giá trị</th>
                        </tr>
                        </thead>

                        <tbody>

                        {detail.parameters.map((d,i) => (

                            <tr key={i}>
                                <td>{d.parameter}</td>
                                <td>{d.unit}</td>
                                <td>{d.value}</td>
                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

            </div>

            <Link
                className="btn btn-outline-secondary mt-3"
                to={`/equipments`}
            >
                ← Quay lại
            </Link>

        </div>
    );
};

export default TypeDetail;