import { ContentListItem } from './types';

//私有常量
export enum ContentModalState {
  EDIT = '编辑',
  ADD = '新建',
  CLOSE = '关闭',
}

export const pushDayTimeFormat = 'HH:mm';
export const pushTimeFormat = 'YYYY-MM-DD HH:mm';
export const defaultContent: Partial<ContentListItem> = {
  containMotto: true,
  containWeather: true,
  briefing: '',
  contentName: '',
  enterpriseWeChatHookKeys: [''],
  scheduleType: 2,
  scheduledPushDateTime: null,
  scheduledPushWeekDayPattern: null,
  scheduledPushDayTime: null,
  cityForWeather: '广州',
};

export const formItemLayout = {
  labelCol: {
    span: 8,
  },
};

export const formItemLayoutWithOutLabel = {
  wrapperCol: {
    offset: 8,
  },
};

export const rules = [{ required: true }];
