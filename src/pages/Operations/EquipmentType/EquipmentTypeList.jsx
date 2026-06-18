import {Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {searchEquipmentType} from "../../../service/operations_manager/equipment/EquipmentTypeService.js";
import {Link} from "react-router-dom";
import {Button, Card, Row, Col, Table} from "react-bootstrap";
import {getListDomain} from "../../../service/operations_manager/domain/DomainService.js";
import {FaSearch, FaPlus, FaArrowLeft} from 'react-icons/fa';
import ListSummaryCards from "../../../components/UI/ListSummaryCards.jsx";

const EquipmentTypeList = () => {

    const [types, setTypes] = useState([]);
    const [domains, setDomains] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [search, setSearch] = useState({
        name: "",
        domain: ""
    });


    useEffect(() => {

        const fetchData = async () => {

            const res = await searchEquipmentType(
                search.name,
                search.domain,
                page
            );
            setDomains(await getListDomain());

            setTypes(res.data);
            setTotalPages(res.totalPages);
        };

        fetchData();

    }, [page, search]);

    const handleSearch = (values) => {
        setSearch(values);
        setPage(0);
    };

    const handleReset = () => {

        setSearch({
            name: "",
            domain: ""
        });

        setPage(0);
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Danh sách loại thiết bị</h3>
                <Link
                    to={"/equipment-types/create"}
                    className={"btn btn-success d-flex align-items-center gap-2"}
                >
                    <FaPlus /> Thêm mới
                </Link>
            </div>

            <ListSummaryCards
                total={types.length}
                currentPage={page + 1}
                totalPages={totalPages || 1}
                totalLabel="Tổng loại thiết bị"
            />

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Formik
                        initialValues={search}
                        enableReinitialize={true}
                        onSubmit={handleSearch}
                    >
                        <Form>
                            <Row className="g-3">
                                <Col md={5}>
                                    <Field
                                        name={"name"}
                                        className={"form-control"}
                                        placeholder={"Tên loại thiết bị"}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Field as={'select'} name={'domain'} className={"form-control"}>
                                        <option value={''}>---Lĩnh vực---</option>
                                        {domains.map((d)=>(
                                            <option key={d.id} value={d.name}>{d.name}</option>
                                        ))}
                                    </Field>
                                </Col>
                                <Col md={3} className="d-flex gap-2">
                                    <Button type={"submit"} className={"btn btn-primary d-flex align-items-center gap-2"}>
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
                            <th>Tên loại thiết bị</th>
                            <th>Lĩnh vực</th>
                        </tr>
                        </thead>
                        <tbody>
                        {types.map((t) => (
                            <tr key={t.id}>
                                <td>
                                    <Link
                                        className="fw-semibold text-primary text-decoration-none"
                                        to={`/equipment-types/${t.id}/equipments`}
                                    >
                                        {t.name}
                                    </Link>
                                </td>
                                <td>{t.domain}</td>
                            </tr>
                        ))}
                        {types.length === 0 && (
                            <tr>
                                <td colSpan="2" className="text-center py-4 text-muted">
                                    Không tìm thấy loại thiết bị nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
                {totalPages > 1 && (
                    <Card.Footer className="bg-white border-0 d-flex justify-content-center py-3">
                        <div className="pagination-box d-flex align-items-center gap-3">
                            <Button
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                variant="outline-primary"
                                size="sm"
                            >
                                ← Trước
                            </Button>
                            <span className="fw-semibold">
                                Trang {page + 1} / {totalPages}
                            </span>
                            <Button
                                disabled={page + 1 >= totalPages}
                                onClick={() => setPage(page + 1)}
                                variant="outline-primary"
                                size="sm"
                            >
                                Sau →
                            </Button>
                        </div>
                    </Card.Footer>
                )}
            </Card>
        </div>
    );
};

export default EquipmentTypeList;
