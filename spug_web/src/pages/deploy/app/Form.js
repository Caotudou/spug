/**
 * Copyright (c) OpenSpug Organization. https://github.com/openspug/spug
 * Copyright (c) <spug.dev@gmail.com>
 * Released under the AGPL-3.0 License.
 */
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import {Modal, Form, Input, message, Radio} from 'antd';
import http from 'libs/http';
import store from './store';

export default observer(function () {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  function setIsMini(value){
      store.record.is_mini=value
  }
  function handleSubmit() {
    setLoading(true);
    const formData = form.getFieldsValue();
    formData['id'] = store.record.id;
    // formData['is_mini']= isMini
    http.post('/api/app/', formData)
      .then(res => {
        message.success('操作成功');
        store.formVisible = false;
        store.fetchRecords()
      }, () => setLoading(false))
  }
  return (
    <Modal
      visible
      maskClosable={false}
      title={store.record.id ? '编辑应用' : '新建应用'}
      onCancel={() => store.formVisible = false}
      confirmLoading={loading}
      onOk={handleSubmit}>
      <Form form={form} initialValues={store.record} labelCol={{span: 6}} wrapperCol={{span: 14}}>
        <Form.Item required name="name" label="应用名称">
          <Input placeholder="请输入应用名称，例如：订单服务"/>
        </Form.Item>
        <Form.Item label="是否小程序" required name='is_mini'>
            <Radio.Group value={store.record.is_mini} onChange={e => setIsMini(e.target.value)}>
            <Radio.Button value={1}>是</Radio.Button>
            <Radio.Button value={0}>否</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          required
          name="key"
          label="唯一标识符"
          tooltip="给应用设置的唯一标识符，会用于配置中心的配置生成。"
          extra="可以由字母、数字和下划线组成。">
          <Input placeholder="请输入唯一标识符，例如：api_order"/>
        </Form.Item>

        <Form.Item name="desc" label="备注信息">
          <Input.TextArea placeholder="请输入备注信息"/>
        </Form.Item>

      </Form>
    </Modal>
  )
})
