import API from './api';

// API cho Vị trí công tác
export const positionAPI = {
  // Lấy danh sách tất cả vị trí công tác
  getAll: () => API.get('/positions'),
  
  // Lấy thông tin chi tiết một vị trí công tác
  getById: (id) => API.get(`/positions/${id}`),
  
  // Tạo vị trí công tác mới
  create: (data) => API.post('/positions', data),
  
  // Cập nhật vị trí công tác
  update: (id, data) => API.put(`/positions/${id}`, data),
  
  // Xóa vị trí công tác
  delete: (id) => API.delete(`/positions/${id}`)
};

// API cho Giáo viên
export const teacherAPI = {
  // Lấy danh sách tất cả giáo viên
  getAll: (params) => API.get('/teachers', { params }),
  
  // Lấy thông tin chi tiết một giáo viên
  getById: (id) => API.get(`/teachers/${id}`),
  
  // Tạo giáo viên mới
  create: (data) => API.post('/teachers', data),
  
  // Cập nhật thông tin giáo viên
  update: (id, data) => API.put(`/teachers/${id}`, data),
  
  // Xóa giáo viên
  delete: (id) => API.delete(`/teachers/${id}`),
  
  // Lấy thống kê giáo viên
  getStats: () => API.get('/teachers/stats')
};

// API cho Người dùng
export const userAPI = {
  // Lấy danh sách tất cả người dùng
  getAll: (params) => API.get('/users', { params }),
  
  // Lấy thông tin chi tiết một người dùng
  getById: (id) => API.get(`/users/${id}`),
  
  // Tạo người dùng mới
  create: (data) => API.post('/users', data),
  
  // Cập nhật thông tin người dùng
  update: (id, data) => API.put(`/users/${id}`, data),
  
  // Xóa người dùng
  delete: (id) => API.delete(`/users/${id}`)
};
