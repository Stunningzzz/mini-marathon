import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, message, Popconfirm, Tag } from 'antd';
import { useState } from 'react';
import { deleteProject, getProjects } from './api';
import ProjectModal, { defaultProject, ProjectModalState } from './ProjectModal';
import { IProjectItem } from './types';

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

export default function Project() {
  const [modalFormData, setModalFormData] = useState<Partial<IProjectItem>>(defaultProject);
  const [modalState, setModalState] = useState(ProjectModalState.CLOSE);

  //网络IO
  const {
    data = [],
    loading: listLoading,
    refreshAsync: reload,
  } = useRequest(getProjects, { manual: false });
  console.log({ data });
  const { runAsync: runDeleteProject, loading: deleteLoading } = useRequest(deleteProject, {
    manual: true,
    onSuccess() {
      message.success('删除成功');
      reload();
    },
  });

  return (
    <PageContainer>
      <ProjectModal
        modalFormData={modalFormData}
        modalState={modalState}
        onCancel={() => setModalState(ProjectModalState.CLOSE)}
        reload={reload}
      />
      <ProTable<IProjectItem>
        rowKey="key"
        search={false}
        loading={listLoading || deleteLoading}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalState(ProjectModalState.ADD);
              setModalFormData({ ...defaultProject });
            }}
          >
            <PlusOutlined /> 新建项目
          </Button>,
        ]}
        dataSource={data}
        request={getProjects}
        options={{ reload }}
        columns={[
          {
            title: '项目名称',
            dataIndex: 'ProjectName',
          },
          {
            title: '天气',
            render(dom, entity) {
              return <IncludeTag isInclude={entity.containWeather} />;
            },
          },
          {
            title: '格言',
            render(dom, entity) {
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
            title: '缺陷总数',
            dataIndex: 'bugCount',
          },
          {
            title: '操作',
            render: (_, record) => [
              <Button
                type="link"
                key={`edit-${record.projectId}`}
                onClick={() => {
                  setModalState(ProjectModalState.EDIT);
                  setModalFormData({ ...record });
                }}
              >
                编辑
              </Button>,
              <Popconfirm
                key={`delete-${record.projectId}`}
                title={`确认删除【${record.projectId}】吗？`}
                onConfirm={() => runDeleteProject({ projectId: record.projectId })}
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
