import {Field, Form, Formik} from "formik";
import {useEffect, useState} from "react";
import {searchEquipmentType} from "../../../service/operations_manager/equipment/EquipmentTypeService.js";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import {getListDomain} from "../../../service/operations_manager/domain/DomainService.js";

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
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold">Danh sách loại thiết bị</h2>

                <Link to={'/'} className="btn btn-outline-secondary">
                    Trang chủ
                </Link>
            </div>

            <Link
                to={"/equipment-types/create"}
                className={"btn btn-dark mb-3"}
            >
                + Thêm mới
            </Link>

            <div className="card mb-3 shadow-sm">
                <div className="card-body">

                    <Formik
                        initialValues={search}
                        onSubmit={handleSearch}
                    >

                        <Form className={"d-flex gap-2"}>

                            <Field
                                name={"name"}
                                className={"form-control"}
                                placeholder={"Tên loại thiết bị"}
                            />

                            <Field as={'select'} name={'domain'} className={"form-control"}>
                                <option value={''}>---Lĩnh vực---</option>
                                {domains.map((d)=>(
                                    <option key={d.id} value={d.name}>{d.name}</option>
                                ))}
                            </Field>

                            <Button type={"submit"} className={"btn btn-primary"}>
                                Tìm
                            </Button>

                            <Button
                                type={"button"}
                                onClick={handleReset}
                                className={"btn btn-secondary"}
                            >
                                Hủy
                            </Button>

                        </Form>

                    </Formik>

                </div>
            </div>

            <div className="card shadow-sm">

                <div className="card-body p-0">

                    <table className={"table table-hover mb-0"}>

                        <thead className="table-dark">

                        <tr>
                            <th>Tên loại thiết bị</th>
                            <th>Lĩnh vực</th>
                        </tr>

                        </thead>

                        <tbody>

                        {
                            types.map((t) => (

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

                            ))
                        }

                        </tbody>

                    </table>

                </div>

            </div>

            <div className="d-flex justify-content-center align-items-center gap-3 mt-3">

                <Button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    variant="secondary"
                >
                    ← Trước
                </Button>

                <span className="fw-semibold">
                    Trang {page + 1} / {totalPages}
                </span>

                <Button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                    variant="secondary"
                >
                    Sau →
                </Button>

            </div>

        </div>
    );
};

export default EquipmentTypeList;