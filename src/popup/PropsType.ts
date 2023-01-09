import type { BaseTypeProps } from '../utils';
import {ReactNode} from "react";

export interface PopupProps extends BaseTypeProps {
  visible?: boolean;
  onCancel?: () => void;
  children?: ReactNode;
}
