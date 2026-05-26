import {Button, Modal} from "react-bootstrap";
import {deleteById} from "../../../service/operations_manager/equipment/EquipmentService.js";
import {toast} from "react-toastify";

const DeleteEquipment = ({isShowModal,deleteEquipment,closeModal,setReload}) => {

    const handleClose = ()=>{
        closeModal(false);
    }
    const handleDelete = async ()=>{
        await deleteById(deleteEquipment.id);
        handleClose();
        setReload(pre => !pre);
        toast.success("Xóa thiết bị thành công !!");
    }

    return (
        <>
            <Modal show={isShowModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Xác nhận muốn xóa thiết bị: <b className={'text-danger'}>{deleteEquipment.name}</b> ?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleDelete}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default DeleteEquipment;