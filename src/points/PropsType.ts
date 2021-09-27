import type { BaseTypeProps } from '../utils';
import type { CaptchaModel } from '../captcha/PropsType';

export interface Point {
  x: number;
  y: number;
}
export interface PointsProps extends BaseTypeProps {
  captcha: CaptchaModel;
  onValid: (data: any, second: any) => Promise<boolean>;
}
