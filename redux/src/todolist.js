import React, { Component } from 'react';
import { Button, Input } from 'antd';
import { List, Typography, Divider } from 'antd';
import style from './index.module.css'
import store from './store/index.js'
import {CHANGE_IPT_VAL,ADD_TO_ARR,DEL_ARR}from './store/actionType'
import {CHANGE_IPT_VAL_ACTION,ADD_TO_ARR_ACTION,DEL_ARR_ACTION} from './store/actionCreators'


class todolist extends Component {
    constructor(p) {
        super(p)
        this.state = store.getState();
        // 订阅检测state变化
        store.subscribe(this.storeChange.bind(this))
    }
    render() {
        return (
            <div>
                <Input placeholder="请输入内容" value={this.state.iptval} onChange={this.handleChange.bind(this)} className={style.myinput} />

                <Button type="primary" onClick={this.handclick.bind(this)}>添加</Button>
                <List
                    bordered
                    style={{ marginTop: '20px', width: '470px' }}

                    dataSource={this.state.data}
                    renderItem={(item,index )=> (
                        <List.Item key={index} style={{userSelect:'none'}} onDoubleClick={this.handdbclick.bind(this,index)}>
                            {item}
                        </List.Item>
                    )}
                />
            </div>
        );
    }
    handleChange(e) {
        // this.setState({
        //     iptval: e.target.value
        // })
        // 触发reducer这边修改数据  (真正的说法 触发store去修改数据)
        const action = CHANGE_IPT_VAL_ACTION(e.target.value)
        // 派发
        store.dispatch(action)
    }
    handdbclick(index){
        const action = DEL_ARR_ACTION(index)
        // 派发
        store.dispatch(action)
    }
    handclick(e) {
        const action = ADD_TO_ARR_ACTION()
        // 派发
        store.dispatch(action)
    }

    // 订阅触发
    storeChange() {
        this.setState(store.getState())
    }
}

export default todolist;