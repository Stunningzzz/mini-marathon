import { request } from '@umijs/max';
import { ContentListItem } from './types';
import { omit } from 'lodash';

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

const transformData = (item: ContentListItem) => {
  if (item.scheduleType === 0) {
    return omit(item, 'scheduledPushDayTime', 'scheduledPushWeekDayPattern');
  } else if (item.scheduleType === 1) {
    return omit(item, 'scheduledPushDateTime');
  } else {
    return omit(item, 'scheduledPushDayTime', 'scheduledPushWeekDayPattern', 'scheduledPushDateTime');
  }
};

export async function updateContent(item: ContentListItem) {
  return request(`/contents/${item.id}`, {
    method: 'PUT',
    data: transformData(item),
  });
}

export async function addContent(item: ContentListItem) {
  return request('/contents', {
    method: 'POST',
    data: transformData(item),
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
