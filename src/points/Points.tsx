import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import type { Point, PointsProps } from './PropsType';
import Icon from '../icon';
import { createNamespace, toImg, pointSecond } from '../utils';
import './style/index.less';
import classNames from 'classnames';

const CHECK_WORD = 3;
const [bem] = createNamespace('points');

const point = {
  default: {
    className: 'default',
    icon: '',
    text: (captcha: any) => {
      if (!captcha.word) {
        return '';
      }
      let word = '';
      if (captcha.word) {
        word = `请依次点击〖${captcha.word}〗`;
      }
      return word.replaceAll(',', '、');
    },
  },
  submit: {
    className: 'active',
    icon: 'loading',
    spin: true,
    text: () => '校验中...',
  },
  success: {
    className: 'success',
    icon: 'success',
    text: () => '校验成功',
  },
  failure: {
    className: 'failure',
    icon: 'failure',
    text: () => '校验失败',
  },
};

const Points: FC<PointsProps> = (props) => {
  const { className, captcha, onValid } = props;
  const [pointVariant, setPointVariant] = useState<any>(point.default);
  const [points, setPoints] = useState<Point[]>([]);
  // @ts-ignore
  const getMouse = ({ nativeEvent: { offsetX, offsetY } }) => {
    return { x: offsetX, y: offsetY };
  };

  const onClick = async (e: any) => {
    if (points.length < CHECK_WORD) {
      const pointList = [...points, getMouse(e)];
      setPoints(pointList);
      if (pointList.length === CHECK_WORD) {
        setPointVariant(point.submit)
        const validate = await onValid(
          JSON.stringify(pointList),
          pointSecond(captcha, pointList),
        );
        setPointVariant(validate ? point.success : point.failure);
      }
    }
  };

  useEffect(()=>{
    if(captcha.image !== null){
      setPointVariant(point.default)
      setPoints([])
    }
  },[captcha])

  return (
    <div className={classNames(className, bem())}>
      <div className={classNames(bem('title'))}>
        请完成安全验证
      </div>
      <div className={classNames(bem('image'))}>
        {captcha.image && <img alt='' src={toImg(captcha.image)} onClick={onClick} />}
      </div>
      {points.map((p, index) => (
        <div
          key={index}
          className={classNames(bem('point'))}
          style={{
            top: `${p.y+20 }px`,
            left: `${p.x }px`,
          }}
        >
          <div> {index + 1}</div>
        </div>
      ))}
      <div className={classNames(bem('bar', [pointVariant.className]))}>
        <Icon spin={pointVariant.spin}
              name={pointVariant.icon} color='#fff' />
        <div>{pointVariant.text(captcha)}</div>
      </div>
    </div>
  );
};

Points.defaultProps = {};

export default Points;
