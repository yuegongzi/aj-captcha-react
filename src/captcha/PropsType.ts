import type { BaseTypeProps } from '../utils';
import {ReactNode} from "react";

export type CaptchaType = 'auto' | 'slide' | 'point';

export interface CaptchaModel {
  image?: string;
  token?: string;
  secretKey?: string;
  word?: string;
  block?: string;
}

export interface CaptchaProps extends BaseTypeProps {
  /**
   * 后台路径前缀
   */
  path: string;

  /**
   * 验证码类型
   * @default auto
   */
  type?: CaptchaType;

  /**
   * 取消事件
   */
  onCancel?: () => void;
  /**
   * 校验失败
   */
  onFail?: (msg: string) => void;
  /**
   * 校验成功
   */
  onSuccess: (data: any) => void;
  /**
   * 引用声明
   */
  ref?: any;

  children?: ReactNode;
}
