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
import ListReplacement from "./pages/Materials/Replacement/category/ListReplacement.jsx";
import ListConsumable from "./pages/Materials/Consumable/category/ListConsumable.jsx";
import AddConsumable from "./pages/Materials/Consumable/category/AddConsumable.jsx";
import AddReplacement from "./pages/Materials/Replacement/category/AddReplacement.jsx";
import EditReplacement from "./pages/Materials/Replacement/category/EditReplacement.jsx";
import EditConsumable from "./pages/Materials/Consumable/category/EditConsumable.jsx";

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
                    {/* Vật tư tiêu hao */}
                    {/*import/export*/}
                    {/*danh muc*/}
                    <Route path={'/consumable-materials'} element={<ListConsumable/>}/>
                    <Route path={"/consumable-materials/add"} element={<AddConsumable/>}/>
                    <Route path={"/consumable-materials/edit/:id"} element={<EditConsumable/>}/>
                    {/* Vật tư thay thế */}
                    <Route path={'/replacement-materials'} element={<ListReplacement/>}/>
                    <Route path={'/replacement-materials/add'} element={<AddReplacement/>}/>
                    <Route path={'/replacement-materials/edit/:id'} element={<EditReplacement/>}/>

                    {/*CCDC */}
                    <Route path={'/ccdc'} element={<ToolManagement/>}/>
                </Routes>
            </MainLayout>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default App
