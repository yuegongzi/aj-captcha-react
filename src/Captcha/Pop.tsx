import type { FC } from 'react';
import React from 'react';
import type { PopProps } from './PropsType';
import './style/index.less';

const Pop: FC<PopProps> = (props) => {
  const { panel, visible, onCancel } = props;
  if (visible) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
  return (
    <div className="ac-slide-down">
      <div
        className="ac-slide-pop-mask "
        style={{ display: visible ? 'block' : 'none' }}
      >
        <div
          className="ac-slide-pop-body"
          style={{ maxWidth: `${panel.width + 30}px` }}
        >
          <div className="ac-slide-pop-top">
            请完成安全验证
            <div className="ac-slide-pop-close" onClick={onCancel}>
              <i className="ac-icon ac-fail" />
            </div>
          </div>
          {visible && ( //避免子级元素装载,导致滑动组件获取坐标位置不正确
            <div className="ac-slide-pop-bottom">{props.children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

Pop.defaultProps = {};

export default Pop;
