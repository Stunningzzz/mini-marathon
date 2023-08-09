import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, Popconfirm, Tag, Typography, message } from 'antd';
import { useState } from 'react';
import ContentModal from './ContentModal';
import { deleteContent, listContent, pushOnce } from './api';
import { ContentListItem } from './types';
import { ContentModalState, defaultContent } from './util';
import { getProjects } from '../Project/api';

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

export default function Content() {
  //变量声明、解构
  //组件状态
  const [modalState, setModalState] = useState(ContentModalState.CLOSE);
  const [modalFormData, setModalFormData] = useState<Partial<ContentListItem>>(defaultContent);

  //网络IO
  const { loading: projectLoading, data: projectList } = useRequest(getProjects);
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
        projectList={projectList}
        projectLoading={projectLoading}
        modalFormData={modalFormData}
        modalState={modalState}
        onCancel={() => setModalState(ContentModalState.CLOSE)}
        reload={reload}
      />
      <ProTable<ContentListItem>
        rowKey="id"
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
            render(_dom, entity) {
              return <IncludeTag isInclude={entity.containWeather} />;
            },
          },
          {
            title: '格言',
            render(_dom, entity) {
              return <IncludeTag isInclude={entity.containMotto} />;
            },
          },
          {
            title: '简报',
            dataIndex: 'briefing',
            width: 200,
            render(_dom, entity) {
              return (
                <Typography.Paragraph
                  ellipsis={{
                    rows: 2,
                    tooltip: entity.briefing,
                  }}
                >
                  {entity.briefing}
                </Typography.Paragraph>
              );
            },
          },
          {
            title: '关联项目',
            width: 200,
            render(_dom, entity) {
              const project = projectList?.records.find(
                (item) => String(item.projectId) === entity.projectId,
              );
              return project ? (
                <Link to={`/project?id=${project.projectId}`}>{project.projectName}</Link>
              ) : (
                '暂无关联项目'
              );
            },
          },
          {
            title: '操作',
            render: (_dom, record) => [
              <Button
                key={123}
                type="link"
                onClick={() => {
                  setModalState(ContentModalState.EDIT);
                  setModalFormData({ ...record });
                }}
              >
                编辑
              </Button>,
              <Button
                key={312}
                type="link"
                loading={pushLoading && params[0]?.id === record.id}
                onClick={() => {
                  runPushOnce({ id: record.id });
                }}
              >
                推送一次
              </Button>,
              <Popconfirm
                key={897}
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
}
