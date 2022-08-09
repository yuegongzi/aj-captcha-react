import React, { useRef } from 'react';
import { Captcha, useCaptcha } from 'aj-captcha-react';

export default () => {
  const ref = useRef();
  const [run] = useCaptcha({ path: 'https://api.ejiexi.com/system/cgi',type:'point'});
  const click = () => {
    ref.current?.verify();
  };

  return (
    <Captcha
      onSuccess={(data) => console.log(data)}
      path='https://api.ejiexi.com/system/cgi'
      type='auto'
      ref={ref}
    >
      <button
        onClick={click}
        style={{
          border: 'none',
          color: '#fff',
          width: '100px',
          height: '50px',
          lineHeight: '50px',
          background: '#1890ff',
        }}
      >
        点击
      </button>

      <button
        onClick={async () => {
          try {
            const data = await run();
            console.log(data);
          } catch (e) {
            console.log(e);
          }
        }}
        style={{
          border: 'none',
          color: '#fff',
          width: '100px',
          height: '50px',
          marginLeft: '10px',
          lineHeight: '50px',
          background: '#1890ff',
        }}
      >
        hook
      </button>
    </Captcha>
  );
}
