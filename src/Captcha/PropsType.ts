export type Panel = {
  /**
   * 高度
   */
  height: number;
  /**
   * 宽度
   */
  width: number;
};

export interface CaptchaProps {
  panel?: Panel;
}
