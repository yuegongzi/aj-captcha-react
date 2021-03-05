import request from 'umi-request';

export function picture(path,rawBody) {
  return request.post(`${path}/captcha/get`,
    { data: rawBody });
}

export function check(path,rawBody) {
  return request.post(`${path}/captcha/check`,
    { data: rawBody });
}
