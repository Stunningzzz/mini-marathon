import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { Button, Popconfirm, Tag, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { ContentListItem } from './types';
import { deleteContent, listContent, pushOnce } from './api';
import { useRequest } from 'ahooks';
import ContentModal, { ContentModalState, defaultContent } from './ContentModal';
import { useState } from 'react';

//私有常量

//可抽离的逻辑处理函数/组件
const IncludeTag = ({ isInclude }: { isInclude: boolean }) => {
  return (
    <Tag
      {...(isInclude
        ? {
            color: 'green',
            children: '包含',
          }
        : {
            color: 'red',
            children: '不包含',
          })}
    />
  );
};

let Content = (props: IProps) => {
  //变量声明、解构
  const {} = props;
  //组件状态
  const [modalState, setModalState] = useState(ContentModalState.CLOSE);
  const [modalFormData, setModalFormData] = useState<Partial<ContentListItem>>(defaultContent);

  //网络IO
  const {
    data = [],
    loading: listLoading,
    refreshAsync: reload,
  } = useRequest(listContent, { manual: false });
  const { runAsync: runDeleteContent } = useRequest(deleteContent, {
    manual: true,
    onSuccess() {
      message.success('删除成功');
      reload();
    },
  });

  const {
    runAsync: runPushOnce,
    loading: pushLoading,
    params,
  } = useRequest(pushOnce, {
    manual: true,
    onSuccess() {
      message.success('推送成功');
    },
  });

  //数据转换

  //逻辑处理函数

  //组件Effect

  return (
    <PageContainer>
      <ContentModal
        modalFormData={modalFormData}
        modalState={modalState}
        onCancel={() => setModalState(ContentModalState.CLOSE)}
        reload={reload}
      />
      <ProTable<ContentListItem>
        rowKey="key"
        search={false}
        loading={listLoading}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalState(ContentModalState.ADD);
              setModalFormData({ ...defaultContent });
            }}
          >
            <PlusOutlined /> 新建内容
          </Button>,
        ]}
        dataSource={data}
        request={listContent}
        options={{ reload }}
        columns={[
          {
            title: '内容名称',
            dataIndex: 'contentName',
          },
          {
            title: '天气',
            render(dom, entity, index, action, schema) {
              return <IncludeTag isInclude={entity.containWeather} />;
            },
          },
          {
            title: '格言',
            render(dom, entity, index, action, schema) {
              return <IncludeTag isInclude={entity.containMotto} />;
            },
          },
          {
            title: '简报',
            dataIndex: 'briefing',
          },
          {
            title: '关联项目',
            render(_dom, entity) {
              return <Link to={`/project?id=${entity.projectId}`} />;
            },
          },
          {
            title: '操作',
            render: (_, record) => [
              <Button
                type="link"
                onClick={() => {
                  setModalState(ContentModalState.EDIT);
                  setModalFormData({ ...record });
                }}
              >
                编辑
              </Button>,
              <Button
                type="link"
                loading={pushLoading && params[0]?.id === record.id}
                onClick={() => {
                  runPushOnce({ id: record.id });
                }}
              >
                推送一次
              </Button>,
              <Popconfirm
                title={`确认删除【${record.contentName}】吗？`}
                onConfirm={() => runDeleteContent({ id: record.id })}
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>,
            ],
          },
        ]}
      />
    </PageContainer>
  );
};

//props类型定义
interface IProps {}

//prop-type定义，可选
Content = observer(Content);
export { Content as default };
