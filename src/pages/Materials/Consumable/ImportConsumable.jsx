import {useEffect, useState} from "react";

import {
    Button,
    Card,
    Col,
    Form,
    Row,
    Table,
    Badge, Modal
} from "react-bootstrap";

import {
    FaArrowLeft,
    FaPlus,
    FaSave,
    FaTrash
} from "react-icons/fa";

import {Link, useNavigate} from "react-router-dom";

import {toast} from "react-toastify";

import {
    save
} from "../../../service/materials_manager/consumable/ConsumableTransactionService.js";

import {
     save as saveMaterial
} from "../../../service/materials_manager/consumable/ConsumableCategoryService.js"
import {ErrorMessage, Field,Form as FormikForm, Formik} from "formik";
import * as Yup from "yup";
import {getAllMaterialsForDropdown} from "../../../service/materials_manager/consumable/ConsumableCategoryService.js";

export default function ConsumableImport() {

    const navigate = useNavigate();

    const [materials, setMaterials] = useState([]);

    const [tempItems, setTempItems] = useState([]);
    const [showImportConfirmModal, setShowImportConfirmModal] = useState(false);

    const [form, setForm] = useState({
        materialId: "",
        quantity: ""
    });
    const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);

    useEffect(() => {

        loadMaterials();

    }, []);

    const loadMaterials = async () => {
        try {
            const data = await getAllMaterialsForDropdown();

            // Kiểm tra xem data trả về có phải là một mảng hợp lệ không
            if (data && Array.isArray(data)) {
                setMaterials(data); // Ăn ngay vì data chính là mảng vật tư
            } else {
                setMaterials([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách vật tư vào dropdown:", error);
            setMaterials([]);
        }
    };

    const handleChange = (e) => {

        const {name, value} = e.target;

        if (name === "materialId" && value === "/consumable-materials/add") {
            setShowAddMaterialModal(true);
            setForm({ ...form, materialId: "" });
            return;
        }

        setForm({
            ...form,
            [name]: value
        });
    };

    const handleAddItem = () => {

        if (!form.materialId) {
            toast.error("Vui lòng chọn vật tư");
            return;
        }

        if (!form.quantity || form.quantity <= 0) {
            toast.error("Số lượng phải lớn hơn 0");
            return;
        }

        const selectedMaterial = materials.find(
            item => item.id === parseInt(form.materialId)
        );

        const existed = tempItems.find(
            item => item.materialId === selectedMaterial.id
        );

        if (existed) {

            setTempItems(
                tempItems.map(item =>
                    item.materialId === selectedMaterial.id
                        ? {
                            ...item,
                            quantity:
                                item.quantity +
                                parseInt(form.quantity)
                        }
                        : item
                )
            );

        } else {

            const newItem = {
                materialId: selectedMaterial.id,
                materialCode: selectedMaterial.code,
                materialName: selectedMaterial.name,
                quantity: parseInt(form.quantity)
            };

            setTempItems([
                ...tempItems,
                newItem
            ]);
        }

        setForm({
            materialId: "",
            quantity: ""
        });

        toast.success("Đã thêm vào danh sách");
    };
    const handleRemove = (index) => {

        const updated = [...tempItems];

        updated.splice(index, 1);

        setTempItems(updated);
    };

    const handleImport = () => {
        if (tempItems.length === 0) {
            toast.error("Danh sách nhập đang trống");
            return;
        }
        setShowImportConfirmModal(true);
    };
    const confirmImport = async () => {
        try {
            for (const item of tempItems) {
                const payload = {
                    quantity: item.quantity,
                    type: "IMPORT",
                    material: { id: item.materialId }
                };
                await save(payload);
            }
            toast.success("Nhập kho thành công");
            setShowImportConfirmModal(false);
            navigate("/consumable-transactions");
        } catch (e) {
            console.log(e);
            toast.error("Có lỗi xảy ra");
            setShowImportConfirmModal(false);
        }
    };
    const handleCreateMaterialSuccess = async (values, { resetForm }) => {
        try {
            const result = await saveMaterial(values);
            if (result) {
                toast.success("Thêm mới danh mục vật tư thành công!");
                setShowAddMaterialModal(false);
                resetForm();

                const data = await getAllMaterialsForDropdown();
                if (data && Array.isArray(data)) { // <-- Đổi ở đây
                    setMaterials(data);


                    setForm({
                        materialId: result.id.toString(),
                        quantity: form.quantity
                    });
                }
            } else {
                toast.error("Thêm mới danh mục thất bại!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi tạo vật tư!");
        }
    };

    return (

        <div className="container mt-4">

            <Card className="shadow border-0">

                <Card.Header
                    className="text-white d-flex justify-content-between align-items-center"
                    style={{
                        background:
                            "linear-gradient(135deg,#198754,#20c997)"
                    }}
                >

                    <div>

                        <h4 className="mb-0">
                            Nhập vật tư vào kho
                        </h4>


                    </div>

                    <Button
                        as={Link}
                        to="/consumable-transactions"
                        variant="light"
                    >

                        <FaArrowLeft className="me-2"/>

                        Quay lại

                    </Button>

                </Card.Header>

                <Card.Body>
                    <Row className="g-3 mb-4">

                        <Col md={4}>
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <small className="text-muted">
                                        Vật tư chờ nhập
                                    </small>

                                    <h3 className="fw-bold text-primary mb-0">
                                        {tempItems.length}
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4}>
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <small className="text-muted">
                                        Tổng số lượng
                                    </small>

                                    <h3 className="fw-bold text-success mb-0">
                                        {
                                            tempItems.reduce(
                                                (sum, item) =>
                                                    sum + item.quantity,
                                                0
                                            )
                                        }
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4}>
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <small className="text-muted">
                                        Danh mục vật tư
                                    </small>

                                    <h3 className="fw-bold text-warning mb-0">
                                        {materials.length}
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                    {/* FORM NHẬP */}

                    <Card className="mb-4 border-0 shadow-sm">

                        <Card.Body>

                            <Row className="g-3 align-items-end">

                                <Col md={6}>

                                    <Form.Label>
                                        Vật tư
                                    </Form.Label>

                                    <Form.Select
                                        name="materialId"
                                        value={form.materialId}
                                        onChange={handleChange}
                                    >

                                        <option value="">
                                            -- Chọn vật tư --
                                        </option>

                                        {
                                            materials.map((item) => (

                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >

                                                    [{item.code}] {item.name}

                                                </option>
                                            ))
                                        }
                                        <option value="/consumable-materials/add" className="fw-bold text-primary">
                                            ➕ Thêm mới danh mục vật tư
                                        </option>

                                    </Form.Select>

                                </Col>

                                <Col md={3}>

                                    <Form.Label>
                                        Số lượng
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        min="1"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        placeholder="Nhập số lượng"
                                    />

                                </Col>

                                <Col md={3}>

                                    <Button
                                        variant="primary"
                                        className="w-100"
                                        onClick={handleAddItem}
                                    >

                                        <FaPlus className="me-2"/>

                                        Thêm

                                    </Button>

                                </Col>

                            </Row>

                        </Card.Body>

                    </Card>

                    {/* BẢNG TẠM */}

                    <Card className="border-0 shadow-sm">

                        <Card.Header
                            className="bg-light"
                        >

                            <div className="d-flex justify-content-between align-items-center">

                                <h5 className="mb-0">
                                    Danh sách chờ nhập kho
                                </h5>

                                <Badge bg="primary">

                                    {tempItems.length} vật tư

                                </Badge>

                            </div>

                        </Card.Header>

                        <Card.Body>

                            <Table
                                bordered
                                hover
                                responsive
                                className="align-middle text-center"
                            >

                                <thead className="table-dark">

                                <tr>

                                    <th>STT</th>

                                    <th>Mã vật tư</th>

                                    <th>Tên vật tư</th>

                                    <th>Số lượng</th>

                                    <th>Thao tác</th>

                                </tr>

                                </thead>

                                <tbody>

                                {
                                    tempItems.length > 0 ? (

                                        tempItems.map((item, index) => (

                                            <tr key={index}>

                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td className="fw-bold text-primary">
                                                    {item.materialCode}
                                                </td>

                                                <td className="text-start">
                                                    {item.materialName}
                                                </td>

                                                <td>

                                                    <Badge
                                                        bg="success"
                                                        pill
                                                        className="px-3 py-2"
                                                    >
                                                        {item.quantity}
                                                    </Badge>

                                                </td>
                                                <td>

                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        onClick={() => handleRemove(index)}
                                                    >

                                                        <FaTrash/>

                                                    </Button>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="text-muted py-4"
                                            >

                                                Chưa có vật tư nào

                                            </td>

                                        </tr>

                                    )
                                }

                                </tbody>

                            </Table>
                            {
                                tempItems.length > 0 && (

                                    <div
                                        className="d-flex justify-content-end fw-bold fs-5 mb-3"
                                    >

                                        Tổng số lượng:
                                        {
                                            tempItems.reduce(
                                                (sum, item) =>
                                                    sum + item.quantity,
                                                0
                                            )
                                        }

                                    </div>

                                )
                            }
                            {
                                tempItems.length > 0 && (

                                    <div className="d-flex justify-content-end mt-3">

                                        <Button
                                            size="lg"
                                            variant="success"
                                            className="shadow px-4"
                                            onClick={handleImport}
                                        >

                                            <FaSave className="me-2"/>

                                            Nhập kho

                                        </Button>

                                    </div>

                                )
                            }

                        </Card.Body>

                    </Card>

                </Card.Body>

            </Card>
            {/* === MODAL THÊM NHANH DANH MỤC VẬT TƯ === */}
            <Modal
                show={showAddMaterialModal}
                onHide={() => setShowAddMaterialModal(false)}
                backdrop="static" // Không cho bấm ra ngoài tắt mất dữ liệu đang gõ
                centered
                size="lg"
            >
                <Modal.Header
                    closeButton
                    className="bg-success text-white"
                >
                    <Modal.Title className="fw-bold text-success">Thêm nhanh danh mục vật tư</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{ name: "", code: "", unit: "", location: "", description: "" }}
                        validationSchema={Yup.object({
                            name: Yup.string().required("Không được bỏ trống").matches(/^\p{Lu}\p{L}+(?:\s\p{L}+)*$/u, "Yêu cầu chữ cái đầu in HOA và không chứa kí tự đặc biệt"),
                            code: Yup.string().required("Không được bỏ trống").matches(/^CON-[0-9]{4}$/, "Định dạng mã: CON-XXXX"),
                            unit: Yup.string().required("Không được bỏ trống").matches(/^\p{Lu}\p{L}+(?:\s\p{L}+)*$/u, "Yêu cầu chữ cái đầu in HOA và không chứa kí tự đặc biệt")
                        })}
                        onSubmit={handleCreateMaterialSuccess}
                    >
                        <FormikForm>
                            <Row className="g-3">
                                <Col md={6}>
                                    <label className="form-label">Tên vật tư</label>
                                    <Field name="name" className="form-control" />
                                    <div className="text-danger small"><ErrorMessage name="name" /></div>
                                </Col>
                                <Col md={6}>
                                    <label className="form-label">Mã vật tư</label>
                                    <Field name="code" className="form-control" placeholder="CON-0001" />
                                    <div className="text-danger small"><ErrorMessage name="code" /></div>
                                </Col>
                                <Col md={6}>
                                    <label className="form-label">Đơn vị</label>
                                    <Field name="unit" className="form-control" />
                                    <div className="text-danger small"><ErrorMessage name="unit" /></div>
                                </Col>
                                <Col md={6}>
                                    <label className="form-label">Mô tả</label>
                                    <Field as="textarea" rows={1} name="description" className="form-control" />
                                </Col>
                            </Row>
                            <div className="mt-4 d-flex justify-content-end gap-2">
                                <Button variant="secondary" type="button" onClick={() => setShowAddMaterialModal(false)}>
                                    Hủy bỏ
                                </Button>
                                <Button variant="success" type="submit">
                                    Lưu danh mục
                                </Button>
                            </div>
                        </FormikForm>
                    </Formik>
                </Modal.Body>
            </Modal>
            <Modal
                show={showImportConfirmModal}
                onHide={() => setShowImportConfirmModal(false)}
                centered
            >
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>{"Xác nhận nhập kho"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{"Bạn có chắc chắn muốn nhập kho"} <b>{tempItems.length}</b> {"loại vật tư với tổng số lượng"} <b>{tempItems.reduce((sum, item) => sum + item.quantity, 0)}</b> {"không?"}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowImportConfirmModal(false)}>
                        {"Hủy"}
                    </Button>
                    <Button variant="success" onClick={confirmImport}>
                        <FaSave className="me-2" />
                        {"Xác nhận nhập kho"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}