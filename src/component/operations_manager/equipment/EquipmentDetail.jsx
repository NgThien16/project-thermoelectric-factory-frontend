import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {findById} from "../../../service/operations_manager/equipment/EquipmentService.js";

const EquipmentDetail = () => {

    const {id} = useParams();
    const [equipment, setEquipment] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            const res = await findById(id);
            setEquipment(res);
        };

        fetchData();

    }, [id]);

    if (!equipment) {
        return <h3>Đang tải dữ liệu...</h3>;
    }

    return (
        <div>
            <h1>Chi tiết thiết bị</h1>

            <Link to={`/system-equipments`}>
                ← Quay lại
            </Link>

            <table className="table table-bordered mt-3">

                <tbody>

                <tr>
                    <th>Tên thiết bị</th>
                    <td>{equipment.name}</td>
                </tr>

                <tr>
                    <th>Mã KKS</th>
                    <td>{equipment.code}</td>
                </tr>

                <tr>
                    <th>Hệ thống</th>
                    <td>{equipment.system?.name}</td>
                </tr>

                <tr>
                    <th>Loại thiết bị</th>
                    <td>{equipment.type?.name}</td>
                </tr>

                <tr>
                    <th>Trạng thái</th>
                    <td>{equipment.status}</td>
                </tr>

                </tbody>

            </table>
        </div>
    );
};
export default EquipmentDetail;