import React, { useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, message, Input, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Search } = Input;

const PositionTable = ({ positions, loading, onEdit, onDelete, onRefresh }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredPositions, setFilteredPositions] = useState(positions);

  // Lọc dữ liệu theo từ khóa tìm kiếm
  React.useEffect(() => {
    if (!searchText) {
      setFilteredPositions(positions);
    } else {
      const filtered = positions.filter(position => 
        position.name.toLowerCase().includes(searchText.toLowerCase()) ||
        position.code.toLowerCase().includes(searchText.toLowerCase()) ||
        (position.des && position.des.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredPositions(filtered);
    }
  }, [positions, searchText]);

  // Xử lý xóa vị trí
  const handleDelete = (id, name) => {
    onDelete(id);
  };

  // Định nghĩa các cột của bảng
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 70,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã vị trí',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code) => (
        <Tag color="blue" style={{ fontWeight: 'bold', fontSize: '12px' }}>
          {code}
        </Tag>
      ),
    },
    {
      title: 'Tên vị trí',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (name) => (
        <span style={{ fontWeight: '500', color: '#262626' }}>
          {name}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: 'center',
      render: (isActive) => (
        <Badge 
          status={isActive ? 'success' : 'default'} 
          text={isActive ? 'Hoạt động' : 'Không hoạt động'}
        />
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'des',
      key: 'des',
      ellipsis: true,
      render: (des) => (
        <span style={{ color: '#595959' }}>
          {des || 'Không có mô tả'}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (createdAt) => (
        new Date(createdAt).toLocaleDateString('vi-VN')
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            style={{ color: '#1890ff' }}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Xác nhận xóa"
            description={`Bạn có chắc chắn muốn xóa vị trí "${record.name}" không?`}
            onConfirm={() => handleDelete(record._id, record.name)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header với tìm kiếm và refresh */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search
            placeholder="Tìm kiếm theo mã, tên hoặc mô tả..."
            allowClear
            style={{ width: 320 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Button 
            icon={<ReloadOutlined />} 
            onClick={onRefresh}
            title="Làm mới dữ liệu"
          >
            Làm mới
          </Button>
        </div>
        
        <div style={{ color: '#595959', fontSize: '14px' }}>
          Tổng cộng: <strong>{filteredPositions.length}</strong> vị trí
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={filteredPositions}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `Hiển thị ${range[0]}-${range[1]} của ${total} vị trí`,
          pageSizeOptions: ['5', '10', '20', '50'],
        }}
        className="custom-table"
        scroll={{ x: 800 }}
        bordered
        size="middle"
      />
    </div>
  );
};

export default PositionTable;