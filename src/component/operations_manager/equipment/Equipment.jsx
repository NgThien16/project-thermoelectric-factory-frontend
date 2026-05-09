import {useEffect, useState} from "react";
import {searchListEquipment} from "../../../service/operations_manager/equipment/EquipmentService.js";
import {Field, Form, Formik} from "formik";
import {Button} from "react-bootstrap";
import { Link } from "react-router-dom";

const SystemEquipment = () => {
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
        <>
            <h1>Thiết bị hệ thống</h1>
            <Link to={'/'}>Trang chủ</Link>
            <Link to={'/equipments/add'}>Thêm mới thiết bị</Link>
            <Formik initialValues={search} onSubmit={handleSearch}>
                <Form>
                    <Field name={'name'} placeholder={'Nhập thiệt bị...'}/>
                    <Field name={'code'} placeholder={'Nhập mã kks...'}/>
                    <Field name={'status'} placeholder={'Nhập trạng thái...'}/>

                    <Button className={'btn btn-sm'} type={'submit'}>Tìm kiếm</Button>
                    <Button className={'btn btn-sm btn-dark'} onClick={handleReset} type={'reset'}>Quay lại</Button>
                </Form>
            </Formik>
            <table>
                <thead>
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
                        <td>{e.name}</td>
                        <td>{e.code}</td>
                        <td>{e.systemName}</td>
                        <td>{e.type}</td>
                        <td>{e.status}</td>
                        <td>
                            <Link to={`/equipments/edit/${e.id}`}>
                                Chỉnh sửa
                            </Link>
                        </td>
                    </tr>
                ))}
                {equipmentList.length==0 ?
                    <tr>
                        <td className={'text-danger'} colSpan={5}><b>Không có dữ liệu !!!</b></td>
                    </tr>
                    : ""
                }
                <tr>
                    <td colSpan={5}>
                        <div className="pagination-box">
                            <button
                                className="btn btn-sm btn-primary"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                {"<"}
                            </button>

                            <span className="mx-2">
              Trang {page} / {total}
            </span>

                            <button
                                className="btn btn-sm btn-dark"
                                disabled={page === total}
                                onClick={() => setPage(page + 1)}
                            >
                                {">"}
                            </button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </>
    )
}
export default SystemEquipment;