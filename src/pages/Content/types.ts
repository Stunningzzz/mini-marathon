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
   * 循环推送时间，24小时制：HH:mm
   */
  scheduledPushDayTime: null | string;
  /**
   * 周几，使用二进制位表示某一天需要推送。第1位为1时表示周一被选中，为0时表示周一未被选中，以此类推。例子：1111111表示周一到周日都被选中，0000001表示只有周日被选中。
   */
  scheduledPushWeekDayPattern: number | null;
  /**
   * 指定日期推送时不能为空
   */
  scheduledPushTime: number | null;
  // 0: 指定日期 1: 指定cron表达式 2:暂不执行
  scheduleType: 0 | 1 | 2;
};
