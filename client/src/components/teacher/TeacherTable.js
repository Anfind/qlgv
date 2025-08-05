import React, { useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, Input, Badge, Avatar, Tooltip } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Search } = Input;

const TeacherTable = ({ 
  teachers, 
  loading, 
  pagination, 
  onSearch, 
  onTableChange, 
  onEdit, 
  onDelete, 
  onRefresh 
}) => {
  const [searchText, setSearchText] = useState('');

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    onSearch(value);
  };

  // Xử lý xóa giáo viên
  const handleDelete = (teacher) => {
    onDelete(teacher._id);
  };

  // Render thông tin vị trí công tác
  const renderPositions = (positions) => {
    if (!positions || positions.length === 0) {
      return <Tag color="default">Chưa có vị trí</Tag>;
    }

    return (
      <Space size={[0, 4]} wrap>
        {positions.map((position) => (
          <Tag key={position._id} color="blue" style={{ fontSize: '11px' }}>
            {position.name}
          </Tag>
        ))}
      </Space>
    );
  };

  // Render thông tin học vị
  const renderDegrees = (degrees) => {
    if (!degrees || degrees.length === 0) {
      return <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa có thông tin</span>;
    }

    return (
      <Tooltip
        title={degrees.map((degree, index) => (
          <div key={index}>
            {degree.type} - {degree.major} ({degree.school})
            {degree.year && ` - ${degree.year}`}
          </div>
        ))}
      >
        <Tag color="green">
          {degrees[0].type} {degrees.length > 1 && `+${degrees.length - 1}`}
        </Tag>
      </Tooltip>
    );
  };

  // Render thông tin liên hệ
  const renderContactInfo = (teacher) => {
    const user = teacher.userId;
    return (
      <Space direction="vertical" size={2}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MailOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
          <span style={{ fontSize: '12px', color: '#666' }}>{user.email}</span>
        </div>
        {user.phoneNumber && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PhoneOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
            <span style={{ fontSize: '12px', color: '#666' }}>{user.phoneNumber}</span>
          </div>
        )}
      </Space>
    );
  };

  // Định nghĩa các cột của bảng
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: 'Mã GV',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code) => (
        <Tag color="volcano" style={{ fontWeight: 'bold', fontSize: '11px' }}>
          {code}
        </Tag>
      ),
    },
    {
      title: 'Thông tin cá nhân',
      key: 'personalInfo',
      width: 250,
      render: (_, record) => {
        const user = record.userId;
        return (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Avatar 
              src={user.avatar}
              icon={<UserOutlined />}
              size={40}
              style={{ backgroundColor: '#1890ff', flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontWeight: '600', 
                color: '#262626',
                marginBottom: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user.name}
              </div>
              {renderContactInfo(record)}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Vị trí công tác',
      dataIndex: 'teacherPositionsId',
      key: 'positions',
      width: 200,
      render: renderPositions,
    },
    {
      title: 'Học vị',
      dataIndex: 'degrees',
      key: 'degrees',
      width: 130,
      render: renderDegrees,
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
          text={isActive ? 'Đang công tác' : 'Nghỉ việc'}
        />
      ),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (startDate) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CalendarOutlined style={{ color: '#999', fontSize: '12px' }} />
          <span style={{ fontSize: '12px' }}>
            {startDate ? new Date(startDate).toLocaleDateString('vi-VN') : '--'}
          </span>
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 110,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              style={{ color: '#1890ff' }}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Xác nhận xóa"
            description={`Bạn có chắc chắn muốn xóa giáo viên "${record.userId.name}" không?`}
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                size="small"
              />
            </Tooltip>
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
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            allowClear
            style={{ width: 350 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
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
          Tổng cộng: <strong>{pagination.total}</strong> giáo viên
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={teachers}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `Hiển thị ${range[0]}-${range[1]} của ${total} giáo viên`,
          pageSizeOptions: ['5', '10', '20', '50'],
        }}
        onChange={onTableChange}
        className="custom-table"
        scroll={{ x: 1200 }}
        bordered
        size="middle"
        rowClassName={(record, index) => 
          index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
        }
      />
    </div>
  );
};

export default TeacherTable;