import React from 'react'
import ReactDom from 'react-dom'
import TodoList from './todolist'
import Leijia from './leijia'
import 'antd/dist/antd.css';

ReactDom.render(
    // <Leijia/>,
    <TodoList/>,

    document.getElementById('root')
)