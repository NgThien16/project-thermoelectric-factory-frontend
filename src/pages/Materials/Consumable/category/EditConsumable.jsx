import {useEffect, useState} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
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
} from "../../../../service/materials_manager/consumable/ConsumableCategoryService.js";

import {
    ToastContainer,
    toast
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const EditConsumable = () => {

    const navigate = useNavigate();

    const {id} = useParams();

    const [initialValues, setInitialValues] = useState(null);
    const [saving, setSaving] = useState(false);


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

    // submit
    const handleSubmit = async (values) => {

        try {

            setSaving(true);

            const result = await update({
                ...values,
                id: id
            });

            if (result) {

                toast.success("Cập nhật thành công!");

                setTimeout(() => {
                    navigate("/consumable-materials");
                }, 1500);

            } else {

                toast.error("Cập nhật thất bại!");
            }

        } catch (e) {

            console.log(e);

            toast.error("Có lỗi xảy ra!");

        } finally {

            setSaving(false);
        }
    };

    // loading
    if (!initialValues) {

        return (
            <div className="text-center py-5">
                <div
                    className="spinner-border text-warning"
                    role="status"
                />
                <p className="mt-3">
                    Đang tải dữ liệu vật tư...
                </p>
            </div>
        );
    }

    return (

        <div className="p-4">

            <ToastContainer
                position="top-right"
                autoClose={2000}
            />

            <Card className="border-0 shadow-sm">

                <Card.Body>

                    <Card.Header
                        className="text-white"
                        style={{
                            background:
                                "linear-gradient(135deg,#fd7e14,#ffc107)"
                        }}
                    >
                        <h3 className="fw-bold mb-1">
                            ✏️ Cập nhật vật tư tiêu hao
                        </h3>

                        <small>
                            Chỉnh sửa thông tin danh mục vật tư
                        </small>
                    </Card.Header>

                    <Card
                        className="mb-4 border-0 bg-light"
                    >
                        <Card.Body>

                            <h6 className="fw-bold">
                                📌 Thông tin chỉnh sửa
                            </h6>

                            <ul className="mb-0">
                                <li>Mã vật tư phải đúng định dạng CON-0001</li>
                                <li>Tên vật tư viết hoa chữ cái đầu</li>
                                <li>Kiểm tra kỹ trước khi cập nhật</li>
                            </ul>

                        </Card.Body>
                    </Card>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                    >

                        <Form>

                            <Row className="g-3">

                                <Col md={6}>

                                    <label className="form-label fw-semibold">
                                        📦 Tên vật tư
                                        <span className="text-danger">*</span>
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

                                    <label className="form-label fw-semibold">
                                        🔖 Mã vật tư
                                        <span className="text-danger">*</span>
                                    </label>

                                    <Field
                                        name="code"
                                        className="form-control"
                                        placeholder="CON-0001"
                                    />

                                    <div className="text-danger small">
                                        <ErrorMessage name="code"/>
                                    </div>

                                </Col>

                                <Col md={6}>

                                    <label className="form-label fw-semibold">
                                        📏 Đơn vị
                                        <span className="text-danger">*</span>
                                    </label>

                                    <Field
                                        name="unit"
                                        className="form-control"
                                    />

                                    <div className="text-danger small">
                                        <ErrorMessage name="unit"/>
                                    </div>

                                </Col>

                                <Col md={12}>

                                    <label className="form-label fw-semibold">
                                        📝 Mô tả
                                    </label>

                                    <Field
                                        as="textarea"
                                        rows={4}
                                        name="description"
                                        className="form-control"
                                    />

                                </Col>

                            </Row>

                            <div className="mt-4 d-flex justify-content-end gap-2">

                                <Button
                                    variant="warning"
                                    size="lg"
                                    type="submit"
                                    disabled={saving}
                                >
                                    {
                                        saving
                                            ? "⏳ Đang cập nhật..."
                                            : "💾 Cập nhật"
                                    }
                                </Button>

                                <Button
                                    variant="outline-secondary"
                                    size="lg"
                                    type="button"
                                    onClick={() => navigate("/consumable-materials")}
                                >
                                    ↩ Quay lại
                                </Button>

                            </div>

                        </Form>

                    </Formik>

                </Card.Body>

            </Card>

        </div>
    )
}

export default EditConsumable;