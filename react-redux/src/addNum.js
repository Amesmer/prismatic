import React, { Component } from 'react';
import {connect } from 'react-redux'
// import store from './store'

class addNum extends Component {

    render() {
        return (
            <div>
                <h2>{this.props.num}</h2>
                <button onClick={this.props.handleclick.bind(this)}>add</button>
            </div>
        );
    }


}

 const mapStateToProps = (state, ownProps) => {
    return {
        num: state.num
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleclick(){
            const action ={
                type:'add_num',
                value:1
            }
            dispatch(action)
        }
    }
}
//after  import  connect  repalce export component   to   connect(状态的映射,事件派发的映射)(组件名称)
export default connect(mapStateToProps,mapDispatchToProps)(addNum);