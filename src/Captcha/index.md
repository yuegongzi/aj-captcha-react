## Captcha

## API

|属性|说明|类型|默认值|
|----|----|-----|----|
|panel|面板属性,设置其宽和高|Object|`{height: 200,width: 310}`|
|barHeight|滑动块元素高度|Number|40|
|onFail|校验失败时的函数回调|Function|-|
|onSuccess|校验成功时的函数回调,会将二次校验参数作为参数传递|Function|-|
|type|显示校验模块的方式,可选popup(弹出),embed(嵌入)|String|popup|
|captchaType|校验模式,可选slide(滑动),point(点选),auto(智能)|String|auto|
|path|后端路径前缀|String|-|


```jsx
import React, { PureComponent } from "react"
import { Captcha } from "core-captcha"

export default class Demo extends PureComponent {
  captcha = React.createRef()

  click =()=> {
    if (this.captcha) {
      this.captcha.current.verify()
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.click} style={{border:"none",
            color:"#fff",
          width:"100px",
          height:"50px",lineHeight:"50p",
          background:"#1890ff"}}>点击</button>
        <Captcha 
          onSuccess={(data)=>console.log(data)}
          path="https://api.ejiexi.com/system/cgi" captchaType="auto" 
          type="popup" ref={this.captcha}>
        </Captcha>
      </div>
    )
  }
}
```
