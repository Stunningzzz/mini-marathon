import { request } from '@umijs/max';
import { ContentListItem } from './types';

export async function listContent(params: {
  /** 当前的页码 */
  current?: number;
  /** 页面的容量 */
  pageSize?: number;
}) {
  const res = await request<{
    records: ContentListItem[];
  }>('/pages/contents', {
    method: 'GET',
    params: { ...params, size: 9999 },
  });
  return res.records;
}

export async function updateContent({ id, ...rest }: ContentListItem) {
  return request(`/contents/${id}`, {
    method: 'PUT',
    data: rest,
  });
}

export async function addContent(params: Partial<ContentListItem>) {
  return request('/contents', {
    method: 'POST',
    data: params,
  });
}

export async function deleteContent(params: Pick<ContentListItem, 'id'>) {
  return request(`/contents/${params.id}`, {
    method: 'DELETE',
  });
}

export async function pushOnce({ id }: Pick<ContentListItem, 'id'>) {
  return request<{
    records: ContentListItem[];
  }>(`/contents/${id}/actions/push`, {
    method: 'POST',
  });
}
