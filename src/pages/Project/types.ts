export interface IProjectItem {
  /**
   * 缺陷总数
   */
  bugCount: number;
  /**
   * 缺陷达成率，0-100 solvedBugCount/bugCount
   */
  bugRate: number;
  /**
   * 交付达成率，0-100 solutionCount/taskCount
   */
  deliveryRate: number;
  /**
   * 需求总数
   */
  demandCount: number;
  /**
   * 需求达成率，0-100 solvedDemandCount/demandCount
   */
  demandRate: number;
  /**
   * 项目截止日期
   */
  endDate: number;
  /**
   * 项目进度，0-100 加权平均 progress = (deliveryRate * 0.5 + demandRate * 0.3 + bugRate * 0.2)
   */
  progress: number;
  /**
   * 项目部门
   */
  projectDepartment: string;
  /**
   * 项目id
   */
  projectId: number;
  /**
   * 项目负责人
   */
  projectLeader: string;
  /**
   * 项目名称
   */
  projectName: string;
  /**
   * 缺陷解决数
   */
  solvedBugCount: number;
  /**
   * 需求解决数
   */
  solvedDemandCount: number;
  /**
   * 已解决任务数
   */
  solvedTaskCount: number;
  /**
   * 项目开始日期
   */
  startDate: number;
  /**
   * 项目状态，0-未开始 1-进行中 2-已结束
   */
  status: number;
  /**
   * 项目任务总数
   */
  taskCount: number;
}
