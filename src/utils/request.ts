import request from 'umi-request';

export function picture(path: string, rawBody: any) {
  return request.post(`${path}/captcha/get`, { data: rawBody });
}

export function check(path: string, rawBody: any) {
  return request.post(`${path}/captcha/check`, { data: rawBody });
}
