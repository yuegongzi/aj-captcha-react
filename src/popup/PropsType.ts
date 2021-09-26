import type { BaseTypeProps } from '../utils';

export interface PopupProps extends BaseTypeProps {
  visible?: boolean;
  onCancel?: () => void;
}
