import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Card, Table, Badge, Button, Row, Col} from 'react-bootstrap';
import {FaArrowLeft, FaPlus, FaSearch} from 'react-icons/fa';
import {Field, Form, Formik} from "formik";
import {getListDomain} from "../../../service/operations_manager/domain/DomainService.js";
import {detailSystem} from "../../../service/operations_manager/system/SystemService.js";

const DetailSystem = () => {

    const {id} = useParams();
    const [equipments, setEquipments] = useState([]);

    const [domain,setDomain] = useState([]);
    const [page,setPage] = useState(1);
    const [total,setTotal] = useState(0);

    const [search,setSearch] = useState({
        name:"",
        code:"",
        domain:""
    })
    const renderStatusBadge = (status, statusDisplay) => {
        switch (status) {
            case "DANG_VAN_HANH":
                return <Badge bg="info">{statusDisplay}</Badge>;
            case "DANG_SUA_CHUA":
                return <Badge bg="primary">{statusDisplay}</Badge>;
            case "DANG_DONG":
                return <Badge bg="warning">{statusDisplay}</Badge>;
            default:
                return <Badge bg="dark">{statusDisplay}</Badge>;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const {data,totalPage} = await detailSystem(
                id,
                search.name,
                search.code,
                search.domain,
                page);
            setDomain(await getListDomain());
            setEquipments(data.content||[]);
            setTotal(totalPage||0);

        }
        fetchData();
    }, [id,search,page]);

    const handleSearch = async (value) => {
        setSearch(value);
        setPage(1);
    }

    const handleReset = async () => {
        setSearch({
            name:"",
            code:"",
            domain:""
        });
        setPage(1);
    }

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Thiết bị trong hệ thống <span className={'text-danger'}>--{equipments[0]?.systemName}--</span></h3>
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
                                    <Field name={'domain'} className="form-control text-sm-center" as={'select'}>
                                        <option value={''}>--Lĩnh vực--</option>
                                        {domain.map((d)=>(
                                            <option key={d.id} value={d.name}>{d.name}</option>
                                        ))}
                                    </Field>
                                </Col>
                                <Col md={4} className="d-flex gap-2">
                                    <Button variant="primary" type={'submit'} className="d-flex align-items-center gap-2">
                                        <FaSearch />
                                    </Button>
                                    <Button variant="outline-secondary" onClick={handleReset} type={'reset'}>
                                        <FaArrowLeft />
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
                            <th>Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        {equipments.map((e) => (
                            <tr key={e.id}>
                                <td>
                                    <Link
                                        to={`/equipments/${e.typeId}/equipment-types/${e.id}/detail`}
                                        className="text-primary fw-semibold text-decoration-none"
                                    >
                                        {e.name}
                                    </Link>
                                </td>
                                <td>{e.code}</td>
                                <td>{renderStatusBadge(e.status, e.statusDisplay)}</td>
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
    );
};

export default DetailSystem;