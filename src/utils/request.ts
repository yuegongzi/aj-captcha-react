import request from 'axios';

export async function picture(path: string, rawBody: any) {
  const { data } = await request.post(`${path}/captcha/get`, rawBody);
  return data;
}

export async function check(path: string, rawBody: any) {
  const { data } = await request.post(`${path}/captcha/check`, rawBody);
  return data;
}
