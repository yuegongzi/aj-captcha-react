import type { FC } from 'react';
import React, {
  forwardRef,
  Fragment,
  useImperativeHandle,
  useState,
} from 'react';
import type { CaptchaProps } from './PropsType';
import { noop } from '../utils/utils';
import './style/index.less';
import Pop from './Pop';
import Slide from './Slide';
import Point from './Point';

const Captcha: FC<CaptchaProps> = forwardRef((props, ref) => {
  const { type, panel, onCancel, onSuccess, onFail, path, barHeight } = props;
  const [visible, toggle] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const [captchaType, setCaptchaType] = useState<string>(props.captchaType);

  const verify = () => {
    toggle(!visible);
  };

  useImperativeHandle(ref, () => ({ verify }));
  const cancel = () => {
    toggle(false);
    onCancel();
  };

  const fail = () => {
    setCount(count + 1);
    if (count >= 1 && captchaType === 'auto') {
      setCaptchaType('point');
      return false;
    }
    return true;
  };
  const success = (data: any) => {
    setTimeout(() => {
      toggle(false);
      onSuccess(data);
    }, 1000);
  };

  if (type === 'popup') {
    return (
      <Pop panel={panel} visible={visible} onCancel={cancel}>
        {(captchaType === 'auto' || captchaType === 'slide') && (
          <Slide
            onSuccess={success}
            barHeight={barHeight}
            path={path}
            panel={panel}
            onFail={fail}
          />
        )}
        {captchaType === 'point' && (
          <Point
            onSuccess={success}
            barHeight={barHeight}
            path={path}
            panel={panel}
            onFail={fail}
          />
        )}
      </Pop>
    );
  }
  return (
    <Fragment>
      {(captchaType === 'auto' || captchaType === 'slide') && (
        <Slide
          onSuccess={success}
          barHeight={barHeight}
          path={path}
          panel={panel}
          onFail={fail}
        />
      )}
      {captchaType === 'point' && (
        <Point
          onSuccess={success}
          barHeight={barHeight}
          path={path}
          panel={panel}
          onFail={fail}
        />
      )}
    </Fragment>
  );
});

Captcha.defaultProps = {
  panel: {
    height: 155,
    width: 280,
  },
  barHeight: 40,
  captchaType: 'auto', // slide point
  type: 'popup', // embed 嵌入式
  onCancel: noop,
  onFail: noop,
  onSuccess: noop,
};

export default Captcha;
