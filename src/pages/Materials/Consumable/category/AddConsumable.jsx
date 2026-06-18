import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import {getAllOrSearch, save} from "../../../../service/materials_manager/consumable/ConsumableCategoryService.js";

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
    const [ saving,setSaving] = useState(false);

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
            ).test("checkDupCode", "Mã vật tư này đã tồn tại trên hệ thống", async function (value) {
                if (!value || !/^CON-[0-9]{4}$/.test(value)) return true;
                const res = await getAllOrSearch({ code: value, size: 1 });
                return !(res && res.content && res.content.length > 0);
            }),

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

            setSaving(true);

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

        } finally {

            setSaving(false);

        }
    };

    return (

        <div className="p-4">

            <ToastContainer
                position="top-right"
                autoClose={2000}
            />

            <Card className="border-0 shadow">
                <Card.Header
                    className="text-white"
                    style={{
                        background:
                            "linear-gradient(135deg,#198754,#20c997)"
                    }}
                >
                    <h3 className="mb-1 fw-bold">
                        Thêm mới vật tư tiêu hao
                    </h3>

                    <small>
                        Khai báo danh mục vật tư mới vào hệ thống
                    </small>
                </Card.Header>
                <Card.Body>

                    <Card
                        className="mb-4 border-0 bg-light">
                        <Card.Body>
                            <h6 className="fw-bold">
                                📌 Hướng dẫn
                            </h6>

                            <ul className="mb-0">
                                <li>Mã vật tư theo dạng CON-0001</li>
                                <li>Tên vật tư viết hoa chữ cái đầu</li>
                                <li>Không được trùng mã vật tư</li>
                            </ul>

                        </Card.Body>
                    </Card>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >

                        <Form>

                            <Row className="g-3">

                                <Col md={6}>

                                    <label className="form-label">
                                        📦 Tên vật tư <span className="text-danger">*</span>
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
                                        🔖  Mã vật tư  <span className="text-danger">*</span>
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
                                        📏 Đơn vị  <span className="text-danger">*</span>
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
                                        📝 Mô tả  <span className="text-danger">*</span>
                                    </label>

                                    <Field
                                        as="textarea"
                                        rows={3}
                                        placeholder="Nhập mô tả vật tư..."
                                        name="description"
                                        className="form-control"
                                    />

                                </Col>

                            </Row>

                            <div className="mt-4 d-flex justify-content-end gap-2">
                                <Button
                                    variant="success"
                                    size="lg"
                                    type="submit"
                                    disabled={saving}
                                >
                                    {
                                        saving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                💾 Lưu vật tư
                                            </>
                                        )
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

export default AddConsumable;