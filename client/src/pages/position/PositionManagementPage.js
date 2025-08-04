import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, message } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import PositionTable from '../../components/position/PositionTable';
import PositionForm from '../../components/position/PositionForm';
import { positionAPI } from '../../services';

const { Title, Paragraph } = Typography;

const PositionManagementPage = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await positionAPI.getAll();
      setPositions(response.data || []);
    } catch (error) {
      message.error('Lỗi khi tải danh sách vị trí công tác');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPosition(null);
    setFormVisible(true);
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await positionAPI.delete(id);
      message.success('Xóa vị trí công tác thành công');
      fetchPositions();
    } catch (error) {
      message.error('Lỗi khi xóa vị trí công tác');
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (editingPosition) {
        await positionAPI.update(editingPosition._id, values);
        message.success('Cập nhật vị trí công tác thành công');
      } else {
        await positionAPI.create(values);
        message.success('Tạo vị trí công tác thành công');
      }
      setFormVisible(false);
      fetchPositions();
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleFormCancel = () => {
    setFormVisible(false);
    setEditingPosition(null);
  };

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} className="page-title">
              <SettingOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              Quản lý vị trí công tác
            </Title>
            <Paragraph className="page-description">
              Quản lý và cấu hình các vị trí công tác trong trường
            </Paragraph>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="btn-primary"
            onClick={handleCreate}
          >
            Tạo vị trí mới
          </Button>
        </div>
      </div>

      {/* Position Table */}
      <Card className="custom-card">
        <PositionTable
          positions={positions}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* Position Form Modal */}
      <PositionForm
        visible={formVisible}
        position={editingPosition}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    </div>
  );
};

export default PositionManagementPage;
