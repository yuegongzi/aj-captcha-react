## Captcha
[AJ-Captcha](https://gitee.com/anji-plus/captcha)  React版 ,界面优化调整 支持滑块和点选切换


![alt slide.png](https://raw.githubusercontent.com/yuegongzi/aj-captcha-react/master/src/assert/slide.png)

![alt point.png](https://raw.githubusercontent.com/yuegongzi/aj-captcha-react/master/src/assert/point.png)


## API

| 属性        | 说明                                              | 类型     | 默认值                     |
| ----------- | ------------------------------------------------- | -------- | -------------------------- |
| onFail      | 校验失败时的函数回调                              | Function | -                          |
| onSuccess   | 校验成功时的函数回调,会将二次校验参数作为参数传递 | Function | -                          |
| type        | 显示校验模块的方式,可选 point(点选),slide(弹出)   | String   | auto                      |
| path        | 后端路径前缀                                      | String   | -                          |

<code src='./demo/index.jsx'/>
