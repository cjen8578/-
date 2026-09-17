import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { api } from '../api';
import { Project, Video } from '../types';

export default function TaskDetail() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const videoId = searchParams.get('videoId');
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId && videoId) {
      Promise.all([
        api.getProject(projectId),
        api.getVideosByProject(projectId).then(vs => vs.find(v => v.id === videoId))
      ]).then(([p, v]) => {
        setProject(p || null);
        setVideo(v || null);
      });
    }
  }, [projectId, videoId]);

  const handleStart = async () => {
    if (!projectId || !videoId) return;
    setLoading(true);
    try {
      const task = await api.createTask(projectId, videoId);
      navigate(`/tasks/${task.id}/processing`);
    } catch {
      message.error('创建任务失败');
      setLoading(false);
    }
  };

  if (!project || !video) return <div>加载配置中...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">测试配置确认</h1>
      
      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <Descriptions column={1} bordered className="bg-white">
          <Descriptions.Item label="视频文件">{video.filename}</Descriptions.Item>
          <Descriptions.Item label="目标语言">{project.targetLanguage}</Descriptions.Item>
          <Descriptions.Item label="测试模式">{project.testMode}</Descriptions.Item>
          <Descriptions.Item label="字幕区域">
            {project.regions.map(r => r.name).join(', ') || '未配置'}
          </Descriptions.Item>
        </Descriptions>
        
        <div className="flex justify-end gap-4 mt-8">
          <Button size="large" onClick={() => navigate(`/projects/${projectId}`)}>取消</Button>
          <Button size="large" type="primary" className="bg-[#FF8E8E] border-none" icon={<PlayCircleOutlined />} onClick={handleStart} loading={loading}>
            开始测试
          </Button>
        </div>
      </Card>
    </div>
  );
}
