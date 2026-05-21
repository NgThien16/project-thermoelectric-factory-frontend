import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {findById} from "../../../service/operations_manager/equipment/EquipmentService.js";
import { Card, Table, Badge } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

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
        return <div className="p-4 text-center"><h3>Đ đang tải dữ liệu...</h3></div>;
    }

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Chi tiết thiết bị</h3>
                <Link to={`/equipments`} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <FaArrowLeft /> Quay lại
                </Link>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <Table bordered className="mb-0">
                        <tbody>
                        <tr>
                            <th className="bg-light" style={{ width: '250px' }}>Tên thiết bị</th>
                            <td>{equipment.name}</td>
                        </tr>

                        <tr>
                            <th className="bg-light">Mã KKS</th>
                            <td>{equipment.code}</td>
                        </tr>

                        <tr>
                            <th className="bg-light">Hệ thống</th>
                            <td>{equipment.system?.name || 'Chưa xác định'}</td>
                        </tr>

                        <tr>
                            <th className="bg-light">Loại thiết bị</th>
                            <td>{equipment.type?.name || 'Chưa xác định'}</td>
                        </tr>

                        <tr>
                            <th className="bg-light">Trạng thái</th>
                            <td>
                                <Badge bg="info" className="fw-normal">
                                    {equipment.status}
                                </Badge>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};
export default EquipmentDetail;