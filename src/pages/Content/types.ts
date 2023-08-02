export type ContentListItem = {
  /**
   * 简报
   */
  briefing: string;
  /**
   * 是否包含
   */
  containMotto: boolean;
  /**
   * 是否包含天气
   */
  containWeather: boolean;
  /**
   * 创建时间
   */
  createTime: number;
  enterpriseWeChatHookKeys: string[];
  contentName: string;
  /**
   * ID，唯一标识
   */
  id: string;
  /**
   * 修改时间
   */
  modifyTime: number;
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 按cron表达式执行时不能为空
   */
  scheduledPushCron?: string;
  /**
   * 指定日期推送时不能为空
   */
  scheduledPushTime?: number;
  // 0: 指定日期 1: 指定cron表达式 2:暂不执行
  scheduleType: 0 | 1 | 2;
};
