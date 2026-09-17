import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Statistic, Tag, Table, Button, Badge } from 'antd';
import { api } from '../api';
import { TestResult, ReviewCase, Project, Video } from '../types';

export default function ResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState<TestResult | null>(null);
  const [reviews, setReviews] = useState<ReviewCase[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getResultByTask(id).then(async res => {
      if (res) {
        setResult(res);
        const [revs, task] = await Promise.all([
          api.getReviewsByTask(id),
          api.getTask(id)
        ]);
        setReviews(revs);
        if (task) {
          const [p, vs] = await Promise.all([
            api.getProject(task.projectId),
            api.getVideosByProject(task.projectId)
          ]);
          setProject(p || null);
          setVideo(vs.find(v => v.id === task.videoId) || null);
        }
      }
    });
  }, [id]);

  if (!result || !project || !video) return <div>加载结果中...</div>;

  const resultColors = {
    PASS: 'green',
    FAIL: 'red',
    REVIEW: 'orange'
  };

  const columns = [
    { title: '时间 (秒)', dataIndex: 'time', key: 'time' },
    { 
      title: '截图', dataIndex: 'imageUrl', key: 'image',
      render: (url: string) => <img src={url} alt="frame" className="w-24 h-auto rounded" />
    },
    { title: '字幕区域', dataIndex: ['region', 'name'], key: 'region' },
    { title: 'OCR 文字', dataIndex: 'ocrText', key: 'ocr' },
    { title: '目标语言', dataIndex: 'expectedLanguage', key: 'expected' },
    { title: '检测语言', dataIndex: 'detectedLanguage', key: 'detected' },
    { 
      title: '状态', dataIndex: 'status', key: 'status',
      render: (val: string) => <Tag color={val === 'OPEN' ? 'red' : 'green'}>{val}</Tag>
    },
    { 
      title: '操作', key: 'action',
      render: (_: any, record: ReviewCase) => (
        record.status === 'OPEN' ? <Link to={`/reviews/${record.id}`}>人工审核</Link> : <span>已审核</span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">测试结果</h1>
          <div className="flex gap-4 text-gray-500">
            <span>视频: <span className="font-semibold text-gray-700">{video.filename}</span></span>
            <span>目标语言: <span className="font-semibold text-gray-700">{project.targetLanguage}</span></span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">最终结果</div>
          <Tag color={resultColors[result.finalResult]} className="text-xl px-4 py-1 !mr-0">
            {result.finalResult}
          </Tag>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={6}><Card><Statistic title="总帧数" value={result.totalFrames} /></Card></Col>
        <Col span={6}><Card><Statistic title="检测帧数" value={result.testedFrames} /></Card></Col>
        <Col span={4}><Card><Statistic title="一致" value={result.consistent} styles={{ content: { color: '#3f8600' } }} /></Card></Col>
        <Col span={4}><Card><Statistic title="不一致" value={result.inconsistent} styles={{ content: { color: '#cf1322' } }} /></Card></Col>
        <Col span={4}><Card><Statistic title="待人工确认" value={result.pendingReview} styles={{ content: { color: '#faad14' } }} /></Card></Col>
      </Row>

      <Card title="问题列表" className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <Table columns={columns} dataSource={reviews} rowKey="id" pagination={false} />
      </Card>
      
      <div className="flex justify-end">
        <Button type="primary" size="large" className="bg-[#FF8E8E] border-none" disabled={result.pendingReview > 0}>
          生成报告
        </Button>
      </div>
    </div>
  );
}
