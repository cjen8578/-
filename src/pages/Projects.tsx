import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Project } from '../types';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const columns = [
    { title: '项目名称', dataIndex: 'name', key: 'name', render: (text: string, record: Project) => <Link to={`/projects/${record.id}`} className="font-semibold">{text}</Link> },
    { title: '目标语言', dataIndex: 'targetLanguage', key: 'lang' },
    { title: '测试模式', dataIndex: 'testMode', key: 'mode' },
    { title: '视频数量', dataIndex: 'videoCount', key: 'vids' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (val: string) => <Tag color="green">{val}</Tag> },
    { 
      title: '操作', key: 'action',
      render: (_: any, record: Project) => (
        <Space>
          <Link to={`/projects/${record.id}`}>查看</Link>
          <Link to={`/projects/${record.id}/regions`}>配置区域</Link>
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">项目列表</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/projects/create')} className="bg-[#FF8E8E] hover:!bg-[#ff7575] border-none">
          创建项目
        </Button>
      </div>
      
      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <Table columns={columns} dataSource={projects} rowKey="id" loading={loading} />
      </Card>
    </div>
  );
}
