import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {edit, findById} from "../../../service/operations_manager/equipment/EquipmentService.js";
import {toast} from "react-toastify";
import * as Yup from "yup";
import {getListType} from "../../../service/operations_manager/equipment/EquipmentTypeService.js";
import {getListSystem} from "../../../service/operations_manager/system/SystemService.js";

const EditEquipment = () => {

    const {id} = useParams();

    const navigate = useNavigate();

    const [equipment, setEquipment] = useState({
        id:"",
        name: "",
        code: "",
        systemId: "",
        typeId: "",
        status: ""
    });
    const [types,setTypes] = useState([]);
    const [systems,setSystems] = useState([]);

    useEffect(() => {
        const fetDB = async () => {
            setSystems(await getListSystem());
            setTypes(await getListType());
        }
        fetDB();
    }, []);

    useEffect(() => {

        const fetchData = async () => {
            const init = await findById(id);
            if (init!=null){
                setEquipment({
                    ...init,
                    systemId: init.system?.id,
                    typeId: init.type?.id
                })
            }
        };

        fetchData();

    }, [id]);

    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            systemId: Number(values.systemId),
            typeId: Number(values.typeId)
        };

        const result = await edit(payload);

        if (result) {
            toast.success("Chỉnh sửa thành công");
            navigate("/equipments");
        } else {
            toast.error("Chỉnh sửa thất bại");
        }
    };

    if (equipment==null) {
        return <h3>Loading...</h3>;
    }
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
            <h1>Chỉnh sửa thiết bị</h1>

            <Formik
                initialValues={equipment}
                onSubmit={handleSubmit}
                enableReinitialize={true}
                validationSchema={validation}
            >
                <Form>
                    <Field name={'id'} type={'hidden'}/>
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
                                <option key={s.id} value={Number(s.id)}>
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
                                <option key={t.id} value={Number(t.id)}>
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
                        className="btn btn-dark mt-3"
                    >
                        Chỉnh sửa
                    </Button>

                </Form>
            </Formik>
        </>
    );
};

export default EditEquipment;