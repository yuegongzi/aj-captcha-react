import type { FC } from 'react';
import React from 'react';
import type { IconProps } from './PropsType';
import { createNamespace } from '../utils';
import Arrow from './components/arrow';
import Failure from './components/failure';
import Success from './components/success';
import Loading from './components/loading';
import './style/index.less';
import classNames from 'classnames';

const [bem] = createNamespace('icon');

const Icon: FC<IconProps> = (props) => {
  const { className, name, size, color,spin } = props;
  return (
    <div className={classNames(className, bem({spin}))}>
      {name === 'arrow' && <Arrow color={color} size={size} />}
      {name === 'failure' && <Failure color={color} size={size} />}
      {name === 'success' && <Success color={color} size={size} />}
      {name === 'loading' && <Loading color={color} size={size} />}
    </div>
  );
};

Icon.defaultProps = {};

export default Icon;
