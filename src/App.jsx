import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'
import {Route, Routes} from "react-router-dom";
import Home from "./component/Home.jsx";
import SystemEquipment from "./component/operations_manager/system/SystemEquipment.jsx";
import Equipment from "./component/operations_manager/equipment/Equipment.jsx";
import AddEquipment from "./component/operations_manager/equipment/AddEquipment.jsx";
import EditEquipment from "./component/operations_manager/equipment/EditEquipment.jsx";
import {ToastContainer} from "react-toastify";
import AddSystem from "./component/operations_manager/system/AddSystem.jsx";
import DetailSystem from "./component/operations_manager/system/DetailSystem.jsx";
import AddEquipmentToSystem from "./component/operations_manager/system/AddEquipmentIntoSystem.jsx";
import EquipmentTypeList from "./component/operations_manager/equipment_type/EquipmentTypeList.jsx";
import AddEquipmentType from "./component/operations_manager/equipment_type/AddEquipmentType.jsx";
import EquipmentByType from "./component/operations_manager/equipment_type/EquipmentByType.jsx";
import Detail from "./component/operations_manager/equipment_type/Detail.jsx";
import EquipmentDetail from "./component/operations_manager/equipment/EquipmentDetail.jsx";

function App() {


    return (
        <>
            <Routes>
                <Route path={'/'} element={<Home/>}/>

                <Route path={'/system-equipments'} element={<SystemEquipment/>}/>
                <Route path={"/system-equipments/add"} element={<AddSystem/>}/>
                <Route path={"/system-equipments/:id/equipments"} element={<DetailSystem/>}/>
                <Route path={"/system-equipments/:id/add-equipment"} element={<AddEquipmentToSystem/>}/>

                <Route path={'/equipments'} element={<Equipment/>}/>
                <Route path={'/equipments/:id'} element={<EquipmentDetail/>}/>
                <Route path={'/equipments/add'} element={<AddEquipment/>}/>
                <Route path={'/equipments/edit/:id'} element={<EditEquipment/>}/>

                <Route path={"/equipment-types"} element={<EquipmentTypeList/>}/>
                <Route path={"/equipment-types/create"} element={<AddEquipmentType/>}/>
                <Route path={"/equipment-types/:typeId/equipments"} element={<EquipmentByType/>}/>
                <Route path={"/equipment-types/:typeId/equipments/:equipmentId/detail"} element={<Detail/>}/>
            </Routes>
            <ToastContainer/>
        </>
    )
}

export default App
