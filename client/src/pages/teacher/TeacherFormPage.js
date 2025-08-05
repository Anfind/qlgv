import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Button, 
  Space, 
  Typography, 
  Row, 
  Col,
  Divider,
  Upload,
  message,
  Switch,
  Tag
} from 'antd';
import { 
  UserOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  UploadOutlined,
  SaveOutlined,
  RollbackOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { teacherAPI, positionAPI } from '../../services';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TeacherFormPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [fileList, setFileList] = useState([]);

  // Lấy danh sách vị trí công tác
  const fetchPositions = async () => {
    try {
      const response = await positionAPI.getAll();
      setPositions(response.data.filter(pos => pos.isActive));
    } catch (error) {
      message.error('Lỗi khi lấy danh sách vị trí: ' + error.message);
    }
  };

  // Lấy thông tin giáo viên (nếu đang chỉnh sửa)
  const fetchTeacher = async () => {
    if (!isEditing) return;
    
    try {
      setLoading(true);
      const response = await teacherAPI.getById(id);
      const teacher = response.data;
      
      // Điền dữ liệu vào form
      form.setFieldsValue({
        // Thông tin từ User
        name: teacher.userId.name,
        email: teacher.userId.email,
        phoneNumber: teacher.userId.phoneNumber,
        address: teacher.userId.address,
        identity: teacher.userId.identity,
        dob: teacher.userId.dob ? dayjs(teacher.userId.dob) : null,
        
        // Thông tin từ Teacher
        teacherPositionsId: teacher.teacherPositionsId.map(pos => pos._id),
        startDate: teacher.startDate ? dayjs(teacher.startDate) : null,
        endDate: teacher.endDate ? dayjs(teacher.endDate) : null,
        isActive: teacher.isActive
      });

      // Set degrees
      setDegrees(teacher.degrees || []);
      
    } catch (error) {
      message.error('Lỗi khi lấy thông tin giáo viên: ' + error.message);
      navigate('/teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
    fetchTeacher();
  }, [id]);

  // Xử lý thêm học vị
  const addDegree = () => {
    setDegrees([...degrees, {
      type: '',
      school: '',
      major: '',
      year: null,
      isGraduated: true
    }]);
  };

  // Xử lý xóa học vị
  const removeDegree = (index) => {
    const newDegrees = degrees.filter((_, i) => i !== index);
    setDegrees(newDegrees);
  };

  // Xử lý thay đổi thông tin học vị
  const updateDegree = (index, field, value) => {
    const newDegrees = [...degrees];
    newDegrees[index] = { ...newDegrees[index], [field]: value };
    setDegrees(newDegrees);
  };

  // Xử lý upload ảnh
  const handleUpload = {
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('Chỉ có thể upload file JPG/PNG!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Chuẩn bị dữ liệu
      const teacherData = {
        // Thông tin cá nhân
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        identity: values.identity,
        dob: values.dob ? values.dob.toISOString() : null,
        
        // Thông tin giáo viên
        teacherPositionsId: values.teacherPositionsId || [],
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        isActive: values.isActive !== undefined ? values.isActive : true,
        degrees: degrees.filter(degree => degree.type && degree.school && degree.major)
      };

      if (isEditing) {
        // Cập nhật giáo viên
        await teacherAPI.update(id, teacherData);
        message.success('Cập nhật thông tin giáo viên thành công!');
      } else {
        // Tạo mới giáo viên
        await teacherAPI.create(teacherData);
        message.success('Tạo giáo viên mới thành công!');
      }

      navigate('/teachers');
    } catch (error) {
      message.error(
        isEditing 
          ? 'Lỗi khi cập nhật giáo viên: ' + error.message
          : 'Lỗi khi tạo giáo viên: ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Validation rules
  const rules = {
    name: [
      { required: true, message: 'Vui lòng nhập họ tên!' },
      { min: 2, max: 100, message: 'Họ tên phải từ 2-100 ký tự!' }
    ],
    email: [
      { required: true, message: 'Vui lòng nhập email!' },
      { type: 'email', message: 'Email không hợp lệ!' }
    ],
    phoneNumber: [
      { pattern: /^[0-9+\-\s()]+$/, message: 'Số điện thoại không hợp lệ!' }
    ],
    identity: [
      { pattern: /^[0-9]+$/, message: 'Số CCCD chỉ được chứa số!' },
      { min: 9, max: 12, message: 'Số CCCD phải từ 9-12 số!' }
    ]
  };

  // Render form học vị
  const renderDegreeForm = () => (
    <Card 
      size="small" 
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BookOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          Thông tin học vị
        </div>
      }
      extra={
        <Button 
          type="primary" 
          size="small" 
          icon={<PlusOutlined />}
          onClick={addDegree}
        >
          Thêm học vị
        </Button>
      }
    >
      {degrees.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#999',
          fontStyle: 'italic' 
        }}>
          Chưa có thông tin học vị. Nhấn "Thêm học vị" để bắt đầu.
        </div>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {degrees.map((degree, index) => (
            <Card 
              key={index}
              size="small"
              style={{ backgroundColor: '#fafafa' }}
              title={`Học vị ${index + 1}`}
              extra={
                degrees.length > 0 && (
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeDegree(index)}
                  >
                    Xóa
                  </Button>
                )
              }
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Bậc học *</Text>
                  </div>
                  <Select
                    placeholder="Chọn bậc học"
                    style={{ width: '100%' }}
                    value={degree.type}
                    onChange={(value) => updateDegree(index, 'type', value)}
                  >
                    <Option value="Tiến sĩ">Tiến sĩ</Option>
                    <Option value="Thạc sĩ">Thạc sĩ</Option>
                    <Option value="Cử nhân">Cử nhân</Option>
                    <Option value="Kỹ sư">Kỹ sư</Option>
                    <Option value="Cơ sở">Cơ sở</Option>
                  </Select>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Trường *</Text>
                  </div>
                  <Input
                    placeholder="Tên trường"
                    value={degree.school}
                    onChange={(e) => updateDegree(index, 'school', e.target.value)}
                  />
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Chuyên ngành *</Text>
                  </div>
                  <Input
                    placeholder="Chuyên ngành"
                    value={degree.major}
                    onChange={(e) => updateDegree(index, 'major', e.target.value)}
                  />
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong>Năm tốt nghiệp</Text>
                  </div>
                  <Input
                    placeholder="YYYY"
                    type="number"
                    min={1950}
                    max={new Date().getFullYear()}
                    value={degree.year}
                    onChange={(e) => updateDegree(index, 'year', parseInt(e.target.value) || null)}
                  />
                </Col>
              </Row>
              
              <Row style={{ marginTop: '12px' }}>
                <Col span={24}>
                  <Switch
                    checked={degree.isGraduated}
                    onChange={(checked) => updateDegree(index, 'isGraduated', checked)}
                    checkedChildren="Đã tốt nghiệp"
                    unCheckedChildren="Chưa tốt nghiệp"
                  />
                </Col>
              </Row>
            </Card>
          ))}
        </Space>
      )}
    </Card>
  );

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <Title level={2} className="page-title">
          <UserOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          {isEditing ? 'Chỉnh sửa thông tin giáo viên' : 'Tạo giáo viên mới'}
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{ isActive: true }}
      >
        <Row gutter={24}>
          {/* Cột trái - Thông tin cá nhân */}
          <Col xs={24} lg={12}>
            <Card 
              title="Thông tin cá nhân" 
              className="custom-card"
              style={{ marginBottom: '24px' }}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="name" label="Họ và tên" rules={rules.name}>
                    <Input placeholder="Nhập họ và tên đầy đủ" size="large" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="dob" label="Ngày sinh">
                    <DatePicker 
                      placeholder="Chọn ngày sinh"
                      style={{ width: '100%' }}
                      size="large"
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="identity" label="Số CCCD" rules={rules.identity}>
                    <Input placeholder="Nhập số CCCD" size="large" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="email" label="Email" rules={rules.email}>
                    <Input placeholder="Nhập địa chỉ email" size="large" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="phoneNumber" label="Số điện thoại" rules={rules.phoneNumber}>
                    <Input placeholder="Nhập số điện thoại" size="large" />
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <Form.Item name="address" label="Địa chỉ">
                    <TextArea 
                      placeholder="Nhập địa chỉ cụ thể"
                      rows={3}
                    />
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <Form.Item label="Ảnh đại diện">
                    <Upload
                      {...handleUpload}
                      listType="picture-card"
                      fileList={fileList}
                      maxCount={1}
                    >
                      {fileList.length < 1 && (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Cột phải - Thông tin công việc */}
          <Col xs={24} lg={12}>
            <Card 
              title="Thông tin công việc" 
              className="custom-card"
              style={{ marginBottom: '24px' }}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="teacherPositionsId" label="Vị trí công tác">
                    <Select
                      mode="multiple"
                      placeholder="Chọn vị trí công tác"
                      style={{ width: '100%' }}
                      size="large"
                      showSearch
                      filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {positions.map(position => (
                        <Option key={position._id} value={position._id}>
                          <Space>
                            <Tag color="blue" style={{ fontSize: '11px' }}>
                              {position.code}
                            </Tag>
                            {position.name}
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="startDate" label="Ngày bắt đầu">
                    <DatePicker 
                      placeholder="Chọn ngày bắt đầu"
                      style={{ width: '100%' }}
                      size="large"
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item name="endDate" label="Ngày kết thúc">
                    <DatePicker 
                      placeholder="Chọn ngày kết thúc"
                      style={{ width: '100%' }}
                      size="large"
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>
                
                <Col span={24}>
                  <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
                    <Switch
                      checkedChildren="Đang công tác"
                      unCheckedChildren="Nghỉ việc"
                      size="default"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Phần học vị */}
        <Row>
          <Col span={24}>
            {renderDegreeForm()}
          </Col>
        </Row>

        <Divider />

        {/* Form Actions */}
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Space size="middle">
              <Button 
                size="large"
                icon={<RollbackOutlined />}
                onClick={() => navigate('/teachers')}
              >
                Quay lại
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<SaveOutlined />}
                style={{ minWidth: '120px' }}
              >
                {isEditing ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TeacherFormPage;