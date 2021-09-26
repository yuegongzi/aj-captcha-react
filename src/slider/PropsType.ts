import type { BaseTypeProps } from '../utils';

export interface SliderProps extends BaseTypeProps {
  captcha: any;
  onValid: (data: string, second: any) => Promise<boolean>;
}
