import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {Button} from "react-bootstrap";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {saveEquipmentType} from "../../../service/operations_manager/equipment/EquipmentTypeService.js";
import {getListDomain} from "../../../service/operations_manager/domain/DomainService.js";

const AddEquipmentType = () => {

    const [domains, setDomains] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {
            setDomains(await getListDomain());
        };

        fetchData();

    }, []);

    const init = {
        name: "",
        domainId: ""
    };

    const validation = Yup.object({

        name: Yup.string()
            .required("Không được bỏ trống")
            .matches(/^[\p{Lu}][\p{L}]+(\s[\p{L}]+)*$/u,
                "Chữ cái đầu viết hoa"
            ),

        domainId: Yup.number()
            .required("Không được bỏ trống")
    });

    const handleSubmit = async (values) => {

        const payload = {
            ...values,
            domainId: Number(values.domainId)
        };

        const result = await saveEquipmentType(payload);

        if (result) {
            toast.success("Thêm mới thành công");
            navigate("/equipment-types");
        } else {
            toast.error("Thêm mới thất bại");
        }
    };

    return (
        <div className="container mt-4">

            <h2 className="fw-bold mb-3">Thêm loại thiết bị</h2>

            <div className="card shadow-sm">

                <div className="card-body">

                    <Formik
                        initialValues={init}
                        onSubmit={handleSubmit}
                        validationSchema={validation}
                    >

                        <Form>

                            <div className="mb-3">
                                <label className="form-label">Tên loại</label>

                                <Field name="name" className="form-control"/>

                                <ErrorMessage name="name" component="small" className="text-danger"/>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Lĩnh vực</label>

                                <Field as="select" name="domainId" className="form-control">

                                    <option value="">-- Chọn --</option>

                                    {domains.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.name}
                                        </option>
                                    ))}

                                </Field>

                                <ErrorMessage name="domainId" component="small" className="text-danger"/>
                            </div>

                            <div className="d-flex gap-2">

                                <Button type="submit" className="btn btn-dark">
                                    Lưu
                                </Button>

                                <Link to="/equipment-types" className="btn btn-secondary">
                                    Hủy
                                </Link>

                            </div>

                        </Form>

                    </Formik>

                </div>

            </div>

        </div>
    );
};

export default AddEquipmentType;