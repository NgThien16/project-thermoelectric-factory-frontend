import {useEffect, useState} from "react";
import {searchListEquipment} from "../../../service/operations_manager/equipment/EquipmentService.js";
import {Field, Form, Formik} from "formik";
import {Button, Table, Card, Row, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import {FaSearch, FaPlus, FaEdit, FaArrowLeft} from 'react-icons/fa';
import {getListSystem} from "../../../service/operations_manager/system/SystemService.js";
import {getListType} from "../../../service/operations_manager/equipment/EquipmentTypeService.js";
import DeleteEquipment from "./DeleteEquipment.jsx";
import {FaDeleteLeft} from "react-icons/fa6";
import ListSummaryCards from "../../../components/UI/ListSummaryCards.jsx";

const Equipment = () => {
    const [equipmentList,setEquipmentList] = useState([]);
    const [systemList,setSystemList] = useState([]);
    const [typeList,setTypeList] = useState([]);

    const [page,setPage] = useState(0);
    const [total,setTotal] = useState(0);

    const [search,setSearch] = useState({
        name:"",
        code:"",
        systemName:"",
        type:"",
        status:""
    })

    const [deleteEquipment,setDeleteEquipment] = useState({
        id:"",
        code:""
    });
    const [reload,setReload] = useState(false);
    const [isShowModal,setIsShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {

            const res = await searchListEquipment(
                search.name,
                search.code,
                search.systemName,
                search.type,
                search.status,
                page);
            setSystemList(await getListSystem()||[]);
            setTypeList(await getListType()||[]);
            setEquipmentList(res.data||[]);
            setTotal(res.totalPage||0);

        }
        fetchData();
    }, [reload,page,search]);

    const handleOpenModal = (equipment)=>{
        setDeleteEquipment(equipment);
        setIsShowModal(true);
    }

    const handleSearch = async (value) => {
        setSearch(value);
        setPage(0);
    }

    const handleReset = async () => {
        setSearch({
            name:"",
            code:"",
            systemName:"",
            type:"",
            status:""
        });
        setPage(0);
    }
    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold">Thiết bị hệ thống</h3>
                <Link to={'/equipments/add'} className="btn btn-success d-flex align-items-center gap-2">
                    <FaPlus /> Thêm mới thiết bị
                </Link>
            </div>

            <ListSummaryCards
                total={equipmentList.length}
                currentPage={page + 1}
                totalPages={total || 1}
                totalLabel="Tổng thiết bị"
            />

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Formik initialValues={search} onSubmit={handleSearch}>
                        <Form>
                            <Row className="g-3">
                                <Col md={2}>
                                    <Field name={'name'} className="form-control" placeholder={'Tên thiết bị...'}/>
                                </Col>
                                <Col md={2}>
                                    <Field name={'code'} className="form-control" placeholder={'Mã KKS...'}/>
                                </Col>
                                <Col md={2}>
                                    <Field name={'systemName'} className="form-control text-sm-center" as={'select'}>
                                        <option value={''}>--Hệ thống--</option>
                                        {systemList.map((s)=>(
                                            <option key={s.id} value={s.name}>{s.name}</option>
                                        ))}
                                    </Field>
                                </Col>
                                <Col md={2}>
                                    <Field name={'type'} className="form-control text-sm-center" as={'select'}>
                                        <option value={''}>--Loại--</option>
                                        {typeList.map((t)=>(
                                            <option key={t.id} value={t.name}>{t.name}</option>
                                        ))}
                                    </Field>
                                </Col>
                                <Col md={2}>
                                    <Field name={'status'} className="form-control" placeholder={'Trạng thái...'}/>
                                </Col>
                                <Col md={2} className="d-flex gap-2">
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
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {equipmentList.map((e)=>(
                            <tr key={e.id}>
                                <td>
                                    <Link to={`/equipments/${e.typeId}/equipment-types/${e.id}/detail`} className="text-decoration-none fw-semibold">
                                        {e.name}
                                    </Link>
                                </td>
                                <td>{e.code}</td>
                                <td>{e.status}</td>
                                <td>
                                    <Link to={`/equipments/edit/${e.id}`} className="btn btn-outline-primary btn-sm me-2">
                                        <FaEdit />
                                    </Link>
                                    <Button className={'btn btn-sm btn-danger'} onClick={()=> handleOpenModal(e)}>
                                        <FaDeleteLeft/>
                                    </Button>
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
                    <DeleteEquipment isShowModal={isShowModal}
                                     deleteEquipment={deleteEquipment}
                                     closeModal={setIsShowModal}
                                     setReload={setReload}
                    />
                </Card.Body>
                {total > 1 && (
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
                                Trang {page + 1} / {total}
                            </span>
                            <Button
                                disabled={page + 1 >= total}
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
    )
}
export default Equipment;
