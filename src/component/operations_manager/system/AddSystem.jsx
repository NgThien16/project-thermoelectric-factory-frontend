import {ErrorMessage, Field, Form, Formik} from "formik";
import {Button} from "react-bootstrap";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import {saveSystem} from "../../../service/operations_manager/system/SystemService.js";

const AddSystem = () => {

    const navigate = useNavigate();

    const initValue = {
        name: "",
        description: ""
    };

    const validation = Yup.object({
        name: Yup.string().required("Không được bỏ trống")
            .matches(/^[\p{Lu}][\p{L}]+(\s[\p{L}]+)*$/u,
                "Yêu cầu chữ cái đầu in HOA và không chứa kí tự đặc biệt"
            )
    });

    const handleSubmit = async (values) => {

        const result = await saveSystem(values);

        if (result) {
            toast.success("Thêm mới thành công");
            navigate("/system-equipments");
        } else {
            toast.error("Thêm mới thất bại");
        }
    };

    return (
        <div className="container mt-4">

            <h2 className="fw-bold mb-3">Thêm mới hệ thống</h2>

            <div className="card shadow-sm">
                <div className="card-body">

                    <Formik
                        initialValues={initValue}
                        onSubmit={handleSubmit}
                        validationSchema={validation}
                    >
                        <Form>

                            <div className="mb-3">
                                <label className="form-label">Tên hệ thống</label>

                                <Field
                                    name="name"
                                    className="form-control"
                                />

                                <ErrorMessage
                                    name="name"
                                    className="text-danger"
                                    component="small"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Ghi chú</label>

                                <Field
                                    name="description"
                                    className="form-control"
                                />
                            </div>

                            <div className="d-flex gap-2 mt-3">

                                <Button type="submit" className="btn btn-dark">
                                    Lưu
                                </Button>

                                <Link to={'/system-equipments'} className="btn btn-outline-secondary">
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

export default AddSystem;