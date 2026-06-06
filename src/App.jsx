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
import TechnicalReportPage from './pages/technical_report/TechnicalReportPage.jsx';
import Login from "./pages/auth/Login.jsx";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute.jsx";
import RequestManagement from "./pages/repair_order/RequestManagement.jsx";
import { ROLE } from "./utils/roleUtils.js";
import WarehouseRelease from "./pages/Materials/WarehouseRelease.jsx";
import Export from "./pages/Materials/Export.jsx";

function App() {
    return (
        <>
            <MainLayout>
                <Routes>
                    <Route path={'/'} element={<Dashboard/>}/>
                    <Route path="/login" element={<Login />} />

                    {/* Nhân sự */}
                    <Route
                        path="/personnels"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.HR
                                ]}
                            >
                                <EmployeePage />
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/personnels/employees"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.HR
                                ]}
                            >
                                <EmployeePage />
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/personnels/departments"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.HR
                                ]}
                            >
                                <DepartmentPage />
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/personnels/positions"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.HR
                                ]}
                            >
                                <PositionPage />
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/personnels/roles"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.HR
                                ]}
                            >
                                <RolePage />
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/personnels/users"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.HR
                                ]}
                            >
                                <UserPage />
                            </RoleProtectedRoute>
                        }
                    />

                    {/* Biên bản kỹ thuật */}
                    <Route
                        path="/technical-reports"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.MAINTENANCE_MANAGER,
                                    ROLE.TEAM_LEADER
                                ]}
                            >
                                <TechnicalReportPage />
                            </RoleProtectedRoute>
                        }
                    />

                    {/* Hệ thống */}
                    <Route
                        path="/system-equipments"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.OPERATION
                                ]}
                            >
                                <SystemEquipment />
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/system-equipments/add"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.OPERATION
                                ]}
                            >
                                <AddSystem />
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/system-equipments/:id/equipments"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.OPERATION
                                ]}
                            >
                                <DetailSystem />
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/system-equipments/:id/add-equipment"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.OPERATION
                                ]}
                            >
                                <AddEquipmentToSystem />
                            </RoleProtectedRoute>
                        }
                    />

                    {/* Thiết bị */}
                    <Route
                        path="/equipments"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.OPERATION
                                ]}
                            >
                                <Equipment />
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/equipments/add"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.OPERATION
                                ]}
                            >
                                <AddEquipment />
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/equipments/edit/:id"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.OPERATION
                                ]}
                            >
                                <EditEquipment />
                            </RoleProtectedRoute>
                        }
                    />
                    <Route
                        path="/equipments/:typeId/equipment-types/:equipmentId/detail"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.OPERATION
                                ]}
                            >
                                <EquipmentDetail />
                            </RoleProtectedRoute>
                        }
                    />

                    {/* Loại thiết bị */}
                    <Route
                        path="/equipment-types"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[
                                    ROLE.ADMIN,
                                    ROLE.OPERATION
                                ]}
                            >
                                <EquipmentTypeList />
                            </RoleProtectedRoute>
                        }
                    />
                    <Route path={"/equipment-types/create"} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.OPERATION
                        ]}
                    >
                        <AddEquipmentType />
                    </RoleProtectedRoute>}/>

                    <Route path={"/equipment-types/:typeId/equipments"} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.OPERATION
                        ]}
                    >
                        <EquipmentByType />
                    </RoleProtectedRoute>}/>

                    <Route path={"/equipment-types/:typeId/equipments/:equipmentId/detail"} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.OPERATION
                        ]}
                    >
                        <Detail />
                    </RoleProtectedRoute>}/>
                    {/* Vật tư tiêu hao */}
                    <Route path={'/consumable-materials'} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.MATERIAL
                        ]}
                    >
                        <ListConsumable />
                    </RoleProtectedRoute>}/>
                    <Route path={"/consumable-materials/add"} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.MATERIAL
                        ]}
                    >
                        <AddConsumable />
                    </RoleProtectedRoute>}/>
                    <Route path="/consumable-materials/edit/:id" element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.MATERIAL
                        ]}
                    >
                        <EditConsumable />
                    </RoleProtectedRoute>} />
                    <Route path={"/consumable-transactions"} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.MATERIAL
                        ]}
                    >
                        <ConsumableTransactionList />
                    </RoleProtectedRoute>}/>
                    <Route path={"/consumable-transactions/history"} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.MATERIAL
                        ]}
                    >
                        <ConsumableTransactionHistory />
                    </RoleProtectedRoute>}/>
                    <Route path={"/consumable-transactions/import"} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.MATERIAL
                        ]}
                    >
                        <ConsumableImport />
                    </RoleProtectedRoute>}/>
                    {/* Vật tư thay thế */}
                    <Route path={'/replacement-materials'} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.MATERIAL
                        ]}
                    >
                        <ListReplacement />
                    </RoleProtectedRoute>}/>
                    <Route path={'/replacement-materials/add'} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.MATERIAL
                        ]}
                    >
                        <AddReplacement />
                    </RoleProtectedRoute>}/>
                    <Route path={"/replacement-materials/edit/:id"} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.MATERIAL
                        ]}
                    >
                        <EditReplacement />
                    </RoleProtectedRoute>} />
                    <Route path={"/replacement-transactions"} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.MATERIAL
                        ]}
                    >
                        <ListReplacementTransaction />
                    </RoleProtectedRoute>}/>
                    <Route path={"/replacement-transactions/history"} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.MATERIAL
                        ]}
                    >
                        <ReplacementTransactionHistory />
                    </RoleProtectedRoute>}/>
                    <Route path={"/replacement-transactions/import"} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.MATERIAL
                        ]}
                    >
                        <ReplacementImport />
                    </RoleProtectedRoute>}/>
                    {/*Quản đốc*/}
                    <Route path="/material-export/supply-slip/:requestId" element={<Export/>} />
                    {/*Thủ Kho*/}
                    <Route path="/warehouse/release/:requestId" element={<WarehouseRelease />} />

                    {/*CCDC */}
                    <Route path={'/tool'} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.TOOL
                        ]}
                    >
                        <ToolManagement />
                    </RoleProtectedRoute>}/>
                    <Route path={'/tool/borrowings'} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.TOOL
                        ]}
                    >
                        <ToolBorrowingManagement />
                    </RoleProtectedRoute>}/>
                    <Route path={'/tool/user-borrow'} element={<RoleProtectedRoute
                        allowedRoles={[
                            ROLE.ADMIN,
                            ROLE.TOOL
                        ]}
                    >
                        <UserToolBorrowing />
                    </RoleProtectedRoute>}/>
                    {/* Repair Order */}
                    <Route
                        path="/repair-orders"
                        element={
                            <RoleProtectedRoute
                                allowedRoles={[ROLE.ADMIN, ROLE.SHIFT_LEADER, ROLE.SHIFT_LEADER_ALT]}
                            >
                                <RequestManagement />
                            </RoleProtectedRoute>
                        }
                    />
                </Routes>
            </MainLayout>
            <ToastContainer position="top-right" autoClose={3000} />
        </>

    )
}
// app jsx
export default App
