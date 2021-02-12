const defaultState = {
    num: 0
}
export default (state = defaultState, action) => {
    let newstate=JSON.parse(JSON.stringify(state))
    switch (action.type) {
        case 'add_num':
            newstate.num+=action.value
            break
        default:
            break
    }

    return newstate
}