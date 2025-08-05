import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, message, Row, Col, Statistic } from 'antd';
import { PlusOutlined, TeamOutlined, UserOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import TeacherTable from '../../components/teacher/TeacherTable';
import { teacherAPI } from '../../services';

const { Title, Paragraph } = Typography;

const TeacherListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const navigate = useNavigate();

  // Lấy danh sách giáo viên
  const fetchTeachers = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      const response = await teacherAPI.getAll({
        page,
        limit,
        search
      });
      
      setTeachers(response.data.teachers);
      setPagination({
        current: response.data.pagination.currentPage,
        pageSize: response.data.pagination.itemsPerPage,
        total: response.data.pagination.totalItems
      });
    } catch (error) {
      message.error('Lỗi khi lấy danh sách giáo viên: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Lấy thống kê giáo viên
  const fetchStats = async () => {
    try {
      const response = await teacherAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchStats();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    fetchTeachers(1, pagination.pageSize, value);
  };

  // Xử lý thay đổi pagination
  const handleTableChange = (newPagination) => {
    fetchTeachers(newPagination.current, newPagination.pageSize, searchText);
  };

  // Xử lý xóa giáo viên
  const handleDelete = async (id) => {
    try {
      await teacherAPI.delete(id);
      message.success('Xóa giáo viên thành công');
      fetchTeachers(pagination.current, pagination.pageSize, searchText);
      fetchStats(); // Refresh stats
    } catch (error) {
      message.error('Lỗi khi xóa giáo viên: ' + error.message);
    }
  };

  // Xử lý chỉnh sửa giáo viên
  const handleEdit = (teacher) => {
    navigate(`/teachers/edit/${teacher._id}`);
  };

  // Xử lý tạo mới giáo viên
  const handleCreate = () => {
    navigate('/teachers/create');
  };

  // Thống kê cards
  const statsCards = [
    {
      title: 'Tổng số giáo viên',
      value: stats.total,
      icon: <TeamOutlined />,
      color: '#1890ff',
    },
    {
      title: 'Đang công tác',
      value: stats.active,
      icon: <UserOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Nghỉ việc',
      value: stats.inactive,
      icon: <UserAddOutlined />,
      color: '#fa8c16',
    },
  ];

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} className="page-title">
              <TeamOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              Quản lý giáo viên
            </Title>
            <Paragraph className="page-description">
              Quản lý thông tin và hồ sơ giáo viên trong trường học
            </Paragraph>
          </div>
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreate}
            style={{ minWidth: '140px' }}
          >
            Tạo mới
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {statsCards.map((stat, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card className="stats-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', color: stat.color, marginBottom: '8px' }}>
                {stat.icon}
              </div>
              <Statistic
                title={stat.title}
                value={stat.value}
                valueStyle={{ 
                  color: stat.color,
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Teacher Table */}
      <Card className="custom-card">
        <TeacherTable
          teachers={teachers}
          loading={loading}
          pagination={pagination}
          onSearch={handleSearch}
          onTableChange={handleTableChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={() => {
            fetchTeachers(pagination.current, pagination.pageSize, searchText);
            fetchStats();
          }}
        />
      </Card>
    </div>
  );
};

export default TeacherListPage;