import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Upload, Button, message, Progress, Descriptions, Space } from 'antd';
import { InboxOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { api } from '../api';
import { Video } from '../types';

const { Dragger } = Upload;

export default function UploadVideo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState<Video | null>(null);

  const customRequest = async ({ file, onSuccess, onError, onProgress }: any) => {
    setUploading(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return p;
        }
        return p + 10;
      });
    }, 200);

    try {
      const v = await api.uploadVideo(id!, file as File);
      clearInterval(interval);
      setProgress(100);
      setUploadedVideo(v);
      onSuccess('ok');
    } catch (e) {
      clearInterval(interval);
      onError(e);
      message.error('上传失败');
    }
    setUploading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">上传视频</h1>
      
      {!uploadedVideo ? (
        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <Dragger 
            customRequest={customRequest} 
            showUploadList={false}
            accept=".mp4,.mov,.mkv,.avi"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="text-[#FF8E8E]" />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">支持 MP4, MOV, MKV, AVI 格式</p>
          </Dragger>

          {uploading && (
            <div className="mt-8">
              <p className="mb-2 text-gray-500 text-sm">上传中...</p>
              <Progress percent={progress} strokeColor="#FF8E8E" />
            </div>
          )}
        </Card>
      ) : (
        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex gap-6">
            <div className="w-1/3">
              <img src={uploadedVideo.thumbnailUrl} alt="thumbnail" className="w-full rounded-xl" />
            </div>
            <div className="w-2/3">
              <Descriptions title="视频详情" column={1}>
                <Descriptions.Item label="文件名">{uploadedVideo.filename}</Descriptions.Item>
                <Descriptions.Item label="大小">{(uploadedVideo.size / 1024 / 1024).toFixed(2)} MB</Descriptions.Item>
                <Descriptions.Item label="时长">{uploadedVideo.duration}秒</Descriptions.Item>
                <Descriptions.Item label="分辨率">{uploadedVideo.resolution}</Descriptions.Item>
                <Descriptions.Item label="帧率">{uploadedVideo.fps}</Descriptions.Item>
                <Descriptions.Item label="总帧数">{uploadedVideo.totalFrames}</Descriptions.Item>
              </Descriptions>
              
              <Space className="mt-6">
                <Button onClick={() => navigate(`/projects/${id}`)}>返回项目</Button>
                <Button type="primary" className="bg-[#FF8E8E] border-none" icon={<PlayCircleOutlined />} onClick={() => navigate(`/tasks/new?projectId=${id}&videoId=${uploadedVideo.id}`)}>
                  开始语言测试
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
