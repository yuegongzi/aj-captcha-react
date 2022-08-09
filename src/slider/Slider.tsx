import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import type { SliderProps } from './PropsType';
import { createNamespace, toImg, slideSecond ,stop} from '../utils';
import Icon from '../icon';
import './style/index.less';
import classNames from 'classnames';

const [bem] = createNamespace('slider');

const slider = {
  default: {
    className: 'default',
    icon: 'arrow',
    color: '#444',
    spin: false
  },
  submit: {
    className: 'active',
    icon: 'loading',
    color: '#fff',
    spin: true
  },
  active: {
    className: 'active',
    icon: 'arrow',
    color: '#fff',
    spin: false
  },
  success: {
    className: 'success',
    icon: 'success',
    color: '#fff',
    spin: false
  },
  failure: {
    className: 'failure',
    icon: 'failure',
    color: '#fff',
    spin: false
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

  useEffect(()=>{
    if(captcha.image !== null){
      setSliderVariant(slider.default)
      setSolving(false)
      setSubmit(false)
      setOrigin({
        x: 0,
        y: 0,
      })
      setTrail(
        {
          x: [0],
          y: [0],
        }
      )
    }
  },[captcha])
  const handleStart = (e: any) => {
    stop(e)
    if (submit) return;
    setOrigin({
      x: e.clientX || e.touches[0].clientX,
      y: e.clientY || e.touches[0].clientY,
    });
    setSolving(true);
    setSliderVariant(slider.active);
  };

  const handleMove = (e: any) => {
    stop(e)
    if (!solving || submit) return;
    const move = {
      x: (e.clientX || e.touches[0].clientX) - origin.x,
      y: (e.clientY || e.touches[0].clientY) - origin.y,
    };
    if (move.x > 249 || move.x < 0) return; // Don't update if outside bounds of captcha
    setTrail({
      x: trail.x.concat([move.x]),
      y: trail.y.concat([move.y]),
    });
  };

  const handleEnd = async () => {
    if (!solving || submit) return;
    setSubmit(true);
    setSliderVariant(slider.submit)
    const left = trail.x[trail.x.length - 1];
    const distance = Math.round((left * 310) / 280);
    const validated = await onValid(
      JSON.stringify({ x: distance, y: 5.0 }),
      slideSecond(captcha, distance),
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

  const scaleSliderPosition = (x: number) => (x > 240 ? 240 : x);
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
      <div className={classNames(bem('title'))}>
        请完成安全验证
      </div>
      <div className={classNames(bem('image'))}>
        {captcha.image && <img alt='' src={toImg(captcha.image)} />}
      </div>
      <div
        className={classNames(bem('puzzle'))}
        style={{
          left: `${scaleSliderPosition(trail.x[trail.x.length - 1])}px`,
        }}
      >
        <img alt='' src={toImg(captcha.block)} />
      </div>
      <div className={classNames(bem('container'))}>
        <div className={classNames(bem('track'))} />
        <div
          className={classNames(bem('label'))}
          style={{ opacity: solving ? 0 : 1 }}
        >
          <span>向右滑动完成验证</span>
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
          <Icon spin={sliderVariant.spin}
                name={sliderVariant.icon} color={sliderVariant.color} />
        </div>
      </div>
    </div>
  );
};

Slider.defaultProps = {};

export default Slider;
