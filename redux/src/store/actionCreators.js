import {CHANGE_IPT_VAL,ADD_TO_ARR,DEL_ARR}from './actionType'

export const  CHANGE_IPT_VAL_ACTION=(val)=>{
    return {
        type: CHANGE_IPT_VAL,
        value: val
    }
}
export const  ADD_TO_ARR_ACTION=()=>{
    return {
        type: ADD_TO_ARR,
    }
}
export const  DEL_ARR_ACTION=(index)=>{
    return {
        type: DEL_ARR,
        value:index
    }
}