import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/pages/contents': async (req: Request, res: Response) => {
    await waitTime(1000);
    res.send({
      success: true,
      code: 200,
      desc: '这是一段描述',
      data: {
        records: [
          {
            briefing: '这是简报',
            containMotto: false,
            containWeather: true,
            createTime: Date.now(),
            enterpriseWeChatHookKeys: ['aaa', 'bbb'],
            id: '1',
            modifyTime: Date.now(),
            name: 'aa',
            projectId: '1',
            scheduleType: 1,
            scheduledPushDayTime: '04:02',
            scheduledPushWeekDayPattern: 31,
            scheduledPushTime: Date.now(),
          },
        ],
      },
    });
  },
  'POST /api/contents/:contentId/actions/push': async (req: Request, res: Response) => {
    await waitTime(1000);
    res.send({
      success: false,
      code: 200,
      desc: '这是一段描述',
      data: null,
    });
  },
  'DELETE /api/contents/:contentId': async (req: Request, res: Response) => {
    await waitTime(1000);
    res.send({
      success: true,
      code: 200,
      desc: '',
      data: null,
    });
  },
  'POST /api/contents': async (req: Request, res: Response) => {
    await waitTime(1000);
    res.send({
      success: true,
      code: 200,
      desc: '',
      data: null,
    });
  },
  'PUT /api/contents/:contentId': async (req: Request, res: Response) => {
    await waitTime(1000);
    res.send({
      success: true,
      code: 200,
      desc: '',
      data: null,
    });
  },
};
