import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Tag } from 'antd';
import { api } from '../api';
import { Project, TestTask } from '../types';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0, videos: 0, tasks: 0, pass: 0, fail: 0, review: 0
  });
  const [recentTasks, setRecentTasks] = useState<TestTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const projects = await api.getProjects();
      const allTasks: TestTask[] = [];
      let vidCount = 0;
      for (const p of projects) {
        vidCount += p.videoCount;
        const tasks = await api.getTasksByProject(p.id);
        allTasks.push(...tasks);
      }
      
      const reviews = await api.getPendingReviews();

      setStats({
        projects: projects.length,
        videos: vidCount,
        tasks: allTasks.length,
        pass: 12, // Mocked
        fail: 3,  // Mocked
        review: reviews.length
      });
      setRecentTasks(allTasks.slice(0, 5));
      setLoading(false);
    };
    load();
  }, []);

  const columns = [
    { title: '任务 ID', dataIndex: 'id', key: 'id' },
    { title: '项目', dataIndex: 'projectId', key: 'projectId' },
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
      <Row gutter={[16, 16]}>
        <Col span={8}><Card loading={loading}><Statistic title="项目总数" value={stats.projects} /></Card></Col>
        <Col span={8}><Card loading={loading}><Statistic title="视频总数" value={stats.videos} /></Card></Col>
        <Col span={8}><Card loading={loading}><Statistic title="待人工审核" value={stats.review} styles={{ content: { color: '#FF8E8E' } }} /></Card></Col>
      </Row>

      <Card title="最近测试任务" className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <Table dataSource={recentTasks} columns={columns} rowKey="id" pagination={false} loading={loading} />
      </Card>
    </div>
  );
}
