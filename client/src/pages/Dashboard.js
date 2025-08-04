import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Button, Space, Typography } from 'antd';
import { 
  TeamOutlined, 
  UserAddOutlined, 
  SettingOutlined,
  TrophyOutlined,
  BookOutlined,
  UserOutlined
} from '@ant-design/icons';
import { teacherAPI } from '../services';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await teacherAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Tổng số giáo viên',
      value: stats.total,
      icon: <TeamOutlined />,
      color: '#1890ff',
      bgColor: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
    },
    {
      title: 'Đang công tác',
      value: stats.active,
      icon: <UserOutlined />,
      color: '#52c41a',
      bgColor: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
    },
    {
      title: 'Nghỉ việc',
      value: stats.inactive,
      icon: <UserAddOutlined />,
      color: '#fa8c16',
      bgColor: 'linear-gradient(135deg, #fff7e6 0%, #ffd591 100%)',
    },
  ];

  const quickActions = [
    {
      title: 'Thêm giáo viên mới',
      description: 'Tạo hồ sơ giáo viên mới',
      icon: <UserAddOutlined />,
      color: '#1890ff',
      action: () => navigate('/teachers/create')
    },
    {
      title: 'Quản lý vị trí',
      description: 'Cấu hình vị trí công tác',
      icon: <SettingOutlined />,
      color: '#52c41a',
      action: () => navigate('/positions')
    },
    {
      title: 'Danh sách giáo viên',
      description: 'Xem tất cả giáo viên',
      icon: <TeamOutlined />,
      color: '#fa8c16',
      action: () => navigate('/teachers')
    },
  ];

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <Title level={2} className="page-title">
          Trang chủ
        </Title>
        <Paragraph className="page-description">
          Chào mừng bạn đến với hệ thống quản lý thông tin giáo viên
        </Paragraph>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {statsCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card 
              className="stats-card"
              loading={loading}
              style={{ height: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div 
                    className="stats-icon"
                    style={{ 
                      background: stat.bgColor,
                      color: stat.color,
                      marginBottom: '16px'
                    }}
                  >
                    {stat.icon}
                  </div>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    valueStyle={{ 
                      color: stat.color,
                      fontSize: '32px',
                      fontWeight: 'bold'
                    }}
                  />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TrophyOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                Thao tác nhanh
              </div>
            }
            className="custom-card"
          >
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card
                    hoverable
                    style={{ 
                      textAlign: 'center',
                      border: '1px solid #f0f0f0',
                      borderRadius: '12px',
                      height: '100%'
                    }}
                    bodyStyle={{ padding: '24px 16px' }}
                    onClick={action.action}
                  >
                    <div 
                      style={{ 
                        fontSize: '32px', 
                        color: action.color,
                        marginBottom: '16px'
                      }}
                    >
                      {action.icon}
                    </div>
                    <Title level={5} style={{ marginBottom: '8px' }}>
                      {action.title}
                    </Title>
                    <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                      {action.description}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BookOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                Thông tin hệ thống
              </div>
            }
            className="custom-card"
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={5}>Phiên bản hệ thống</Title>
                <Paragraph type="secondary">v1.0.0</Paragraph>
              </div>
              
              <div>
                <Title level={5}>Cập nhật lần cuối</Title>
                <Paragraph type="secondary">
                  {new Date().toLocaleDateString('vi-VN')}
                </Paragraph>
              </div>
              
              <div>
                <Title level={5}>Hỗ trợ</Title>
                <Space>
                  <Button type="link" style={{ paddingLeft: 0 }}>
                    Hướng dẫn sử dụng
                  </Button>
                  <Button type="link">
                    Liên hệ
                  </Button>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
