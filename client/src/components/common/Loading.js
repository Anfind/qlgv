import React from 'react';
import { Spin, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = ({ 
  size = 'large', 
  tip = 'Đang tải...', 
  spinning = true,
  children,
  style = {}
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 24 : 16 }} spin />;

  if (children) {
    // Wrapper mode - bao quanh children
    return (
      <Spin 
        indicator={antIcon} 
        spinning={spinning} 
        tip={tip}
        size={size}
      >
        {children}
      </Spin>
    );
  }

  // Standalone mode - hiển thị loading độc lập
  return (
    <div 
      className="loading-container"
      style={{ 
        textAlign: 'center',
        padding: '50px 0',
        ...style
      }}
    >
      <Space direction="vertical" size="middle">
        <Spin 
          indicator={antIcon} 
          size={size}
        />
        <div style={{ 
          color: '#8c8c8c',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {tip}
        </div>
      </Space>
    </div>
  );
};

export default Loading;