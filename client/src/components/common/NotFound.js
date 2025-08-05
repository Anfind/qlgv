import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = ({ 
  status = '404',
  title = 'Không tìm thấy trang',
  subTitle = 'Xin lỗi, trang bạn truy cập không tồn tại.',
  showBackButton = true
}) => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ 
      background: 'white',
      borderRadius: '12px',
      padding: '40px 20px',
      textAlign: 'center',
      margin: '20px 0'
    }}>
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={
          showBackButton && (
            <div>
              <Button type="primary" onClick={handleBackHome} style={{ marginRight: '12px' }}>
                Về trang chủ
              </Button>
              <Button onClick={handleGoBack}>
                Quay lại
              </Button>
            </div>
          )
        }
      />
    </div>
  );
};

export default NotFound;