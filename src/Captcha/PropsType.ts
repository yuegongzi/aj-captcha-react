export type PanelModel = {
  /**
   * 高度
   */
  height: number;
  /**
   * 宽度
   */
  width: number;
};

export type CaptchaType = 'auto' | 'slide' | 'point';

export type Type = 'popup' | 'embed';

export interface PointModel {
  x: number;
  y: number;
}

export interface PreviewProps {
  image?: string;
  token?: string;
  secretKey?: string;
  word?: string;
}

export interface BaseProps {
  /**
   * 后台路径前缀
   */
  path: string;
  /**
   * 面板配置
   */
  panel: PanelModel;
  /**
   * 滑块高度
   * @default 40
   */
  barHeight: number;

  /**
   * 校验失败
   */
  onFail: (msg: string) => void;
  /**
   * 校验成功
   */
  onSuccess: (data: any) => void;
}

export type PointProps = BaseProps;
export type SlideProps = BaseProps;

export interface PopProps {
  /**
   * 取消事件
   */
  onCancel: () => void;
  visible: boolean;
  panel: PanelModel;
}

export interface CaptchaProps extends BaseProps {
  /**
   * 验证码类型
   * @default auto
   */
  captchaType: CaptchaType;
  /**
   * 类型
   * @default popup
   */
  type: Type;

  /**
   * 取消事件
   */
  onCancel: () => void;
}
