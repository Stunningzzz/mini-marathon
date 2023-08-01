import { request } from '@umijs/max';

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user') ?? '') as API.CurrentUser;
  } catch {
    return undefined;
  }
}

/** 退出登录接口 POST /api/login/outLogin */
export async function logout() {
  localStorage.setItem('user', '');
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams): Promise<API.LoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  localStorage.setItem('user', JSON.stringify({ name: body.username }));
  return {
    status: 'ok',
    currentAuthority: 'admin',
    type: 'admin',
  };
}
