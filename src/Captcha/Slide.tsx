import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { aesEncrypt, CODE, slideSecond, storage } from '../utils/utils';
import { check, picture } from '../utils/request';
import Loading from '../loading';
import '../assert/fonts/iconfont.css';
import type { SlideProps } from './PropsType';
import useSetState from '../utils/hooks';

const bar = '40px';

const panel = {
  //面板属性
  height: 155,
  width: 280,
};
/**
 * 滑动验证组件基本逻辑,将滑动拆分为如下5种状态
 * 1.loading 加载验证码中 此时处理loading过渡动画,避免图片未加载完成时进行点击
 * 2.checking 请求服务器校验用户拖动结果 避免拖动后请求过程中依然能拖动鼠标
 * 3.moving 拖动中 处理拖动中的逻辑,左边bar的位置和颜色
 * 4.complete 拖动完成,进入校验环节
 * 5.pass 校验结果
 */
const Slide: FC<SlideProps> = (props) => {
  const { path, onSuccess, onFail } = props;
  const [status, setStatus] = useState<string>('loading');
  const [time, setTime] = useState<any>();
  const [preview, setPreview] = useState<any>({
    code: '0000',
  });
  const [state, setState] = useSetState<any>({
    x: 0, //滑块的x位置
    startTime: 0, // 拖动开始时间
    left: 0, //滑块左边的距离
  });
  const { left, startTime } = state;
  const start = (e: any) => {
    e = e || window.event;
    let x;
    if (!e.touches) {
      //兼容PC端
      x = e.clientX;
    } else {
      //兼容移动端
      x = e.touches[0].pageX;
    }
    // if (status !== 'moveEnd') {
    setState({
      x,
      startTime: new Date().getTime(),
    });
    setStatus('moving');
    e.stopPropagation();
    // }
  };

  const move = (e: any) => {
    e = e || window.event;
    if (status === 'moving') {
      let x;
      if (!e.touches) {
        //兼容PC端
        x = e.clientX;
      } else {
        //兼容移动端
        x = e.touches[0].pageX;
      }
      const distance = x - state.x;
      if (distance > 0 && distance <= 240) {
        //区域内有效滑动
        setState({ left: distance });
      }
    }
  };

  const getData = async () => {
    const { repCode, repData, repMsg } = await picture(path, {
      captchaType: 'blockPuzzle',
      clientUid: localStorage.getItem('slider'),
      ts: Date.now(),
    });

    if (repCode === '0000') {
      setPreview({
        image: repData.originalImageBase64,
        block: repData.jigsawImageBase64,
        token: repData.token,
        secretKey: repData.secretKey,
        code: repCode,
      });
      setStatus('wait'); //等待校验
    } else {
      setPreview({
        code: repCode,
      });
      setStatus('load_error'); //加载数据出错
      onFail(repMsg);
    }
  };

  const end = () => {
    const endMoveTime = new Date().getTime();
    console.log(endMoveTime);
    //判断是否重合
  };

  useEffect(() => {
    storage();
    getData();
  }, []);

  const renderError = () => {
    return (
      <div>
        <i className="ac-icon ac-warning ac-icon-tip" />
        {CODE[preview.code]}
      </div>
    );
  };

  if (status === 'loading') {
    return <Loading />;
  }
  let className = 'ac-slide-bar-left ';
  let moveBarClass = 'ac-slide-bar-move ';
  let iconClass = 'ac-arrow-right';
  const complete = ['success', 'fail'].includes(status);
  if (complete) {
    //验证样式处理
    className += `ac-slide-bar-${status}`;
    moveBarClass += `ac-slide-bar-move-${status}`;
    iconClass = `ac-${status}`;
  }

  return (
    <div className="ac-slide-container">
      <div
        className="ac-slide-panel-wrap"
        style={{ height: `${panel.height + 5}px` }}
      >
        <div className="ac-slide-panel" style={{ ...panel }}>
          {preview.image ? (
            <img
              src={`data:image/png;base64,${preview.image}`}
              className="ac-slide-image"
            />
          ) : (
            <div className="ac-fail-container" style={{ ...panel }}>
              <div>{renderError()}</div>
            </div>
          )}
          <div className="ac-slide-refresh" onClick={getData}>
            <i className="ac-icon ac-refresh ac-slide-icon-refresh" />
          </div>
          {complete && (
            <span className={`ac-slide-tip ac-slide-${status}`}>
              <span style={{ marginLeft: '10px' }}>
                {status === 'success' ? `验证成功，耗时${time}s` : '验证失败'}
              </span>
            </span>
          )}
        </div>
        <div
          className="ac-slide-bar-move-block"
          style={{
            width: Math.floor((panel.width * 47) / 310) + 'px',
            height: panel.height,
            left: left,
            backgroundSize: `${panel.width}px ${panel.height}px`,
          }}
        >
          {preview.block && (
            <img
              src={`data:image/png;base64,${preview.block}`}
              className="ac-slide-image"
            />
          )}
        </div>
      </div>
      {/*bar展示*/}
      <div
        className="ac-slide-bar"
        onMouseMove={move}
        // onMouseLeave={end}
        style={{ width: panel.width, height: bar }}
        // ref={setBar}
      >
        <span className="ac-slide-bar-message">
          {status === 'moving' ? '' : '向右滑动完成验证'}
        </span>
        <div
          className={className}
          style={{
            width: left || bar,
            height: bar,
          }}
        >
          <div
            className={moveBarClass}
            onTouchStart={start}
            onMouseDown={start}
            onMouseUp={end}
            style={{
              width: bar,
              height: bar,
              left: left,
            }}
          >
            <i
              className={`ac-icon ac-slide-icon-right ${iconClass}`}
              style={{ color: status === 'moving' ? '#fff' : '' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Slide.defaultProps = {};

export default Slide;
