import {useEffect, useState} from "react";
import {
    Formik,
    Form,
    Field,
    ErrorMessage
} from "formik";

import * as Yup from "yup";

import {
    Button,
    Card,
    Col,
    Row
} from "react-bootstrap";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    findById,
    update
} from "../../../../service/materials_manager/replacement/ReplacementCategoryService.js";

import {
    ToastContainer,
    toast
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const EditReplacement = () => {

    const navigate = useNavigate();

    const {id} = useParams();

    const [initialValues, setInitialValues] = useState(null);

    // validation
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
                /^REP-[0-9]{4}$/,
                "Định dạng mã: REP-XXXX"
            ),

        unit: Yup.string()
            .required("Không được bỏ trống")
            .matches(
                /^\p{Lu}\p{L}+(?:\s\p{L}+)*$/u,
                "Yêu cầu chữ cái đầu in HOA và không chứa kí tự đặc biệt"
            ),

        description: Yup.string()
    });

    // load data
    const fetchData = async () => {

        try {

            const data = await findById(id);

            setInitialValues(data);

        } catch (e) {

            console.log(e);

            toast.error("Không tìm thấy dữ liệu!");
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // update
    const handleSubmit = async (values) => {

        try {

            const result = await update({
                ...values,
                id: id
            });

            if (result) {

                toast.success("Cập nhật thành công!");

                setTimeout(() => {

                    navigate("/replacement-materials");

                }, 1500);

            } else {

                toast.error("Cập nhật thất bại!");
            }

        } catch (e) {

            console.log(e);

            toast.error("Có lỗi xảy ra!");
        }
    }

    // loading
    if (!initialValues) {

        return <h5 className="p-4">Loading...</h5>;
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
                        Cập nhật vật tư thay thế
                    </h3>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
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
                                        <ErrorMessage name="name"/>
                                    </div>

                                </Col>

                                <Col md={6}>

                                    <label className="form-label">
                                        Mã vật tư
                                    </label>

                                    <Field
                                        name="code"
                                        className="form-control"
                                        placeholder="REP-0001"
                                    />

                                    <div className="text-danger small">
                                        <ErrorMessage name="code"/>
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
                                        <ErrorMessage name="unit"/>
                                    </div>

                                </Col>

                                <Col md={6}>

                                    <label className="form-label">
                                        Vị trí thay
                                    </label>

                                    <Field
                                        name="location"
                                        className="form-control"
                                        placeholder="Mô tả vị trí cần thay"
                                    />

                                    <div className="text-danger small">
                                        <ErrorMessage name="location"/>
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
                                    variant="warning"
                                    type="submit"
                                >
                                    Cập nhật
                                </Button>

                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => navigate("/replacement-materials")}
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

export default EditReplacement;