import type { FC } from 'react';
import React, { useEffect } from 'react';
import { check, picture } from '../utils/request';
import { aesEncrypt, CODE, pointSecond, storage } from '../utils/utils';
import '../assert/fonts/iconfont.css';
import Loading from '../loading';
import type { PointModel, PointProps, PreviewProps } from './PropsType';
import useSetState from '../utils/hooks';

const STATE = {
  preview: {},
  bind: true,
  points: [],
  checkNum: 3, //默认需要点击的字数
  num: 1, //点击的记数
  pass: false, //验证通过
  complete: false, //验证完成
  code: '0000', //错误码
  loading: true,
};

const Point: FC<PointProps> = (props) => {
  const { panel, barHeight, path, onFail, onSuccess } = props;
  const [state, setState] = useSetState<any>(STATE);
  const {
    preview,
    points,
    complete,
    pass,
    loading,
    bind,
    num,
    checkNum,
    code,
  } = state;

  const getData = async () => {
    const { repCode, repData, repMsg } = await picture(path, {
      captchaType: 'clickWord',
      clientUid: localStorage.getItem('point'),
      ts: Date.now(),
    });
    if (repCode === '0000') {
      setState({
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
      setState({
        code: repCode,
        loading: false,
        complete: true,
        pass: false,
      });
      onFail(repMsg);
    }
  };

  const refresh = () => {
    setState({
      bind: true,
      points: [],
      checkNum: 3,
      num: 1,
      pass: false,
      complete: false,
    });
    getData();
  };

  //获取坐标
  // @ts-ignore
  const getMousePos = ({ nativeEvent: { offsetX, offsetY } }) => {
    return { x: offsetX, y: offsetY };
  };

  const pointTransform = (pointList: PointModel[]) => {
    return pointList.map((p) => {
      const x = Math.round((310 * p.x) / 310);
      const y = Math.round((155 * p.y) / 155);
      return { x, y };
    });
  };

  const canvasClick = (e: any) => {
    if (bind) {
      points.push(getMousePos(e));
      setState({
        points: points,
      });

      if (num === checkNum) {
        //点击数相同
        setState({
          bind: false,
        });
        const data = {
          captchaType: 'clickWord',
          pointJson: preview.secretKey
            ? aesEncrypt(JSON.stringify(points), preview.secretKey)
            : JSON.stringify(points),
          token: preview.token,
          clientUid: localStorage.getItem('point'),
          ts: Date.now(),
        };
        check(path, data).then((res) => {
          if (res.repCode === '0000') {
            setState({
              pass: true,
              complete: true,
            });
            onSuccess(pointSecond(preview, pointTransform(points)));
          } else {
            setState({
              pass: false,
              complete: true,
              code: res.repCode,
            });
            setTimeout(() => {
              refresh();
            }, 1000);
          }
        });
      }
      if (num < checkNum) {
        setState({
          num: num + 1,
        });
      }
    }
  };

  const replaceWord = (p: PreviewProps) => {
    let word = '';
    if (p.word) {
      word = `请依次点击〖${p.word}〗`;
    }
    return word.replaceAll(',', '、');
  };

  useEffect(() => {
    storage();
    getData();
  }, []);

  const renderMessage = () => {
    if (complete) {
      if (pass) {
        return (
          <span className="ac-slide-bar-message  ac-point-message-success">
            <i className={'ac-icon ac-success'} /> 验证成功
          </span>
        );
      } else {
        return (
          <span className="ac-slide-bar-message  ac-point-message-fail">
            <i className={'ac-icon ac-fail '} /> {CODE[code]}
          </span>
        );
      }
    }
    return <span className="ac-slide-bar-message">{replaceWord(preview)}</span>;
  };

  let className = 'ac-slide-bar ';
  if (complete) {
    //验证通过
    className += pass ? 'ac-slide-bar-success' : 'ac-slide-bar-fail';
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="ac-slide-container">
      <div
        className="ac-slide-panel-wrap"
        style={{ height: `${panel.height + 5}px` }}
      >
        <div
          className="ac-slide-panel"
          style={{
            ...panel,
            backgroundSize: `${panel.width}px ${panel.height}px`,
            marginBottom: '5px',
          }}
        >
          <div className="ac-slide-refresh" onClick={refresh}>
            <i className="ac-icon ac-refresh ac-slide-icon-refresh" />
          </div>
          {preview.image ? (
            <img
              src={`data:image/png;base64,${preview.image}`}
              className="ac-slide-image"
              onClick={canvasClick}
            />
          ) : (
            <div className="ac-fail-container" style={{ ...panel }}>
              <div>
                <i
                  className="ac-icon ac-warning"
                  style={{ fontSize: '50px' }}
                />
              </div>
            </div>
          )}
          {points.map((point: PointModel, index: number) => (
            <div
              key={index}
              className="ac-point-area"
              style={{
                top: `${point.y - 10}px`,
                left: `${point.x - 10}px`,
              }}
            >
              <div>{index + 1}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={className}
        style={{
          width: panel.width,
          height: barHeight,
        }}
      >
        {renderMessage()}
      </div>
    </div>
  );
};

export default Point;
