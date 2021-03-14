/**
 * 
 * @param {Function} reducer 
 * @param {any} preloadedState 
 * @param {Function} enhancer 
 */
export default function createStore(reducer, preloadedState, enhancer) {
  // 实现第二个形参选填
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }
  
  if (typeof reducer !== 'function') {
    throw new Error('reducer is not a function');
  }
  
  let currentReducer = reducer;
  let currentState = preloadedState;
  let currentListeners = [];

  // 这是一个很重要的设计
  let nextListeners = currentListeners;
  // Redux 规定在执行 reducer 的过程中中不允许使用 getState subscribe 和 dispacth
  let isDispatching = false;
  // todo
  function getState() {
    if (isDispatching) {
      throw new Error('reducer is execution');
    }
    return currentState;
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('listener is not a function');
    }

    if (isDispatching) {
      throw new Error('reducer is execution');
    }

    if (nextListeners == currentListeners) {
      // 浅复制
      nextListeners = currentListeners.slice();
    }
    nextListeners.push(listener);

    return function unsubscribe() {
      // 状态检查
      if (isDispatching) {
        throw new Error('reducer is execution');
      }

      if (nextListeners == currentListeners) {
        // 浅复制
        nextListeners = currentListeners.slice();
      }

      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    }
  }

  function dispatch(action) {
    if (typeof action !== 'object') {
      throw new Error('action is not a object');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
   
    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }

    return action;
  }

  // 初始化
  dispatch({type: 'INIT'});

  return {
    getState,
    dispatch,
    subscribe,
    // replaceReducer, // 这个方法是一个高级 API, reducer 的热加载
  }
}