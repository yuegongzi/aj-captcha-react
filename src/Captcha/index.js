import React,{Fragment} from "react"
import Pop from './Pop';
import Slide from './Slide';
import Point from './Point';

export default class Captcha extends React.Component{
  static defaultProps = {
    panel: {
      height: 200,
      width: 310,
    },
    barHeight: 40,
    captchaType:"auto",// slide point
    type:"popup",// embed 嵌入式
    onCancel:()=>{},
    onFail:()=>{},
    onSuccess:()=>{}
  }
  state = {
    errorCount: 0,
    visible:false,
    captchaType:null
  }
  verify = ()=>{
    this.setState({visible:! this.state.visible})
  }
  onClose = ()=>{
    this.setState({visible:false})
    this.props.onCancel()
  }
  componentDidMount() {
    this.setState({captchaType:this.props.captchaType})
  }

  onFail = ()=>{
    const {errorCount,captchaType} = this.state;
    let a = errorCount + 1;
    if(errorCount >= 1 && captchaType === "auto"){
      this.setState({
        errorCount: a,
        captchaType:"point"
      })
      return false;
    }
    this.setState({
      errorCount: a,
    })
    return true;
  }
  onSuccess = (data)=>{
    setTimeout(()=>{
      this.setState({visible:false})
      this.props.onSuccess(data)
    },1000)
  }

  render() {
    const {type,...options} = this.props;
    const {captchaType,visible} = this.state;
    if(type === 'popup'){
     return  <Pop panel={this.props.panel} visible={visible} onClose={this.onClose}>
        {(captchaType === 'auto' || captchaType === 'slide') && <
          Slide {...options}
                onSuccess={this.onSuccess}
                onValidFail={this.onFail}
        />}
        {(captchaType === 'point') && <Point
           {...options} onSuccess={this.onSuccess}/>}
      </Pop>
    }
    return (
      <Fragment >
        {(captchaType === 'auto' || captchaType === 'slide') &&
        <Slide {...options}
               onValidFail={this.onFail}
        />}
        {(captchaType === 'point') &&
        <Point {...options} />}
      </Fragment>
    )
  }
}
