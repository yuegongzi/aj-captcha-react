import type { FC } from 'react';
import React, { useState } from 'react';
import type { SliderProps } from './PropsType';
import { createNamespace, toImg } from '../utils';
import Icon from '../icon';
import './style/index.less';
import classNames from 'classnames';

const [bem] = createNamespace('slider');

const slider = {
  default: {
    className: 'default',
    icon: 'arrow',
    color: '#000',
  },
  active: {
    className: 'active',
    icon: 'arrow',
    color: '#fff',
  },
  success: {
    className: 'success',
    icon: 'success',
    color: '#fff',
  },
  failure: {
    className: 'failure',
    icon: 'failure',
    color: '#fff',
  },
};

const Slider: FC<SliderProps> = (props) => {
  const { className, captcha, onValid } = props;
  const [sliderVariant, setSliderVariant] = useState(slider.default);
  const [solving, setSolving] = useState<boolean>(false);
  const [submit, setSubmit] = useState(false);
  const [origin, setOrigin] = useState({
    x: 0,
    y: 0,
  });
  const [trail, setTrail] = useState({
    x: [0],
    y: [0],
  });
  const handleStart = (e: any) => {
    if (submit) return;
    setOrigin({
      x: e.clientX || e.touches[0].clientX,
      y: e.clientY || e.touches[0].clientY,
    });
    setSolving(true);
    setSliderVariant(slider.active);
  };

  const handleMove = (e: any) => {
    if (!solving || submit) return;
    const move = {
      x: (e.clientX || e.touches[0].clientX) - origin.x,
      y: (e.clientY || e.touches[0].clientY) - origin.y,
    };
    if (move.x > 250 || move.x < 0) return; // Don't update if outside bounds of captcha
    setTrail({
      x: trail.x.concat([move.x]),
      y: trail.y.concat([move.y]),
    });
  };

  const handleEnd = async () => {
    if (!solving || submit) return;
    setSubmit(true);
    const left = trail.x[trail.x.length - 1];
    const moveLeftDistance = (left * 310) / 280;
    const validated = await onValid(
      JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
    );
    setSliderVariant(validated ? slider.success : slider.failure);
  };

  const handleEnter = () => {
    if (solving || submit) return;
    setSliderVariant(slider.active);
  };

  const handleLeave = () => {
    if (solving) return;
    setSliderVariant(slider.default);
  };

  const scaleSliderPosition = (x: number) => 5 + 0.93 * x;
  return (
    <div
      className={classNames(className, bem())}
      draggable={false}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      <div className={classNames(bem('image'))}>
        <img alt="" src={toImg(captcha.image)} />
      </div>
      <div
        className={classNames(bem('puzzle'))}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{
          left: `${scaleSliderPosition(trail.x[trail.x.length - 1])}px`,
        }}
      >
        <img alt="" src={toImg(captcha.block)} />
      </div>
      <div className={classNames(bem('container'))}>
        <div className={classNames(bem('track'))} />
        <div
          className={classNames(bem('label'))}
          style={{ opacity: solving ? 0 : 1 }}
        >
          <span>滑动完成验证</span>
        </div>
        <div
          className={classNames(bem('mask', [sliderVariant.className]))}
          style={{ width: `${trail.x[trail.x.length - 1] + 30}px` }}
        />
        <div className={classNames(bem('container'))} draggable={false} />
        <div
          className={classNames(bem('control', [sliderVariant.className]))}
          style={{ left: `${trail.x[trail.x.length - 1]}px` }}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <Icon name={sliderVariant.icon} color={sliderVariant.color} />
        </div>
      </div>
    </div>
  );
};

Slider.defaultProps = {};

export default Slider;
