import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group';
import './index.less';

export default class Pop extends PureComponent {
  static defaultProps = {
    panel: {
      height: 200,
      width: 310,
    },
    visible: false,
  };
  render() {
    const { panel, visible,onClose } = this.props;
    return (
      <CSSTransition in={visible}
                     timeout={1500} //动画执行1秒
                     classNames='ac-slide-down'>
        <div className='ac-slide-pop-mask ' style={{ display: visible ? 'block' : 'none' }}>
          <div className='ac-slide-pop-body' style={{ maxWidth: `${panel.width + 30}px` }}>
            <div className='ac-slide-pop-top'>
              请完成安全验证
              <div className='ac-slide-pop-close' onClick={onClose}>
                <i className='ac-icon ac-fail' />
              </div>
            </div>
            {visible && //避免子级元素装载,导致滑动组件获取坐标位置不正确
              <div className='ac-slide-pop-bottom'>
                {this.props.children}
              </div>
            }
          </div>
        </div>
      </CSSTransition>
    );
  }
}
