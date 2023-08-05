import { request } from '@umijs/max';
import { IProjectItem } from './types';

export async function getProjects(params: {
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
}) {
  const res = await request<{
    records: IProjectItem[];
    currentPage: number;
    pageSize: number;
    totalPage: number;
    totalSize: number;
  }>('/pages/projects', {
    method: 'GET',
    params: { ...params, size: 9999 },
  });
  return res;
}

export async function updateProject(params: IProjectItem) {
  return request(`/projects/${params.projectId}`, {
    method: 'PUT',
    data: params,
  });
}

export async function addProject(params: Partial<IProjectItem>) {
  return request('/projects', {
    method: 'POST',
    data: params,
  });
}

export async function deleteProject(params: Pick<IProjectItem, 'projectId'>) {
  return request(`/projects/${params.projectId}`, {
    method: 'DELETE',
  });
}
