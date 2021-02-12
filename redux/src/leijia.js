import React, { Component } from 'react';
import store from './store1'
export default class leijia extends Component {
    constructor(p){
        super(p)
        this.state=store.getState();
        store.subscribe(this.storeChange.bind(this))
    }
    render() {
        return (
            <div>
                <h2>{this.state.num}</h2>
                <button onClick={this.addFn.bind(this)}>累加</button>
                
            </div>
        );
    }
    addFn(){
        const action ={
            type:'add_num',
            value:1
        }
        store.dispatch(action)
    }
      // 订阅触发
      storeChange() {
        this.setState(store.getState())
    }
}

