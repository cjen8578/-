import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tabs, Table, Button, Tag, Space, Statistic, Row, Col } from 'antd';
import { CloudUploadOutlined, PlayCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { api } from '../api';
import { Project, Video, TestTask } from '../types';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [tasks, setTasks] = useState<TestTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.getProject(id),
      api.getVideosByProject(id),
      api.getTasksByProject(id)
    ]).then(([p, v, t]) => {
      setProject(p || null);
      setVideos(v);
      setTasks(t);
      setLoading(false);
    });
  }, [id]);

  if (!project) return loading ? <div>加载中...</div> : <div>项目不存在</div>;

  const videoColumns = [
    { title: '文件名', dataIndex: 'filename', key: 'filename' },
    { title: '时长 (秒)', dataIndex: 'duration', key: 'duration' },
    { title: '总帧数', dataIndex: 'totalFrames', key: 'frames' },
    { 
      title: '操作', key: 'action', 
      render: (_: any, record: Video) => (
        <Button type="link" size="small" onClick={() => navigate(`/tasks/new?projectId=${project.id}&videoId=${record.id}`)}>
          开始测试
        </Button>
      ) 
    }
  ];

  const taskColumns = [
    { title: '任务 ID', dataIndex: 'id', key: 'id' },
    { title: '视频 ID', dataIndex: 'videoId', key: 'videoId' },
    { 
      title: '状态', dataIndex: 'status', key: 'status',
      render: (status: string) => <Tag color={status === 'COMPLETED' ? 'green' : 'blue'}>{status}</Tag>
    },
    { 
      title: '操作', key: 'action',
      render: (_: any, record: TestTask) => <Link to={`/tasks/${record.id}/result`}>查看结果</Link>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.name}</h1>
          <Space>
            <Tag color="cyan">{project.targetLanguage}</Tag>
            <Tag color="purple">{project.testMode}</Tag>
            <Tag color="green">{project.status}</Tag>
          </Space>
        </div>
        <Space>
          <Button icon={<SettingOutlined />} onClick={() => navigate(`/projects/${project.id}/regions`)}>配置区域</Button>
          <Button type="primary" icon={<CloudUploadOutlined />} className="bg-[#FF8E8E]" onClick={() => navigate(`/projects/${project.id}/upload`)}>
            上传视频
          </Button>
        </Space>
      </div>

      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="视频" value={videos.length} /></Card></Col>
        <Col span={6}><Card><Statistic title="测试任务" value={tasks.length} /></Card></Col>
        <Col span={6}><Card><Statistic title="PASS" value={12} styles={{ content: { color: '#3f8600' } }} /></Card></Col>
        <Col span={6}><Card><Statistic title="REVIEW" value={5} styles={{ content: { color: '#cf1322' } }} /></Card></Col>
      </Row>

      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm mt-6">
        <Tabs defaultActiveKey="videos" items={[
          {
            key: 'videos',
            label: '视频列表',
            children: <Table columns={videoColumns} dataSource={videos} rowKey="id" pagination={{pageSize: 5}} />
          },
          {
            key: 'tasks',
            label: '测试任务',
            children: <Table columns={taskColumns} dataSource={tasks} rowKey="id" pagination={{pageSize: 5}} />
          }
        ]} />
      </Card>
    </div>
  );
}
