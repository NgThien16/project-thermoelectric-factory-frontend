import { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaCogs, FaTools, FaWarehouse, FaClipboardList, FaUsers } from 'react-icons/fa';
import { getListSystem } from '../service/operations_manager/system/SystemService';
import { searchListEquipment } from '../service/operations_manager/equipment/EquipmentService';
import { getAllOrSearch as getConsumables } from '../service/materials_manager/consumable/ConsumableService';
import { getAllOrSearch as getReplacements } from '../service/materials_manager/replacement/ReplacementService';
import toolService from '../api/toolService';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    systems: 0,
    equipments: 0,
    materials: 0,
    borrowedTools: 0,
    personnel: 85, // Giữ tạm thời vì chưa có service nhân sự
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [systems, equipments, consumables, replacements, borrowings] = await Promise.all([
          getListSystem(),
          searchListEquipment('', '', '', 1),
          getConsumables(),
          getReplacements(),
          toolService.getAllBorrowings(),
        ]);

        setCounts({
          systems: Array.isArray(systems) ? systems.length : 0,
          equipments: equipments?.data?.totalElements || 0,
          materials: (Array.isArray(consumables) ? consumables.length : 0) + (Array.isArray(replacements) ? replacements.length : 0),
          borrowedTools: Array.isArray(borrowings.data) ? borrowings.data.length : 0,
          personnel: 85,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { title: 'Hệ thống', count: counts.systems, icon: <FaCogs />, color: 'primary' },
    { title: 'Thiết bị', count: counts.equipments, icon: <FaTools />, color: 'success' },
    { title: 'Kho vật tư', count: counts.materials, icon: <FaWarehouse />, color: 'warning' },
    { title: 'CCDC mượn', count: counts.borrowedTools, icon: <FaClipboardList />, color: 'info' },
    { title: 'Nhân sự', count: counts.personnel, icon: <FaUsers />, color: 'secondary' },
  ];

  return (
    <div className="p-4">
      <h3 className="mb-4 fw-bold">Tổng quan hệ thống</h3>
      <Row className="g-4">
        {stats.map((stat, index) => (
          <Col key={index} md={4} lg={2.4} style={{ flex: '0 0 20%', maxWidth: '20%' }}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className={`bg-${stat.color} text-white p-3 rounded-circle me-3 d-flex align-items-center justify-content-center`} style={{ width: '50px', height: '50px' }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-muted mb-0 small">{stat.title}</p>
                  <h4 className="mb-0 fw-bold">{stat.count}</h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm p-4 text-center bg-light">
            <h5 className="text-muted">Chào mừng quay trở lại, Admin!</h5>
            <p className="mb-0">Hệ thống quản lý thiết bị, sửa chữa và bảo dưỡng nhà máy nhiệt điện đã sẵn sàng.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;