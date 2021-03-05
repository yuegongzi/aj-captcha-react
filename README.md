# aj-captcha-react
实现行为验证码 包含滑动式和点击式两种
## Getting Started

Install dependencies,

```bash

// 安装 aj-captcha-react
$ yarn add aj-captcha-react

  // or
$ npm install aj-captcha-react
```


## API

|属性|说明|类型|默认值|
|----|----|-----|----|
|panel|面板属性,设置其宽和高|Object|`{height: 200,width: 310}`|
|barHeight|滑动块元素高度|Number|40|
|onFail|校验失败时的函数回调|Function|-|
|onSuccess|校验成功时的函数回调,会将二次校验参数作为参数传递|Function|-|
|type|显示校验模块的方式,可选pop(弹出),embed(嵌入)|String|pop|
|captchaType|校验模式,可选slide(滑动),point(点选),auto(智能)|String|auto|
|path|后端路径前缀|String|-|
