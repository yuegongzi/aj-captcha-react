import React, { PureComponent } from 'react';
import {
  addListener,
  aesEncrypt,
  CODE,
  storage,
  slideSecond,
} from '../utils/utils';
import { check, picture } from '../utils/request';
import Loading from '../loading/Loading';
import '../assert/fonts/iconfont.css';
import './index.less';

const block = {
  width: 50,
  height: 50,
};
/**
 * 滑动验证组件基本逻辑,将滑动拆分为如下5种状态
 * 1.loading 加载验证码中 此时处理loading过渡动画,避免图片未加载完成时进行点击
 * 2.checking 请求服务器校验用户拖动结果 避免拖动后请求过程中依然能拖动鼠标
 * 3.moving 拖动中 处理拖动中的逻辑,左边bar的位置和颜色
 * 4.complete 拖动完成,进入校验环节
 * 5.pass 校验结果
 */
export default class Slide extends PureComponent {
  constructor() {
    super();
    this.bar = {
      left: 0,
      offsetWidth: 0,
    };
  }

  static defaultProps = {
    panel: {
      height: 155,
      width: 280,
    },
    barHeight: 40,
    path: null,
    onFail: () => {},
    onSuccess: () => {},
    onValidFail: () => {
      return true;
    },
  };

  state = {
    preview: {}, //后台返回的预览数据
    moving: false, //拖动中
    complete: false, //验证完成
    pass: false, //验证状态
    checking: false, //验证中
    loading: true, //加载验证码中
    code: '0000',
  };

  start = (e) => {
    e = e || window.event;
    let x;
    if (!e.touches) {
      //兼容PC端
      x = e.clientX;
    } else {
      //兼容移动端
      x = e.touches[0].pageX;
    }
    const { complete } = this.state;
    let startLeft = Math.floor(x - this.bar.left); //记录开始滑动距离
    let startMoveTime = new Date(); //开始滑动的时间

    if (!complete) {
      this.setState({
        startLeft,
        startMoveTime,
        moving: true,
      });
      e.stopPropagation();
    }
  };

  move = (e) => {
    e = e || window.event;
    const { moving, complete, startLeft } = this.state;
    const { left, offsetWidth } = this.bar;
    if (moving && !complete) {
      let x;
      if (!e.touches) {
        //兼容PC端
        x = e.clientX;
      } else {
        //兼容移动端
        x = e.touches[0].pageX;
      }
      const haf_block = block.width / 2;
      let move_block_left = x - left; //小方块相对于父元素的left值
      if (move_block_left >= offsetWidth - haf_block - 1) {
        move_block_left = offsetWidth - haf_block - 1;
      }
      if (move_block_left <= 0) {
        move_block_left = haf_block;
      }
      //拖动后小方块的left值
      let leftBarWidth = move_block_left - startLeft;
      this.setState({
        moveBlockLeft: leftBarWidth,
        leftBarWidth: leftBarWidth,
      });
    }
  };

  end = () => {
    const endMoveTime = +new Date();
    const { moving, complete, moveBlockLeft, preview, startMoveTime } =
      this.state;
    const { panel } = this.props;
    //判断是否重合
    if (moving && !complete) {
      this.setState({ moving: false, checking: true });
      const moveLeftDistance = (moveBlockLeft * 310) / panel.width;
      const data = {
        captchaType: 'blockPuzzle',
        pointJson: preview.secretKey
          ? aesEncrypt(
              JSON.stringify({
                x: moveLeftDistance,
                y: 5.0,
              }),
              preview.secretKey,
            )
          : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
        token: preview.token,
        clientUid: localStorage.getItem('slider'),
        ts: Date.now(),
      };
      check(this.props.path, data).then((res) => {
        if (res.repCode === '0000') {
          this.setState({
            complete: true,
            pass: true,
            checking: false,
            moving: false,
            time: ((endMoveTime - startMoveTime) / 1000).toFixed(2),
          });
          this.props.onSuccess(slideSecond(preview, moveLeftDistance));
        } else {
          this.setState({
            complete: true,
            pass: false,
            checking: false,
            moving: false,
          });
          setTimeout(() => {
            const res = this.props.onValidFail();
            if (res) {
              this.getData();
            }
          }, 500);
        }
      });
    }
  };

  componentDidMount() {
    addListener(this);
    storage();
    this.getData();
  }

  getData = async () => {
    const { repCode, repData, repMsg } = await picture(this.props.path, {
      captchaType: 'blockPuzzle',
      clientUid: localStorage.getItem('slider'),
      ts: Date.now(),
    });
    if (repCode === '0000') {
      this.setState({
        preview: {
          image: repData.originalImageBase64,
          block: repData.jigsawImageBase64,
          token: repData.token,
          secretKey: repData.secretKey,
          code: repCode,
        },
        loading: false,
        moving: false,
        complete: false,
        moveBlockLeft: 0,
        leftBarWidth: 0,
      });
    } else {
      this.setState({ preview: {}, loading: false, code: repCode });
      this.props.onFail(repMsg);
    }
  };

  setBar = (event) => {
    let left = event && event.getBoundingClientRect().left;
    let offsetWidth = event && event.offsetWidth;
    this.bar = {
      left,
      offsetWidth,
    };
  };

  renderError = () => {
    return (
      <span>
        <i className="ac-icon ac-warning" style={{ fontSize: '50px' }} />
        <br />
        <br />
        {CODE[this.state.code]}
      </span>
    );
  };

  render() {
    const { panel, barHeight } = this.props;
    const {
      preview,
      leftBarWidth,
      moving,
      moveBlockLeft,
      complete,
      pass,
      time,
      checking,
      loading,
    } = this.state;
    if (loading) {
      return <Loading />;
    }
    let className = 'ac-slide-bar-left ';
    let moveBarClass = 'ac-slide-bar-move ';
    let iconClass = 'ac-arrow-right';
    if (complete) {
      //验证通过
      className += pass ? 'ac-slide-bar-success' : 'ac-slide-bar-fail';
      moveBarClass += pass
        ? 'ac-slide-bar-move-success'
        : 'ac-slide-bar-move-fail';
      iconClass = pass ? 'ac-success' : 'ac-fail';
    }
    const processing = moving || complete || checking;
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
                <div>{this.renderError()}</div>
              </div>
            )}
            <div className="ac-slide-refresh" onClick={this.getData}>
              <i className="ac-icon ac-refresh ac-slide-icon-refresh" />
            </div>
            {complete && (
              <span
                className={`ac-slide-tip ${
                  pass ? 'ac-slide-success' : 'ac-slide-error'
                }`}
              >
                <span style={{ marginLeft: '10px' }}>
                  {pass ? `验证成功，耗时${time}s` : '验证失败'}
                </span>
              </span>
            )}
          </div>
          <div
            className="ac-slide-bar-move-block"
            style={{
              width: Math.floor((panel.width * 47) / 310) + 'px',
              height: panel.height,
              left: moveBlockLeft,
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
          style={{ width: panel.width, height: barHeight }}
          ref={this.setBar}
        >
          <span className="ac-slide-bar-message">
            {processing ? '' : '向右滑动完成验证'}
          </span>
          <div
            className={className}
            style={{
              width: leftBarWidth || barHeight,
              height: barHeight,
            }}
          >
            <div
              className={moveBarClass}
              onTouchStart={this.start}
              onMouseDown={this.start}
              style={{
                width: barHeight,
                height: barHeight,
                left: moveBlockLeft,
              }}
            >
              <i
                className={`ac-icon ac-slide-icon-right ${iconClass}`}
                style={{ color: processing ? '#fff' : '' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
