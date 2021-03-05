import CryptoJS from 'crypto-js';

export const CODE = {
  "0000":"",
  "9999":"服务器内部异常",
  "0011":"参数不能为空",
  "6110":"验证码已失效，请重新获取",
  "6111":"验证失败",
  "6112":"获取验证码失败,请稍后再试",
  "6113":"底图未初始化成功，请检查路径",
  "6201":"获取验证码次数超限，请稍后再试",
  "6206":"无效请求，请重新获取验证码",
  "6202":"接口验证失败数过多，请稍后再试",
  "6204":"验证请求次数超限，请稍后再试"
}

function UUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function storage() {
  let uuid = UUID();
  let slider = 'slider' + '-' + uuid;
  let point = 'point' + '-' + uuid;
  // 判断下是否存在
  if (!localStorage.getItem('slider')) {
    localStorage.setItem('slider', slider);
  }
  if (!localStorage.getItem('point')) {
    localStorage.setItem('point', point);
  }
}

/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
export function aesEncrypt(word, keyWord = 'awKsGlMcdPMEhR1B') {
  const key = CryptoJS.enc.Utf8.parse(keyWord);
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}


export function addListener(_this) {
  window.removeEventListener('touchmove', function(e) {
    _this.move(e);
  });
  window.removeEventListener('mousemove', function(e) {
    _this.move(e);
  });

  window.removeEventListener('touchend', function() {
    _this.end();
  });
  window.removeEventListener('mouseup', function() {
    _this.end();
  });

  window.addEventListener('touchmove', function(e) {
    _this.move(e);
  });
  window.addEventListener('mousemove', function(e) {
    _this.move(e);
  });

  //鼠标松开
  window.addEventListener('touchend', function() {
    _this.end();
  });
  window.addEventListener('mouseup', function() {
    _this.end();
  });
}

/**
 * 加密滑动验证二次校验参数
 * @param preview
 * @param moveLeftDistance
 * @returns {{captchaVerification: string}}
 */
export function slideSecond(preview,moveLeftDistance){
  let captchaVerification = `${preview.token}---${JSON.stringify({x:moveLeftDistance,y:5.0})}`
  if(preview.secretKey){
    captchaVerification =  aesEncrypt(captchaVerification,preview.secretKey)
  }
  return {captchaVerification}
}

/**
 * 加密点选验证二次校验参数
 * @param preview
 * @param checkPosArr
 * @returns {{captchaVerification: string}}
 */
export function pointSecond(preview,checkPosArr){
  let captchaVerification = `${preview.token}---${JSON.stringify(checkPosArr)}`
  if(preview.secretKey){
    captchaVerification =  aesEncrypt(captchaVerification,preview.secretKey)
  }
  return {captchaVerification}
}
