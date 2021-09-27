import React, { useRef } from 'react';
import { Popup, Captcha, Loading, Points } from 'aj-captcha-react';

export default () => {
  const ref = useRef();
  return (
    <Captcha
      ref={ref}
      type='point'
      style={{ marginLeft: '200px' }}
      path='https://api.ejiexi.com/system/cgi'
    >
      <button onClick={() => ref.current?.verify()}>点击验证</button>
    </Captcha>
  );
};
