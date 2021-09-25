import type { FC } from 'react';
import React from 'react';
import type { CaptchaProps } from './PropsType';
import { createNamespace } from '../utils';
import './style/index.less';
import classNames from 'classnames';

const [bem] = createNamespace('goods-action');

const Captcha: FC<CaptchaProps> = (props) => {
  const { className } = props;
  return <div className={classNames(className, bem())}>组件 Captcha</div>;
};

Captcha.defaultProps = {};

export default Captcha;
