import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
// import { Link } from '@umijs/max';
import { useRequest } from 'ahooks';
import { Button, message, Popconfirm, Tag } from 'antd';
import { useState } from 'react';
import { deleteProject, getProjects } from './api';
import ProjectModal, { defaultProject, ProjectModalState } from './ProjectModal';
import { IProjectItem } from './types';

const getStatusTag = ({ state }: { state: number }) => {
  const stateMap: Record<number, any> = {
    0: {
      color: 'orange',
      children: '未启用',
    },
    1: {
      color: 'green',
      children: '已启用',
    },
    2: {
      color: 'red',
      children: '已结束',
    },
  };
  return <Tag {...stateMap[state]} />;
};

export default function Project() {
  const [modalFormData, setModalFormData] = useState<Partial<IProjectItem>>(defaultProject);
  const [modalState, setModalState] = useState(ProjectModalState.CLOSE);

  //网络IO
  const {
    data,
    loading: listLoading,
    refreshAsync: reload,
  } = useRequest(getProjects, { manual: false });

  const { runAsync: runDeleteProject, loading: deleteLoading } = useRequest(deleteProject, {
    manual: true,
    onSuccess() {
      message.success('删除成功');
      reload();
    },
  });

  return (
    <PageContainer>
      <ProTable<IProjectItem>
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
        // request={getProjects}
        dataSource={data?.records ?? []}
        options={{ reload }}
        scroll={{ x: 2000 }}
        columns={[
          {
            title: '项目名称',
            width: 150,
            dataIndex: 'projectName',
            copyable: true,
            hideInSetting: true,
          },
          {
            title: '项目部门',
            copyable: true,
            width: 150,
            ellipsis: true,
            dataIndex: 'projectDepartment',
          },
          {
            title: '项目负责人',
            copyable: true,
            ellipsis: true,
            width: 100,
            dataIndex: 'projectLeader',
          },
          {
            title: '电话',
            copyable: true,
            ellipsis: true,
            width: 100,
            dataIndex: 'phone',
          },
          {
            title: '开始日期',
            dataIndex: 'startDate',
            valueType: 'date',
            width: 100,
          },
          {
            title: '截止日期',
            dataIndex: 'endDate',
            valueType: 'date',
            width: 90,
          },
          {
            title: '项目任务总数',
            width: 100,
            dataIndex: 'taskCount',
          },
          {
            title: '项目进度',
            width: 90,
            dataIndex: 'progress',
          },
          {
            title: '已解决任务数',
            width: 100,
            dataIndex: 'solvedTaskCount',
          },
          {
            title: '交付达成率',
            width: 90,
            dataIndex: 'deliveryRate',
          },
          {
            title: '需求总数',
            width: 80,
            dataIndex: 'demandCount',
          },
          {
            title: '需求解决数',
            width: 90,
            dataIndex: 'solvedDemandCount',
          },
          {
            title: '需求达成率',
            width: 90,
            dataIndex: 'demandRate',
          },
          {
            title: '缺陷总数',
            width: 80,
            dataIndex: 'bugCount',
          },
          {
            title: '缺陷解决数',
            width: 90,
            dataIndex: 'solvedBugCount',
          },
          {
            title: '缺陷达成率',
            width: 90,
            dataIndex: 'bugRate',
          },
          {
            title: '项目状态',
            width: 80,
            dataIndex: 'state',
            render: (_, record) => getStatusTag({ state: record.status }),
          },
          {
            title: '缺陷总数',
            dataIndex: 'bugCount',
            width: 80,
          },
          {
            title: '操作',
            fixed: 'right',
            width: 150,
            hideInSetting: true,
            render: (_, record) => [
              <Button
                type="link"
                key={`edit-${record.projectId}`}
                onClick={() => {
                  setModalState(ProjectModalState.EDIT);
                  console.log('编辑的 record :>> ', record);
                  setModalFormData({ ...record });
                }}
              >
                编辑
              </Button>,
              <Popconfirm
                key={`delete-${record.projectId}`}
                title={`确认删除【${record.projectName}】吗？`}
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
      <ProjectModal
        modalFormData={modalFormData}
        modalState={modalState}
        onCancel={() => setModalState(ProjectModalState.CLOSE)}
        reload={reload}
      />
    </PageContainer>
  );
}
