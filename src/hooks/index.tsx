import React, { useLayoutEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import Captcha from '../captcha';
import type { CaptchaType } from '../captcha/PropsType';

export type CaptchaOption = {
  /**
   * 类型
   */
  type: CaptchaType;
  /**
   * 路径
   */
  path: string
}
export type Func = (val: any) => void;

export function useCaptcha(option: CaptchaOption) {
  const ref = useRef<any>();
  const successRef = useRef<Func>();
  const failRef = useRef<Func>();
  const onSuccess = (data: any) => {
    successRef.current?.(data);
  };
  const onFail = (msg: any) => {
    failRef.current?.(msg);
  };
  useLayoutEffect(() => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    createRoot(div).render(<Captcha path={option.path}
                             type={option.type}
                             onFail={onFail} onSuccess={onSuccess} ref={ref} />);
  }, []);

  const verify = (callBack: Func, fail: Func) => {
    ref.current?.verify();
    successRef.current = callBack;
    failRef.current = fail;
  };
  const run = () => {
    return new Promise((resolve, reject) => {
      verify(resolve, reject);
    });
  };
  return [run, ref.current];
}
