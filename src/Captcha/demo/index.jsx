import React, { PureComponent } from 'react';
import { Captcha } from 'aj-captcha-react';

export default class Demo extends PureComponent {
  captcha = React.createRef();

  click = () => {
    if (this.captcha) {
      this.captcha.current.verify();
    }
  };

  render() {
    return (
      <div>
        <button
          onClick={this.click}
          style={{
            border: 'none',
            color: '#fff',
            width: '100px',
            height: '50px',
            lineHeight: '50p',
            background: '#1890ff',
          }}
        >
          点击
        </button>
        <Captcha
          onSuccess={(data) => console.log(data)}
          path="https://api.ejiexi.com/system/cgi"
          captchaType="auto"
          type="popup"
          ref={this.captcha}
        />
      </div>
    );
  }
}
