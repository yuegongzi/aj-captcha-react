import type { BaseTypeProps } from '../utils';

export interface Point {
  x: number;
  y: number;
}
export interface PointsProps extends BaseTypeProps {
  captcha: any;
  onValid: (data: any, second: any) => Promise<boolean>;
}
