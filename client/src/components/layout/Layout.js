import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/teachers',
      icon: <TeamOutlined />,
      label: 'Quản lý giáo viên',
    },
    {
      key: '/positions',
      icon: <SettingOutlined />,
      label: 'Vị trí công tác',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      // Handle logout logic here
      console.log('Đăng xuất');
    }
  };

  return (
    <AntLayout className="main-layout">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0',
          background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
          color: 'white'
        }}>
          {!collapsed ? (
            <div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                QLGV
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                Quản lý giáo viên
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Q</div>
          )}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            border: 'none',
            padding: '16px 8px'
          }}
        />
      </Sider>

      <AntLayout>
        <Header 
          style={{ 
            padding: '0 24px', 
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 40,
                height: 40,
                marginRight: '16px'
              }}
            />
            <div>
              <Text strong style={{ fontSize: '16px', color: '#262626' }}>
                {menuItems.find(item => item.key === location.pathname)?.label || 'Hệ thống quản lý'}
              </Text>
            </div>
          </div>

          <Space size="middle">
            <Button 
              type="text" 
              icon={<BellOutlined />} 
              style={{ fontSize: '16px' }}
            />
            
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick
              }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer', padding: '8px' }}>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text strong style={{ fontSize: '14px' }}>Admin</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Quản trị viên</Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className="main-content">
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
