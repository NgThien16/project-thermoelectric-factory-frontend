import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {save} from "../../../service/operations_manager/equipment/EquipmentService.js";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import {getListType} from "../../../service/operations_manager/equipment/EquipmentTypeService.js";
import {getListSystem} from "../../../service/operations_manager/system/SystemService.js";
import * as Yup from "yup";
import {getParametersByType} from "../../../service/operations_manager/equipment/ParameterDefinitionService.js";

const AddEquipment = () => {

    const navigate = useNavigate();

    const [types, setTypes] = useState([]);
    const [systems, setSystems] = useState([]);
    const [parameters, setParameters] = useState([]);

    const initialValues = {
        name: "",
        code: "",
        systemId: "",
        typeId: "",
        status: "",
        parameters: []
    };

    useEffect(() => {

        const fetchData = async () => {

            setTypes(await getListType());

            setSystems(await getListSystem());

        };

        fetchData();

    }, []);

    const handleSubmit = async (values) => {

        const result = await save(values);

        if (result) {

            toast.success("Thêm mới thành công");

            navigate("/equipments");

        } else {

            toast.error("Thêm mới thất bại");

        }
    };

    const validation = Yup.object({

        name: Yup.string()
            .required("Không được bỏ trống")
            .matches(
                /^[\p{Lu}][\p{L}]+(\s[\p{L}]+)*$/u,
                "Yêu cầu chữ cái đầu in HOA và không chứa kí tự đặc biệt"
            ),

        code: Yup.string()
            .required("Mã không được bỏ trống")
            .matches(
                /^KKS-[0-9]{4}$/,
                "Định dạng mã: KKS-XXXX với X là số"
            ),

        systemId: Yup.string()
            .required("Không được bỏ trống"),

        typeId: Yup.string()
            .required("Không được bỏ trống"),

        status: Yup.string()
            .required("Không được bỏ trống")
            .matches(
                /^[\p{Lu}][\p{L}]+(\s[\p{L}]+)*$/u,
                "Yêu cầu chữ cái đầu in HOA và không chứa kí tự đặc biệt"
            )

    });


    return (

        <div className="container mt-4">

            <h2 className="fw-bold mb-3">
                Thêm mới thiết bị
            </h2>

            <div className="card shadow-sm">

                <div className="card-body">

                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={validation}
                    >

                        {({setFieldValue}) => (

                            <Form>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Tên thiết bị
                                    </label>

                                    <Field
                                        name="name"
                                        className="form-control"
                                    />

                                    <ErrorMessage
                                        name="name"
                                        component="small"
                                        className="text-danger"
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Mã KKS
                                    </label>

                                    <Field
                                        name="code"
                                        className="form-control"
                                    />

                                    <ErrorMessage
                                        name="code"
                                        component="small"
                                        className="text-danger"
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Hệ thống
                                    </label>

                                    <Field
                                        as="select"
                                        name="systemId"
                                        className="form-control"
                                    >

                                        <option value="">
                                            ---Chọn---
                                        </option>

                                        {
                                            systems.map((s) => (

                                                <option
                                                    key={s.id}
                                                    value={s.id}
                                                >
                                                    {s.name}
                                                </option>

                                            ))
                                        }

                                    </Field>

                                    <ErrorMessage
                                        name="systemId"
                                        component="small"
                                        className="text-danger"
                                    />

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Loại thiết bị
                                    </label>

                                    <Field
                                        as="select"
                                        name="typeId"
                                        className="form-control"
                                        onChange={async (e) => {

                                            const value = e.target.value;

                                            setFieldValue(
                                                "typeId",
                                                value
                                            );

                                            if (value) {

                                                const data =
                                                    await getParametersByType(value);

                                                setParameters(data);

                                                const mapped = data.map((p) => ({
                                                    parameterId: p.id,
                                                    value: ""
                                                }));

                                                setFieldValue(
                                                    "parameters",
                                                    mapped
                                                );

                                            } else {

                                                setParameters([]);

                                                setFieldValue(
                                                    "parameters",
                                                    []
                                                );

                                            }

                                        }}
                                    >

                                        <option value="">
                                            ---Chọn---
                                        </option>

                                        {
                                            types.map((t) => (

                                                <option
                                                    key={t.id}
                                                    value={t.id}
                                                >
                                                    {t.name}
                                                </option>

                                            ))
                                        }

                                    </Field>

                                    <ErrorMessage
                                        name="typeId"
                                        component="small"
                                        className="text-danger"
                                    />

                                </div>

                                {
                                    parameters.length > 0 && (

                                        <div className="mb-4">

                                            <div className="card border shadow-sm">

                                                <div className="card-header bg-dark text-white">

                                                    <h5 className="mb-0 text-sm-center">
                                                        Bảng thông số thiết bị
                                                    </h5>

                                                </div>

                                                <div className="card-body p-0">

                                                    <table className="table table-bordered table-hover mb-0">

                                                        <thead className="table-light">

                                                        <tr>
                                                            <th style={{width: "40%"}}>
                                                                Thông số
                                                            </th>

                                                            <th style={{width: "20%"}}>
                                                                Đơn vị
                                                            </th>

                                                            <th>
                                                                Giá trị
                                                            </th>
                                                        </tr>

                                                        </thead>

                                                        <tbody>

                                                        {
                                                            parameters.map((p, index) => (

                                                                <tr key={p.id}>

                                                                    <td className="fw-semibold">
                                                                        {p.name}
                                                                    </td>

                                                                    <td>
                                                                        {p.unit}
                                                                    </td>

                                                                    <td>

                                                                        <Field
                                                                            name={`parameters.${index}.value`}
                                                                            className="form-control"
                                                                            placeholder={`Nhập ${p.name}`}
                                                                        />

                                                                    </td>

                                                                </tr>

                                                            ))
                                                        }

                                                        </tbody>

                                                    </table>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                }

                                <div className="mb-3">

                                    <label className="form-label">
                                        Trạng thái
                                    </label>

                                    <Field
                                        name="status"
                                        className="form-control"
                                    />

                                    <ErrorMessage
                                        name="status"
                                        component="small"
                                        className="text-danger"
                                    />

                                </div>

                                <div className="d-flex gap-2 mt-4">

                                    <Button
                                        type="submit"
                                        className="btn btn-dark"
                                    >
                                        Lưu
                                    </Button>

                                    <Link
                                        to={"/equipments"}
                                        className="btn btn-outline-secondary"
                                    >
                                        Quay lại
                                    </Link>

                                </div>

                            </Form>

                        )}

                    </Formik>

                </div>

            </div>

        </div>
    );
};

export default AddEquipment;