

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import TopNavbar from './components/Layout/TopNavbar';
import HRManagement from './pages/HR/HRManagement';
import EquipmentManagement from './pages/Operation/EquipmentManagement';
import MaintenanceManagement from './pages/Maintenance/MaintenanceManagement';
import WarehouseManagement from './pages/Warehouse/WarehouseManagement';
import ToolManagement from './pages/Warehouse/ToolManagement';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="main-content d-flex flex-column">
          <TopNavbar />
          <div className="content-wrapper flex-grow-1">
            <Routes>
              <Route path="/" element={<div className="p-4"><h3>Dashboard</h3><p>Chào mừng đến với hệ thống quản lý nhà máy nhiệt điện.</p></div>} />
              <Route path="/nhan-su" element={<HRManagement />} />
              <Route path="/van-hanh" element={<EquipmentManagement />} />
              <Route path="/sua-chua" element={<MaintenanceManagement />} />
              <Route path="/kho" element={<WarehouseManagement />} />
              <Route path="/ccdc" element={<ToolManagement />} />
            </Routes>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
