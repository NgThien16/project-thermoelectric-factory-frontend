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
import Login from "./pages/auth/Login.jsx";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute.jsx";
import { ROLE } from "./utils/roleUtils.js";

import Export from "./pages/Materials/Export.jsx";
import WarehouseRelease from "./pages/Materials/WarehouseRelease.jsx";

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

                    {/* Hệ thống */}
                    <Route path={'/system-equipments'} element={<SystemEquipment/>}/>
                    <Route path={"/system-equipments/add"} element={<AddSystem/>}/>
                    <Route path={"/system-equipments/:id/equipments"} element={<DetailSystem/>}/>
                    <Route path={"/system-equipments/:id/add-equipment"} element={<AddEquipmentToSystem/>}/>

                    {/* Thiết bị */}
                    <Route path={'/equipments'} element={<Equipment/>}/>
                    <Route path={'/equipments/:typeId/equipment-types/:equipmentId/detail'} element={<EquipmentDetail/>}/>
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
                    {/*Quản đốc*/}
                    <Route path="/material-export/supply-slip/:requestId" element={<Export />} />
                    {/*Thủ Kho*/}
                    <Route path="/warehouse/release/:requestId" element={<WarehouseRelease />} />
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
                </Routes>
            </MainLayout>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default App
