import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Switch,
  TimePicker,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { isNil, sum } from 'lodash';
import { useEffect } from 'react';
import { addContent, updateContent } from './api';
import { ContentListItem } from './types';
import {
  ContentModalState,
  formItemLayout,
  formItemLayoutWithOutLabel,
  pushDayTimeFormat,
  pushTimeFormat,
  rules,
} from './util';

export default function ContentModal(props: IProps) {
  //变量声明、解构
  const { modalFormData, modalState, onCancel, reload } = props;
  //组件状态
  const [form] = Form.useForm<Record<keyof ContentListItem, any>>();

  //网络IO
  const { runAsync: runUpdateContent, loading: updateLoading } = useRequest(updateContent, {
    manual: true,
    onSuccess() {
      message.success('编辑成功');
      onCancel();
      reload();
    },
  });
  const { runAsync: runAddContent, loading: addLoading } = useRequest(addContent, {
    manual: true,
    onSuccess() {
      message.success('新建成功');
      onCancel();
      reload();
    },
  });

  //数据转换

  //逻辑处理函数

  //组件Effect
  useEffect(() => {
    form.setFieldsValue({
      ...modalFormData,
      scheduledPushDayTime: isNil(modalFormData.scheduledPushDayTime)
        ? null
        : dayjs(`${dayjs().format('YYYY-MM-DD')} ${modalFormData.scheduledPushDayTime}`),
      scheduledPushWeekDayPattern: isNil(modalFormData.scheduledPushWeekDayPattern)
        ? null
        : modalFormData.scheduledPushWeekDayPattern
            .toString(2)
            .split('')
            .map((item, index, arr) => {
              return item === '1' ? 2 ** (arr.length - index - 1) : 0;
            }),
      scheduledPushDateTime: isNil(modalFormData.scheduledPushDateTime)
        ? null
        : dayjs(modalFormData.scheduledPushDateTime),
    });
  }, [modalFormData]);

  return (
    <Modal
      title={`${modalState}内容`}
      width="800px"
      open={modalState !== ContentModalState.CLOSE}
      onCancel={onCancel}
      confirmLoading={updateLoading || addLoading}
      onOk={form.submit}
      maskClosable={false}
    >
      <Form
        labelAlign="right"
        labelCol={{ span: 8 }}
        form={form}
        onFinish={(data) => {
          const transformData = {
            ...data,
            scheduledPushDayTime: isNil(data.scheduledPushDayTime)
              ? null
              : data.scheduledPushDayTime.format(pushDayTimeFormat),
            scheduledPushWeekDayPattern: sum(data.scheduledPushWeekDayPattern),
            scheduledPushDateTime: isNil(data.scheduledPushDateTime)
              ? null
              : data.scheduledPushDateTime.valueOf(),
          };
          if (modalState === ContentModalState.ADD) {
            runAddContent({ ...modalFormData, ...transformData });
          } else {
            runUpdateContent({ ...modalFormData, ...transformData });
          }
        }}
      >
        <Form.Item label="名称" name="contentName" rules={rules}>
          <Input placeholder="请输入内容名称" />
        </Form.Item>
        <Form.Item label="推送方式" name="scheduleType">
          <Radio.Group
            options={[
              {
                label: '不推送',
                value: 2,
              },
              {
                label: '指定日期推送',
                value: 0,
              },
              {
                label: '循环推送',
                value: 1,
              },
            ]}
          />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {(form) => {
            const scheduleType = form.getFieldValue('scheduleType');

            return {
              0: (
                <Form.Item label="推送时间" rules={rules} name="scheduledPushDateTime">
                  <DatePicker showTime format={pushTimeFormat} />
                </Form.Item>
              ),
              1: (
                <>
                  <Form.Item label="推送周期" rules={rules} name="scheduledPushWeekDayPattern">
                    <Checkbox.Group
                      options={['一', '二', '三', '四', '五', '六', '日'].map((label, index) => ({
                        label: `周${label}`,
                        value: 2 ** index,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    rules={rules}
                    label="推送时间"
                    name="scheduledPushDayTime"
                    initialValue={dayjs(Date.now())}
                  >
                    <TimePicker format={pushDayTimeFormat} />
                  </Form.Item>
                </>
              ),
              2: null,
            }[scheduleType as number];
          }}
        </Form.Item>

        <Form.Item label="包含天气" name="containWeather" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="包含格言" name="containMotto" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="简报" name="briefing">
          <Input placeholder="请输入简报内容" />
        </Form.Item>
        <Form.Item label="关联项目">
          <Select />
        </Form.Item>

        <Form.List
          name="enterpriseWeChatHookKeys"
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 1) {
                  return Promise.reject(new Error('至少关联一个机器人'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                  label={index === 0 ? '企微机器人' : ''}
                  required={true}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: `'请填入机器人url${fields.length > 1 ? '或删除当前项' : ''}`,
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder="请填入机器人url" style={{ width: '60%' }} />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      style={{
                        position: 'relative',
                        top: '4px',
                        margin: '0 8px',
                        color: '#999',
                        fontSize: '24px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item wrapperCol={{ offset: 4 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '60%' }}
                  icon={<PlusOutlined />}
                >
                  添加机器人
                </Button>

                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}

//props类型定义
interface IProps {
  modalFormData: Partial<ContentListItem>;
  modalState: ContentModalState;
  onCancel: () => void;
  reload: () => void;
}
