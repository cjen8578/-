import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Progress, Steps, Typography, Statistic, Row, Col } from 'antd';
import { api } from '../api';
import { TestTask } from '../types';

const { Title, Text } = Typography;

export default function ProcessingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<TestTask | null>(null);

  useEffect(() => {
    if (!id) return;
    let isSubscribed = true;
    
    // Start simulation
    api.simulateTaskProgress(id, (updatedTask) => {
      if (isSubscribed) {
        setTask(updatedTask);
        if (updatedTask.status === 'COMPLETED') {
          setTimeout(() => navigate(`/tasks/${id}/result`), 1000);
        }
      }
    });

    return () => { isSubscribed = false; };
  }, [id, navigate]);

  if (!task) return <div>加载任务中...</div>;

  const stages = ['初始化', '视频解析', '智能抽帧', 'OCR', '语言识别', '规则检测', '完成'];
  const currentStep = stages.indexOf(task.currentStage === 'Initialized' ? '初始化' : task.currentStage === 'Completed' ? '完成' : task.currentStage);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">正在执行测试任务</h1>
      
      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm p-8 text-center">
        <Progress type="circle" percent={task.progress} strokeColor="#FF8E8E" size={200} />
        <Title level={3} className="mt-6 mb-0 text-gray-700">{task.currentStage === 'Initialized' ? '初始化' : task.currentStage === 'Completed' ? '完成' : task.currentStage}</Title>
        <Text type="secondary">AI 正在处理视频帧，请稍候...</Text>
      </Card>

      <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <Steps current={currentStep} items={stages.filter(s => s !== '初始化' && s !== '完成').map(s => ({ title: s }))} />
      </Card>

      <Row gutter={16}>
        <Col span={8}>
          <Card><Statistic title="已处理帧数" value={task.processedFrames} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="检测帧数" value={task.testedFrames} /></Card>
        </Col>
        <Col span={8}>
          <Card><Statistic title="错误数量" value={task.errorCount} styles={{ content: { color: '#cf1322' } }} /></Card>
        </Col>
      </Row>
    </div>
  );
}
