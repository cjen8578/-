import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, ConfigProvider } from 'antd';
import { 
  DashboardOutlined, 
  ProjectOutlined, 
  SettingOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';

// Pages imports (we will create these)
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import RegionConfig from './pages/RegionConfig';
import UploadVideo from './pages/UploadVideo';
import TaskDetail from './pages/TaskDetail';
import ProcessingPage from './pages/ProcessingPage';
import ResultPage from './pages/ResultPage';
import ReviewDetail from './pages/ReviewDetail';
import Settings from './pages/Settings';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: <Link to="/">仪表盘</Link> },
    { key: '/projects', icon: <ProjectOutlined />, label: <Link to="/projects">项目管理</Link> },
    { key: '/reviews', icon: <CheckSquareOutlined />, label: <Link to="/reviews">人工审核</Link> },
    { key: '/settings', icon: <SettingOutlined />, label: <Link to="/settings">系统设置</Link> },
  ];

  return (
    <Layout className="min-h-screen bg-[#FFFDF9]">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="light"
        className="border-r border-gray-200"
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-100">
          <span className={`font-bold text-[#FF8E8E] text-xl transition-all ${collapsed ? 'scale-0 hidden' : 'scale-100'}`}>
            字幕质量检测
          </span>
          <span className={`font-bold text-[#FF8E8E] text-xl transition-all ${collapsed ? 'scale-100' : 'scale-0 hidden'}`}>
            QA
          </span>
        </div>
        <Menu 
          mode="inline" 
          selectedKeys={[location.pathname.split('/')[1] ? `/${location.pathname.split('/')[1]}` : '/']} 
          items={menuItems}
          className="bg-transparent border-none mt-4"
        />
      </Sider>
      <Layout className="bg-[#FFFDF9]">
        <Header className="bg-white/50 backdrop-blur-md border-b border-gray-200 px-6 flex items-center">
          <Title level={4} className="!mb-0 text-gray-800">
            {menuItems.find(m => m.key === (location.pathname.split('/')[1] ? `/${location.pathname.split('/')[1]}` : '/'))?.label.props.children || '仪表盘'}
          </Title>
        </Header>
        <Content className="p-6 overflow-auto">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FF8E8E',
          colorBgBase: '#FFFDF9',
          colorBgContainer: '#FFFFFF',
          borderRadius: 16,
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        components: {
          Card: {
            borderRadiusLG: 24,
          },
          Button: {
            borderRadius: 12,
            controlHeight: 40,
          }
        }
      }}
    >
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/create" element={<CreateProject />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects/:id/regions" element={<RegionConfig />} />
            <Route path="/projects/:id/upload" element={<UploadVideo />} />
            
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/tasks/:id/processing" element={<ProcessingPage />} />
            <Route path="/tasks/:id/result" element={<ResultPage />} />
            
            <Route path="/reviews" element={<ReviewDetail isQueue />} />
            <Route path="/reviews/:id" element={<ReviewDetail />} />
            
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
}
