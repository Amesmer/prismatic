import {CHANGE_IPT_VAL,ADD_TO_ARR,DEL_ARR}from './actionType'
// 定义默认的状态数据
const defaultState = {
    iptval: '111',
    data: [
        'a', 'b', 'c'
    ]
}


// 导出一个函数,返回状态数据
export default (state = defaultState, action) => {
    // reducer 只能接收和返回一个state
    let newState = JSON.parse(JSON.stringify(state))
    // reducer 接收到一个事件需要先判断他的类型
    switch (action.type) {
        case CHANGE_IPT_VAL:
            newState.iptval = action.value
            break
        case ADD_TO_ARR:
            newState.data.push(newState.iptval)
            break
        case DEL_ARR:
            newState.data.splice(action.value,1)
            break
        default:
            break;
    }

    return newState
}