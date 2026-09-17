import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function CreateProject() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const newProj = await api.createProject({
        name: values.name,
        targetLanguage: values.testMode === 'Chinese' ? 'Chinese' : 'English',
        testMode: values.testMode,
      });
      message.success('项目创建成功');
      navigate(`/projects/${newProj.id}/regions`);
    } catch (e) {
      message.error('创建项目失败');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="创建新项目" className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input size="large" placeholder="请输入项目名称" />
          </Form.Item>
          
          <Form.Item name="testMode" label="测试模式" rules={[{ required: true, message: '请选择测试模式' }]}>
            <Select size="large" placeholder="请选择测试模式">
              <Select.Option value="English">English</Select.Option>
              <Select.Option value="Chinese">Chinese</Select.Option>
              <Select.Option value="English + Chinese">English + Chinese</Select.Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-4 mt-8">
            <Button size="large" onClick={() => navigate('/projects')}>取消</Button>
            <Button size="large" type="primary" htmlType="submit" loading={loading} className="bg-[#FF8E8E] hover:!bg-[#ff7575] border-none">
              保存项目并配置区域
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
