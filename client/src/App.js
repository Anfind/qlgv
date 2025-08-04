import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import 'antd/dist/reset.css';
import './App.css';

// Components
import Layout from './components/layout/Layout';
import TeacherListPage from './pages/teacher/TeacherListPage';
import TeacherFormPage from './pages/teacher/TeacherFormPage';
import PositionManagementPage from './pages/position/PositionManagementPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teachers" element={<TeacherListPage />} />
            <Route path="/teachers/create" element={<TeacherFormPage />} />
            <Route path="/teachers/edit/:id" element={<TeacherFormPage />} />
            <Route path="/positions" element={<PositionManagementPage />} />
          </Routes>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
