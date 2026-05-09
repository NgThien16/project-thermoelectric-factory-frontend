import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {save} from "../../../service/operations_manager/equipment/EquipmentService.js";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import {getListType} from "../../../service/operations_manager/equipment/EquipmentTypeService.js";
import {getListSystem} from "../../../service/operations_manager/system/SystemService.js";
import * as Yup from "yup";


const AddEquipment = () => {

    const navigate = useNavigate();

    const initialValues = {
        name: "",
        code: "",
        systemId: "",
        typeId: "",
        status: ""
    };

    const [types,setTypes] = useState([]);
    const [systems,setSystems] = useState([]);
    useEffect(() => {
        const fetData = async ()=>{
            setTypes(await getListType());
            setSystems(await getListSystem());
        }
        fetData();
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

    const validation = Yup.object(
        {
            name:Yup.string().required("Không được bỏ trống")
                .matches(/^[\p{Lu}][\p{L}]+(\s[\p{L}]+)*$/u,"Yêu cầu chữ cái đầu in HOA và không chứa kí tự đặc biệt"),
            code:Yup.string().required("Mã không được bỏ trống")
                .matches(/^KKS-[0-9]{4}$/,"Định dạng mã: KKS-XXXX với X là các số từ 0 đến 9"),
            systemId:Yup.number().required("Không được bỏ trống"),
            typeId:Yup.number().required("Không được bỏ trống"),
            status:Yup.string().required("Không được bỏ trống")
                .matches(/^[\p{Lu}][\p{L}]+(\s[\p{L}]+)*$/u,"Yêu cầu chữ cái đầu in HOA và không chứa kí tự đặc biệt")
        }
    );
    return (
        <>
            <h1>Thêm mới thiết bị</h1>

            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validation}
            >
                <Form>

                    <div>
                        <label>Tên thiết bị</label>
                        <Field
                            name="name"
                            className="form-control"
                        />
                        <ErrorMessage name={'name'} className={'text-danger'} component={'small'}/>
                    </div>

                    <div>
                        <label>Mã KKS</label>
                        <Field
                            name="code"
                            className="form-control"
                        />
                        <ErrorMessage name={'code'} className={'text-danger'} component={'small'}/>
                    </div>

                    <div>
                        <Field as="select" name="systemId" className="form-control">
                            <option value="">---Hệ thống---</option>
                            {systems.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </Field>
                        <ErrorMessage name={'systemId'} className={'text-danger'} component={'small'}/>
                    </div>

                    <div>
                        <Field as="select" name="typeId" className="form-control">
                            <option value="">---Loại---</option>
                            {types.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </Field>
                        <ErrorMessage name={'typeId'} className={'text-danger'} component={'small'}/>
                    </div>

                    <div>
                        <label>Trạng thái</label>
                        <Field
                            name="status"
                            className="form-control"
                        />
                        <ErrorMessage name={'status'} className={'text-danger'} component={'small'}/>
                    </div>

                    <Button
                        type="submit"
                        className="btn btn-primary mt-3"
                    >
                        Thêm mới
                    </Button>

                </Form>
            </Formik>
        </>
    );
};

export default AddEquipment;