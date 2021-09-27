import type { BaseTypeProps } from '../utils';
import type { CaptchaModel } from '../captcha/PropsType';

export interface SliderProps extends BaseTypeProps {
  captcha: CaptchaModel;
  onValid: (data: string, second: any) => Promise<boolean>;
}
