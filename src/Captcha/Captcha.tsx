import type { FC } from 'react';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import type { CaptchaProps, CaptchaType } from './PropsType';
import {
  aesEncrypt,
  Anchor,
  check,
  createNamespace,
  noop,
  picture,
  storage,
} from '../utils';
import './style/index.less';
import Popup from '../popup';
import Slider from '../slider';
import Points from '../points';
import classNames from 'classnames/bind';

const [bem] = createNamespace('captcha');

const Captcha: FC<CaptchaProps> = forwardRef((props, ref) => {
  const { type, onCancel, onSuccess, onFail, path } = props;
  const [visible, toggle] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0);
  const [captcha, setCaptcha] = useState<any>({});
  const [captchaType, setCaptchaType] = useState<CaptchaType>(
    props.captchaType,
  );

  const fetch = async () => {
    const vr = Anchor[captchaType];
    const { repCode, repData } = await picture(path, {
      captchaType: vr.captchaType,
      clientUid: localStorage.getItem(vr.name),
      ts: Date.now(),
    });
    if (repCode === '0000') {
      setCaptcha(vr.data(repData));
      toggle(true);
    }
  };

  const valid = (param: string, second: any) => {
    return new Promise<boolean>((resolve) => {
      const vr = Anchor[captchaType];
      console.log(captcha);
      const data = {
        captchaType: vr.captchaType,
        pointJson: captcha.secretKey
          ? aesEncrypt(param, captcha.secretKey)
          : param,
        token: captcha.token,
        clientUid: localStorage.getItem(vr.name),
        ts: Date.now(),
      };
      check(path, data)
        .then((res) => {
          const validate: boolean = res.repCode === '0000';
          console.log(res);
          if (validate) {
            onSuccess(second);
          } else {
            onFail('');
          }
          resolve(validate);
        })
        .catch(() => resolve(false));
    });
  };

  useImperativeHandle(ref, () => ({ verify: fetch }));
  const cancel = () => {
    toggle(false);
    onCancel();
  };

  useEffect(() => {
    //TODO 删除
    fetch();
    storage();
  }, []);

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

  const renderBody = () => {
    if (['auto', 'slide'].includes(captchaType)) {
      return <Slider onValid={valid} captcha={captcha} />;
    }
    return (
      <div className={classNames(bem('body'))}>
        <Points onValid={valid} captcha={captcha} />
      </div>
    );
  };

  if (type === 'popup') {
    return (
      <Popup visible={visible} onCancel={cancel}>
        {renderBody()}
      </Popup>
    );
  }
  return renderBody();
});

Captcha.defaultProps = {
  captchaType: 'slide', // slider point
  type: 'popup', // embed 嵌入式
  onCancel: noop,
  onFail: noop,
  onSuccess: noop,
};

export default Captcha;
