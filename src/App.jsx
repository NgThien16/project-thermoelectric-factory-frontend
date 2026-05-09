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
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js'
import {Route, Routes} from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SystemEquipment from "./pages/Operations/System/SystemEquipment.jsx";
import Equipment from "./pages/Operations/Equipment/Equipment.jsx";
import AddEquipment from "./pages/Operations/Equipment/AddEquipment.jsx";
import EditEquipment from "./pages/Operations/Equipment/EditEquipment.jsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddSystem from "./pages/Operations/System/AddSystem.jsx";
import DetailSystem from "./pages/Operations/System/DetailSystem.jsx";
import AddEquipmentToSystem from "./pages/Operations/System/AddEquipmentIntoSystem.jsx";
import EquipmentTypeList from "./pages/Operations/EquipmentType/EquipmentTypeList.jsx";
import AddEquipmentType from "./pages/Operations/EquipmentType/AddEquipmentType.jsx";
import EquipmentByType from "./pages/Operations/EquipmentType/EquipmentByType.jsx";
import Detail from "./pages/Operations/EquipmentType/Detail.jsx";
import EquipmentDetail from "./pages/Operations/Equipment/EquipmentDetail.jsx";
import ToolManagement from "./pages/Tool/ToolManagement.jsx";

function App() {
    return (
        <>
            <MainLayout>
                <Routes>
                    <Route path={'/'} element={<Dashboard/>}/>

                    {/* Hệ thống */}
                    <Route path={'/system-equipments'} element={<SystemEquipment/>}/>
                    <Route path={"/system-equipments/add"} element={<AddSystem/>}/>
                    <Route path={"/system-equipments/:id/equipments"} element={<DetailSystem/>}/>
                    <Route path={"/system-equipments/:id/add-equipment"} element={<AddEquipmentToSystem/>}/>

                    {/* Thiết bị */}
                    <Route path={'/equipments'} element={<Equipment/>}/>
                    <Route path={'/equipments/:id'} element={<EquipmentDetail/>}/>
                    <Route path={'/equipments/add'} element={<AddEquipment/>}/>
                    <Route path={'/equipments/edit/:id'} element={<EditEquipment/>}/>

                    {/* Loại thiết bị */}
                    <Route path={"/equipment-types"} element={<EquipmentTypeList/>}/>
                    <Route path={"/equipment-types/create"} element={<AddEquipmentType/>}/>
                    <Route path={"/equipment-types/:typeId/equipments"} element={<EquipmentByType/>}/>
                    <Route path={"/equipment-types/:typeId/equipments/:equipmentId/detail"} element={<Detail/>}/>

                    {/*CCDC */}
                    <Route path={'/ccdc'} element={<ToolManagement/>}/>
                </Routes>
            </MainLayout>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default App
