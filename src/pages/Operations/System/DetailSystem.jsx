import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {detailSystem} from "../../../service/operations_manager/system/SystemService.js";
import { Button, Card, Table, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';

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
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Thiết bị trong hệ thống</h3>
                <div className="d-flex gap-2">
                    <Link to={'/system-equipments'} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                        <FaArrowLeft /> Quay lại
                    </Link>

                    <Link
                        to={`/system-equipments/${id}/add-equipment`}
                        className="btn btn-success d-flex align-items-center gap-2"
                    >
                        <FaPlus /> Thêm thiết bị
                    </Link>
                </div>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0">
                        <thead className="table-light">
                        <tr>
                            <th>Tên thiết bị</th>
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
                                    <Badge bg="secondary" className="fw-normal">
                                        {e.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                        {equipments.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-muted">
                                    Không có thiết bị nào trong hệ thống này
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
};

export default DetailSystem;