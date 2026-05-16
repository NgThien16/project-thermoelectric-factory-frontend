import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { save } from "../../../../service/materials_manager/consumable/ConsumableService.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddConsumable = () => {

    const navigate = useNavigate();

    const initialValues = {
        name: "",
        code: "",
        unit: "",
        location: "",
        description: ""
    };

    const validationSchema = Yup.object({

        name: Yup.string()
            .required("Không được bỏ trống")
            .matches(
                /^\p{Lu}\p{L}+(?:\s\p{L}+)*$/u,
                "Yêu cầu chữ cái đầu in HOA và không chứa kí tự đặc biệt"
            ),

        code: Yup.string()
            .required("Không được bỏ trống")
            .matches(
                /^CON-[0-9]{4}$/,
                "Định dạng mã: CON-XXXX"
            ),

        unit: Yup.string()
            .required("Không được bỏ trống")
            .matches(
                /^\p{Lu}\p{L}+(?:\s\p{L}+)*$/u,
                "Yêu cầu chữ cái đầu in HOA và không chứa kí tự đặc biệt"
            ),

        description: Yup.string()
    });

    const handleSubmit = async (values) => {

        try {

            const result = await save(values);

            if (result) {

                toast.success("Thêm mới thành công!");

                setTimeout(() => {
                    navigate("/consumable-materials");
                }, 1500);

            } else {

                toast.error("Thêm mới thất bại!");

            }

        } catch (e) {

            toast.error("Có lỗi xảy ra!");

            console.log(e);
        }
    }

    return (

        <div className="p-4">

            <ToastContainer
                position="top-right"
                autoClose={2000}
            />

            <Card className="border-0 shadow-sm">

                <Card.Body>

                    <h3 className="fw-bold mb-4">
                        Thêm mới vật tư tiêu hao
                    </h3>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >

                        <Form>

                            <Row className="g-3">

                                <Col md={6}>

                                    <label className="form-label">
                                        Tên vật tư
                                    </label>

                                    <Field
                                        name="name"
                                        className="form-control"
                                    />

                                    <div className="text-danger small">
                                        <ErrorMessage name="name" />
                                    </div>

                                </Col>

                                <Col md={6}>

                                    <label className="form-label">
                                        Mã vật tư
                                    </label>

                                    <Field
                                        name="code"
                                        className="form-control"
                                        placeholder="CON-0001"
                                    />

                                    <div className="text-danger small">
                                        <ErrorMessage name="code" />
                                    </div>

                                </Col>

                                <Col md={6}>

                                    <label className="form-label">
                                        Đơn vị
                                    </label>

                                    <Field
                                        name="unit"
                                        className="form-control"
                                    />

                                    <div className="text-danger small">
                                        <ErrorMessage name="unit" />
                                    </div>

                                </Col>

                                <Col md={12}>

                                    <label className="form-label">
                                        Mô tả
                                    </label>

                                    <Field
                                        as="textarea"
                                        rows={4}
                                        name="description"
                                        className="form-control"
                                    />

                                </Col>

                            </Row>

                            <div className="mt-4 d-flex gap-2">

                                <Button
                                    variant="success"
                                    type="submit"
                                >
                                    Thêm mới
                                </Button>

                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => navigate("/consumable-materials")}
                                >
                                    Quay lại
                                </Button>

                            </div>

                        </Form>

                    </Formik>

                </Card.Body>

            </Card>

        </div>
    )
}

export default AddConsumable;