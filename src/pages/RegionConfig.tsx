import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Form, InputNumber, Row, Col, message } from 'antd';
import { api } from '../api';
import { Project, ProjectRegion } from '../types';

export default function RegionConfig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [regions, setRegions] = useState<ProjectRegion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      api.getProject(id).then(p => {
        if (p) {
          setProject(p);
          if (p.regions.length === 0) {
            setRegions([{ id: `r_${Date.now()}`, projectId: p.id, name: 'English Region', x: 0.1, y: 0.8, width: 0.8, height: 0.1 }]);
          } else {
            setRegions(p.regions);
          }
        }
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await api.updateProjectRegions(id, regions);
      message.success('区域保存成功');
      navigate(`/projects/${id}`);
    } catch {
      message.error('保存失败');
    }
    setLoading(false);
  };

  const updateRegion = (index: number, field: keyof ProjectRegion, value: any) => {
    const newRegions = [...regions];
    newRegions[index] = { ...newRegions[index], [field]: value };
    setRegions(newRegions);
  };

  if (!project) return <div>加载中...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">字幕区域配置</h1>
      <Row gutter={24}>
        <Col span={14}>
          <Card className="bg-gray-900 border-0 flex items-center justify-center relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">视频预览区域</div>
            {regions.map((r, i) => (
              <div 
                key={r.id}
                className="absolute border-2 border-red-500 bg-red-500/20 backdrop-blur-sm"
                style={{
                  left: `${r.x * 100}%`,
                  top: `${r.y * 100}%`,
                  width: `${r.width * 100}%`,
                  height: `${r.height * 100}%`
                }}
              >
                <span className="text-xs text-white bg-red-500 px-1">{r.name}</span>
              </div>
            ))}
          </Card>
        </Col>
        <Col span={10}>
          <Card title="区域设置" className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            {regions.map((r, i) => (
              <div key={r.id} className="mb-6 p-4 border border-gray-100 rounded-xl bg-gray-50">
                <h3 className="font-semibold mb-4">{r.name}</h3>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item label="X (横坐标)">
                      <InputNumber min={0} max={1} step={0.01} value={r.x} onChange={v => updateRegion(i, 'x', v)} className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Y (纵坐标)">
                      <InputNumber min={0} max={1} step={0.01} value={r.y} onChange={v => updateRegion(i, 'y', v)} className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="宽度">
                      <InputNumber min={0} max={1} step={0.01} value={r.width} onChange={v => updateRegion(i, 'width', v)} className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="高度">
                      <InputNumber min={0} max={1} step={0.01} value={r.height} onChange={v => updateRegion(i, 'height', v)} className="w-full" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ))}
            <Button type="primary" size="large" onClick={handleSave} loading={loading} className="w-full bg-[#FF8E8E] border-none">
              保存区域
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
