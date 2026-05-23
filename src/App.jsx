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
import ToolBorrowingManagement from "./pages/Tool/ToolBorrowingManagement.jsx";
import UserToolBorrowing from "./pages/Tool/UserToolBorrowing.jsx";
import EmployeePage from "./pages/personnels/Employee.jsx";
import DepartmentPage from "./pages/personnels/Department.jsx";
import PositionPage from "./pages/personnels/Position.jsx";
import RolePage from "./pages/personnels/Role.jsx";
import UserPage from "./pages/personnels/User.jsx";
import ListReplacement from "./pages/Materials/Replacement/category/ListReplacement.jsx";
import ListConsumable from "./pages/Materials/Consumable/category/ListConsumable.jsx";
import AddConsumable from "./pages/Materials/Consumable/category/AddConsumable.jsx";
import AddReplacement from "./pages/Materials/Replacement/category/AddReplacement.jsx";
import ConsumableTransactionList from "./pages/Materials/Consumable/ListConsumableTransaction.jsx";
import ConsumableTransactionHistory from "./pages/Materials/Consumable/ConsumableTransactionHistory.jsx";
import ConsumableImport from "./pages/Materials/Consumable/ImportConsumable.jsx";
import ReplacementImport from "./pages/Materials/Replacement/ImportReplacement.jsx";
import ReplacementTransactionHistory from "./pages/Materials/Replacement/ReplacementTransactionHistory.jsx";
import ListReplacementTransaction from "./pages/Materials/Replacement/ListReplacementTransaction.jsx";
import EditConsumable from "./pages/Materials/Consumable/category/EditConsumable.jsx";
import EditReplacement from "./pages/Materials/Replacement/category/EditReplacement.jsx";

function App() {
    return (
        <>
            <MainLayout>
                <Routes>
                    <Route path={'/'} element={<Dashboard/>}/>

                    {/* Nhân sự */}
                    <Route path="/personnels" element={<EmployeePage />} />
                    <Route path="/personnels/employees" element={<EmployeePage />} />
                    <Route path="/personnels/departments" element={<DepartmentPage />} />
                    <Route path="/personnels/positions" element={<PositionPage />} />
                    <Route path="/personnels/roles" element={<RolePage />} />
                    <Route path="/personnels/users" element={<UserPage />} />

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
                    <Route path={'/consumable-materials'} element={<ListConsumable/>}/>
                    <Route path={"/consumable-materials/add"} element={<AddConsumable/>}/>
                    <Route path="/consumable-materials/edit/:id" element={<EditConsumable />} />
                    <Route path={"/consumable-transactions"} element={<ConsumableTransactionList/>}/>
                    <Route path={"/consumable-transactions/history"} element={<ConsumableTransactionHistory/>}/>
                    <Route path={"/consumable-transactions/import"} element={<ConsumableImport/>}/>
                    {/* Vật tư thay thế */}
                    <Route path={'/replacement-materials'} element={<ListReplacement/>}/>
                    <Route path={'/replacement-materials/add'} element={<AddReplacement/>}/>
                    <Route path={"/replacement-materials/edit/:id"} element={<EditReplacement />} />
                    <Route path={"/replacement-transactions"} element={<ListReplacementTransaction/>}/>
                    <Route path={"/replacement-transactions/history"} element={<ReplacementTransactionHistory/>}/>
                    <Route path={"/replacement-transactions/import"} element={<ReplacementImport/>}/>

                    {/*CCDC */}
                    <Route path={'/tool'} element={<ToolManagement/>}/>
                    <Route path={'/tool/borrowings'} element={<ToolBorrowingManagement/>}/>
                    <Route path={'/tool/user-borrow'} element={<UserToolBorrowing/>}/>
                </Routes>
            </MainLayout>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default App
