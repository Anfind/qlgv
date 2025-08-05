import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Button, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const PositionForm = ({ visible, onSubmit, onCancel, initialValues, loading }) => {
  const [form] = Form.useForm();

  // Reset form khi modal mở/đóng hoặc khi có initialValues
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        // Chế độ chỉnh sửa - điền dữ liệu có sẵn
        form.setFieldsValue({
          code: initialValues.code,
          name: initialValues.name,
          des: initialValues.des || '',
          isActive: initialValues.isActive
        });
      } else {
        // Chế độ tạo mới - reset form
        form.resetFields();
        form.setFieldsValue({
          isActive: true // Mặc định là hoạt động
        });
      }
    }
  }, [visible, initialValues, form]);

  // Xử lý submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  // Xử lý đóng modal
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Validation rules
  const validationRules = {
    code: [
      { required: true, message: 'Vui lòng nhập mã vị trí!' },
      { min: 2, max: 20, message: 'Mã vị trí phải từ 2-20 ký tự!' },
      { 
        pattern: /^[A-Z0-9_]+$/, 
        message: 'Mã vị trí chỉ được chứa chữ hoa, số và dấu gạch dưới!' 
      }
    ],
    name: [
      { required: true, message: 'Vui lòng nhập tên vị trí!' },
      { min: 2, max: 100, message: 'Tên vị trí phải từ 2-100 ký tự!' }
    ],
    des: [
      { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
    ]
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SettingOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          {initialValues ? 'Chỉnh sửa vị trí công tác' : 'Tạo vị trí công tác mới'}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose={true}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isActive: true }}
        autoComplete="off"
      >
        <Form.Item
          name="code"
          label="Mã vị trí"
          rules={validationRules.code}
          tooltip="Mã vị trí phải viết hoa, có thể chứa số và dấu gạch dưới"
        >
          <Input 
            placeholder="Ví dụ: GV_TOAN, QL_PHONG"
            style={{ textTransform: 'uppercase' }}
            onChange={(e) => {
              // Tự động chuyển thành chữ hoa
              e.target.value = e.target.value.toUpperCase();
            }}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên vị trí"
          rules={validationRules.name}
        >
          <Input placeholder="Ví dụ: Giáo viên Toán, Quản lý phòng học" />
        </Form.Item>

        <Form.Item
          name="des"
          label="Mô tả"
          rules={validationRules.des}
        >
          <TextArea 
            rows={4}
            placeholder="Mô tả chi tiết về vị trí công tác..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          label="Trạng thái"
          valuePropName="checked"
        >
          <Switch
            checkedChildren="Hoạt động"
            unCheckedChildren="Không hoạt động"
            style={{ marginTop: '4px' }}
          />
        </Form.Item>

        {/* Form Actions */}
        <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
              style={{ minWidth: '100px' }}
            >
              {initialValues ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PositionForm;