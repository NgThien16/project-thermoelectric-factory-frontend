import {useEffect, useState} from "react";
import {searchListEquipment} from "../../../service/operations_manager/equipment/EquipmentService.js";
import {Field, Form, Formik} from "formik";
import {Button, Table, Card, Row, Col} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSearch, FaPlus, FaEdit } from 'react-icons/fa';

const Equipment = () => {
    const [equipmentList,setEquipmentList] = useState([]);
    const [search,setSearch] = useState({
        name:"",
        code:"",
        status:""
    })
    const [page,setPage] = useState(1);
    const [total,setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {

            const {data,totalPage} = await searchListEquipment(
                search.name,
                search.code,
                search.status,
                page);
            setEquipmentList(data.content||[]);
            setTotal(totalPage||0);

        }
        fetchData();
    }, [search,page]);

    const handleSearch = async (value) => {
        setSearch(value);
        setPage(1);
    }

    const handleReset = async () => {
        setSearch({
            name:"",
            code:"",
            status:""
        });
        setPage(1);
    }
    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Thiết bị hệ thống</h3>
                <Link to={'/equipments/add'} className="btn btn-success d-flex align-items-center gap-2">
                    <FaPlus /> Thêm mới thiết bị
                </Link>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Formik initialValues={search} onSubmit={handleSearch}>
                        <Form>
                            <Row className="g-3">
                                <Col md={3}>
                                    <Field name={'name'} className="form-control" placeholder={'Tên thiết bị...'}/>
                                </Col>
                                <Col md={3}>
                                    <Field name={'code'} className="form-control" placeholder={'Mã KKS...'}/>
                                </Col>
                                <Col md={2}>
                                    <Field name={'status'} className="form-control" placeholder={'Trạng thái...'}/>
                                </Col>
                                <Col md={4} className="d-flex gap-2">
                                    <Button variant="primary" type={'submit'} className="d-flex align-items-center gap-2">
                                        <FaSearch /> Tìm kiếm
                                    </Button>
                                    <Button variant="outline-secondary" onClick={handleReset} type={'reset'}>
                                        Quay lại
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Formik>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0">
                        <thead className="table-light">
                        <tr>
                            <th>Tên thiết bị</th>
                            <th>Mã KKS</th>
                            <th>Hệ thống</th>
                            <th>Loại</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {equipmentList.map((e)=>(
                            <tr key={e.id}>
                                <td>
                                    <Link to={`/equipments/${e.id}`} className="text-decoration-none fw-semibold">
                                        {e.name}
                                    </Link>
                                </td>
                                <td>{e.code}</td>
                                <td>{e.systemName}</td>
                                <td>{e.type}</td>
                                <td>{e.status}</td>
                                <td>
                                    <Link to={`/equipments/edit/${e.id}`} className="btn btn-outline-primary btn-sm me-2">
                                        <FaEdit />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {equipmentList.length === 0 && (
                            <tr>
                                <td className={'text-center py-4 text-muted'} colSpan={6}>Không có dữ liệu !!!</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
                {total > 1 && (
                    <Card.Footer className="bg-white border-0 d-flex justify-content-center py-3">
                        <div className="pagination-box d-flex align-items-center gap-3">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                {"<"}
                            </Button>
                            <span className="fw-semibold">Trang {page} / {total}</span>
                            <Button
                                variant="outline-primary"
                                size="sm"
                                disabled={page === total}
                                onClick={() => setPage(page + 1)}
                            >
                                {">"}
                            </Button>
                        </div>
                    </Card.Footer>
                )}
            </Card>
        </div>
    )
}
export default Equipment;