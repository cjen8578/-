import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Tag, Descriptions, message } from 'antd';
import { api } from '../api';
import { ReviewCase } from '../types';

export default function ReviewDetail({ isQueue = false }: { isQueue?: boolean }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState<ReviewCase | null>(null);
  const [queue, setQueue] = useState<ReviewCase[]>([]);

  useEffect(() => {
    const load = async () => {
      if (isQueue) {
        const q = await api.getPendingReviews();
        setQueue(q);
        if (q.length > 0) setReview(q[0]);
      } else if (id) {
        // mock resolving from global state could be tricky if not in queue
        const q = await api.getPendingReviews();
        const found = q.find(r => r.id === id);
        if (found) setReview(found);
      }
    };
    load();
  }, [id, isQueue]);

  const handleDecision = async (decision: string) => {
    if (!review) return;
    try {
      await api.updateReviewStatus(review.id, 'REVIEWED', decision);
      message.success('结果已保存');
      if (isQueue && queue.length > 1) {
        const nextQueue = queue.slice(1);
        setQueue(nextQueue);
        setReview(nextQueue[0]);
      } else {
        navigate(-1); // go back
      }
    } catch {
      message.error('保存结果失败');
    }
  };

  if (isQueue && queue.length === 0) {
    return <div className="text-xl text-center py-20 text-gray-500">当前没有待审核的任务！🎉</div>;
  }

  if (!review) return <div>加载审核信息中...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">人工审核</h1>
        {isQueue && <Tag color="blue">剩余 {queue.length} 条待审核</Tag>}
      </div>

      <Row gutter={24}>
        <Col span={14}>
          <Card title="视频与画面上下文" className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <div className="bg-black aspect-video rounded-xl flex items-center justify-center text-white mb-4 relative">
              {/* Mock Video Player */}
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center rounded-xl overflow-hidden">
                 <img src={review.imageUrl} className="w-full h-full object-cover opacity-50" alt="Video Player Mock" />
                 <span className="z-10">模拟视频播放器 @ {review.time}s</span>
              </div>
            </div>
            
            <Descriptions title="帧数据" column={2}>
              <Descriptions.Item label="时间">{review.time}秒</Descriptions.Item>
              <Descriptions.Item label="字幕区域">{review.region.name}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={10}>
          <Card title="AI 分析结果" className="shadow-sm border-0 bg-white/80 backdrop-blur-sm mb-6">
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">OCR 文字</div>
                <div className="text-xl font-mono bg-gray-50 p-3 rounded-lg border border-gray-100">{review.ocrText}</div>
                <div className="text-xs text-gray-400 mt-1">置信度: {(review.ocrConfidence * 100).toFixed(1)}%</div>
              </div>
              
              <Row>
                <Col span={12}>
                  <div className="text-sm text-gray-500 mb-1">目标语言</div>
                  <Tag color="blue">{review.expectedLanguage}</Tag>
                </Col>
                <Col span={12}>
                  <div className="text-sm text-gray-500 mb-1">检测语言</div>
                  <Tag color="red">{review.detectedLanguage}</Tag>
                  <div className="text-xs text-gray-400 mt-1">置信度: {(review.languageConfidence * 100).toFixed(1)}%</div>
                </Col>
              </Row>
            </div>
          </Card>

          <Card title="人工确认结果" className="shadow-sm border-0 bg-white/80 backdrop-blur-sm bg-gradient-to-b from-white to-[#FFFDF9]">
            <p className="text-gray-600 mb-4">请选择截图中文字的实际语言：</p>
            <div className="grid grid-cols-2 gap-3">
              <Button size="large" onClick={() => handleDecision('English')}>English</Button>
              <Button size="large" onClick={() => handleDecision('Chinese')}>Chinese</Button>
              <Button size="large" onClick={() => handleDecision('Other Language')}>Other Language</Button>
              <Button size="large" onClick={() => handleDecision('Ignore')}>忽略 (非文字)</Button>
              <Button size="large" danger className="col-span-2" onClick={() => handleDecision('Retry OCR')}>重试 OCR</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
