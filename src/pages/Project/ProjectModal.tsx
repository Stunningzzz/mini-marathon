import { useRequest } from 'ahooks';
import { Col, DatePicker, Form, Input, InputNumber, message, Modal, Radio, Row } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { addProject, updateProject } from './api';
import { IProjectItem } from './types';

//私有常量

export enum ProjectModalState {
  EDIT = '编辑',
  ADD = '新建',
  CLOSE = '关闭',
}

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

export const defaultProject: Partial<IProjectItem> = {
  status: 0,
};

//可抽离的逻辑处理函数/组件

let ProjectModal = (props: IProps) => {
  //变量声明、解构
  const { modalFormData, modalState, onCancel, reload } = props;
  //组件状态
  const [form] = Form.useForm<IProjectItem & { rangeTime: Dayjs[] }>();
  //网络IO
  const { runAsync: runUpdateProject, loading: updateLoading } = useRequest(updateProject, {
    manual: true,
    onSuccess() {
      message.success('编辑成功');
      onCancel();
      reload();
    },
  });
  const { runAsync: runAddProject, loading: addLoading } = useRequest(addProject, {
    manual: true,
    onSuccess() {
      message.success('新建成功');
      onCancel();
      reload();
    },
  });

  //数据转换

  //逻辑处理函数

  const handleSubmit = () => {
    const submitData = form.getFieldsValue();
    const startDate = submitData.rangeTime[0].format('YYYY-MM-DD');
    const endDate = submitData.rangeTime[1].format('YYYY-MM-DD');
    form.setFieldsValue({ ...submitData, startDate, endDate });
    form.submit();
  };

  //组件Effect
  useEffect(() => {
    if (modalState !== ProjectModalState.CLOSE) {
      const { startDate, endDate } = modalFormData;
      form.setFieldsValue({ ...modalFormData, rangeTime: [dayjs(startDate), dayjs(endDate)] });
    }
  }, [modalFormData, modalState]);

  (window as any).form = form;

  return (
    <Modal
      title={`${modalState}项目`}
      width="800px"
      open={modalState !== ProjectModalState.CLOSE}
      onCancel={onCancel}
      confirmLoading={updateLoading || addLoading}
      onOk={handleSubmit}
      maskClosable={false}
    >
      <Form
        labelAlign="right"
        initialValues={defaultProject}
        form={form}
        onFinish={(finishData) => {
          if (modalState === ProjectModalState.ADD) {
            runAddProject({ ...modalFormData, ...finishData });
          } else {
            runUpdateProject({ ...modalFormData, ...finishData });
          }
        }}
      >
        <Form.Item
          label="项目"
          name="projectName"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item label="负责人" name="projectLeader">
          <Input placeholder="请输入负责人" />
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item label="电话" name="phone">
              <Input style={{ width: 300 }} maxLength={11} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="项目周期" name="rangeTime">
              <DatePicker.RangePicker disabledDate={disabledDate} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="状态" name="status">
          <Radio.Group
            options={[
              {
                label: '未开始',
                value: 0,
              },
              {
                label: '进行中',
                value: 1,
              },
              {
                label: '已结束',
                value: 2,
              },
            ]}
          />
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item label="任务总数" name="taskCount">
              <InputNumber precision={0} min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="已解决任务数" name="solvedTaskCount">
              <InputNumber precision={0} min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="需求总数" name="demandCount">
              <InputNumber precision={0} min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="已解决需求数" name="solvedDemandCount">
              <InputNumber precision={0} min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="缺陷总数" name="bugCount">
              <InputNumber precision={0} min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="已解决缺陷数" name="solvedBugCount">
              <InputNumber precision={0} min={0} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

//props类型定义
interface IProps {
  modalFormData: Partial<IProjectItem>;
  modalState: ProjectModalState;
  onCancel: () => void;
  reload: () => void;
}

//prop-type定义，可选
ProjectModal = observer(ProjectModal);
export { ProjectModal as default };
