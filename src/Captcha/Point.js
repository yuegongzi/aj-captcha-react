import React, { PureComponent } from 'react';
import { check, picture } from '../utils/request';
import { aesEncrypt, CODE, storage ,pointSecond} from '../utils/utils';
import './index.less';
import Loading from '../Loading/Loading';

export default class Point extends PureComponent {
  static defaultProps = {
    panel: {
      height: 200,
      width: 310,
    },
    barHeight: 40,
    path:null,
    onFail:()=>{},
    onSuccess:()=>{}
  };
  state = {
    preview: {},
    bind: true,
    points: [],
    checkNum: 3, //默认需要点击的字数
    num: 1, //点击的记数
    pass: false,//验证通过
    complete: false, //验证完成
    code: '0000', //错误码
    loading: true,
  };

  componentDidMount() {
    storage();
    this.getData();
  }

  refresh = () => {
    this.setState({
      bind: true,
      points: [],
      checkNum: 3,
      num: 1,
      pass: false,
      complete: false,
    });
    this.getData();
  };

  getData = async () => {
    const { repCode, repData,repMsg } = await picture(this.props.path,{
      captchaType: 'clickWord',
      clientUid: localStorage.getItem('point'),
      ts: Date.now(),
    });
    if (repCode === '0000') {
      this.setState({
        preview: {
          image: repData.originalImageBase64,
          token: repData.token,
          secretKey: repData.secretKey,
          word: repData.wordList,
        },
        loading: false,
        complete: false,
      });
    } else {
      this.setState({
        code: repCode,
        loading: false,
        complete: true,
        pass: false,
      });
      this.props.onFail(repMsg)
    }
  };

  canvasClick = (e) => {
    const { points, bind, num, checkNum, preview } = this.state;
    if (bind) {
      points.push(this.getMousePos(e));
      this.setState({
        points: points,
      });
      if (num === checkNum) {//点击数相同
        this.setState({
          bind: false,
        });
        let data = {
          captchaType: 'clickWord',
          pointJson: preview.secretKey ?
            aesEncrypt(JSON.stringify(points), preview.secretKey) :
            JSON.stringify(points),
          token: preview.token,
          clientUid: localStorage.getItem('point'),
          ts: Date.now(),
        };
        check(this.props.path, data).then(res => {
          if (res.repCode === '0000') {
            this.setState({
              pass: true,
              complete: true,
            });
            this.props.onSuccess(pointSecond(preview,this.pointTransform(points)))
          } else {
            this.setState({
              pass: false,
              complete: true,
              code: res.repCode,
            });
            setTimeout(() => {
              this.refresh();
            }, 1000);
          }
        });
      }
      if (num < checkNum) {
        this.setState({
          num: num + 1,
        });
      }
    }
  };

  //获取坐标
  getMousePos = ({ nativeEvent: { offsetX, offsetY } }) => {
    return { x: offsetX, y: offsetY };
  };

  pointTransform = (points) => {
    console.log("points",points)
    return points.map(p => {
      let x = Math.round(310 * p.x / 310)
      let y = Math.round(155 * p.y / 155)
      return { x, y }
    })
  }
  replaceWord = (preview) => {
    let word = '';
    if (preview.word) {
      word = `请依次点击〖${preview.word}〗`;
    }
    return word.replaceAll(',', '、');
  };

  renderMessage = () => {
    const { preview, complete, pass, code } = this.state;
    if (complete) {
      if (pass) {
        return (
          <span className='ac-slide-bar-message  ac-point-message-success'>
              <i className={`ac-icon ac-success`} /> 验证成功
        </span>
        );
      } else {
        return (
          <span className='ac-slide-bar-message  ac-point-message-fail'>
              <i className={`ac-icon ac-fail `} /> {CODE[code]}
        </span>
        );
      }
    }
    return (<span className='ac-slide-bar-message'>{this.replaceWord(preview)}</span>);
  };

  render() {
    const { panel, barHeight } = this.props;
    const { preview, points, complete, pass, code, loading } = this.state;
    if (loading) {
      return (<div style={{ ...panel, border: '1px solid #ddd' }}>
        <Loading />
      </div>);
    }
    let className = 'ac-slide-bar ';
    if (complete) {//验证通过
      className += pass ? 'ac-slide-bar-success' : 'ac-slide-bar-fail';
    }
    return (
      <div className='ac-slide-container'>
        <div className='ac-slide-panel-wrap' style={{ height: `${panel.height + 5}px` }}>
          <div className='ac-slide-panel'
               style={{
                 ...panel,
                 backgroundSize: `${panel.width}px ${panel.height}px`,
                 marginBottom: '5px',
               }}
          >
            <div className='ac-slide-refresh' onClick={this.refresh}>
              <i className='ac-icon ac-refresh ac-slide-icon-refresh' />
            </div>
            {preview.image ?
              <img src={`data:image/png;base64,${preview.image}`}
                   className='ac-slide-image'
                   onClick={this.canvasClick} /> :
              <div className='ac-fail-container' style={{ ...panel }}>
                <div>
                  <i className='ac-icon ac-warning' style={{ fontSize: '50px' }} />
                </div>
              </div>
            }
            {points.map((point, index) => (
              <div
                key={index}
                className='ac-point-area'
                style={{
                  top: `${point.y - 10}px`,
                  left: `${point.x - 10}px`,
                }}
              >{index + 1}
              </div>
            ))}
          </div>
        </div>

        <div
          className={className}
          style={{
            width: panel.width,
            height: barHeight,
            lineHeight: barHeight,
          }}
        >
          {this.renderMessage()}
        </div>
      </div>
    );
  }
}
