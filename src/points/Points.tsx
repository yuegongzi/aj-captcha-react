import type { FC } from 'react';
import React, { useState } from 'react';
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
        const validate = await onValid(
          JSON.stringify(pointList),
          pointSecond(captcha, pointList),
        );
        setPointVariant(validate ? point.success : point.failure);
      }
    }
  };

  return (
    <div className={classNames(className, bem())}>
      <div className={classNames(bem('image'))}>
        <img alt="" src={toImg(captcha.image)} onClick={onClick} />
      </div>
      {points.map((p, index) => (
        <div
          key={index}
          className={classNames(bem('point'))}
          style={{
            top: `${p.y - 10}px`,
            left: `${p.x - 10}px`,
          }}
        >
          <div> {index + 1}</div>
        </div>
      ))}
      <div className={classNames(bem('bar', [pointVariant.className]))}>
        <Icon name={pointVariant.icon} color="#fff" />
        <div>{pointVariant.text(captcha)}</div>
      </div>
    </div>
  );
};

Points.defaultProps = {};

export default Points;
