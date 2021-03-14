class Vue {
  constructor(options) {
    this.$options = options
    // TODO:data可能是函数
    this._data = options.data
    this.initData()
  }
  initData() {
    let data = this._data
    let keys = Object.keys(data)
    for (let i = 0; i <keys.length; i++) {
      Object.defineProperty(this,keys[i],{
        enumerable:true,
        configurable:true,
        get:function proxyGetter() {
          return data[keys[i]]
        },
        set:function proxySetter(value) {
          data[keys[i]] = value
        }
      })
    }
    observe(data)
    this.initWatch()
  }
  initWatch(){
    let watch = this.$options.watch
    if(watch){
      let keys = Object.keys(watch)
      for (let i = 0; i < keys.length; i++) {
        new Watcher(this, keys[i],watch[keys[i]])
      }
    }
  }
  $watch(key,cb){
    new Watcher(this, key,cb)
  }
  $set(target,key,value){
    defineReactive(target,key,value)
    target.__ob__.dep.notify()
  }
}
function observe(data) {
  //data是基本类型则返回
  let type = Object.prototype.toString.call(data)
  if(type !== '[object Object]' && type !== '[object Array]'){
    return
  }
  if(data.__ob__){
    return data.__ob__
  }
  return new Observer(data)
}
function defineReactive(obj, key, value) {
  let childOb = observe(obj[key])

  let dep = new Dep()
  Object.defineProperty(obj,key,{
    enumerable:true,
    configurable:true,
    get:function reactiveGetter() {
      //收集
      dep.depend()
      if(childOb){
        childOb.dep.depend()
      }
      return value
    },
    set:function reactiveSetter(val) {
      if(val === value){
        return
      }
      //通知
      dep.notify()
      value = val
    }
  })
}
class Observer {
  constructor(data){
    this.dep = new Dep()
    if(Array.isArray(data)){
      data.__proto__ = ArrayMethods
      this.observeArray(data)
    }else {
      this.walk(data)
    }
    Object.defineProperty(data,'__ob__',{
      value:this,
      enumerable:false,
      configurable:true,
      writable:true
    })

  }
  walk(data) {
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(data,keys[i],data[keys[i]])
    }
  }
  observeArray(arr) {
    for (let i = 0; i < arr.length; i++) {
      observe(arr[i])
    }
  }
}
class Dep {
  constructor() {
    this.subs = []
  }
  depend() {
    if(Dep.target){
      this.subs.push(Dep.target)
    }
  }
  notify() {
    this.subs.forEach((watcher)=>{
      //依次执行回调函数
      watcher.run()
    })
  }
}
let watcherId = 0
let watcherQueue = []
class Watcher {
  constructor(vm,exp,cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.id = ++watcherId
    this.get()
  }
  //求值
  get() {
    Dep.target = this
    this.vm[this.exp]
    Dep.target = null
  }
  run() {
    if(watcherQueue.indexOf(this.id) !== -1){ //已经存在于队列中
      return
    }
    watcherQueue.push(this.id)

    Promise.resolve().then(()=>{
      this.cb.call(this.vm)
      let index = watcherQueue.indexOf(this.id)
      watcherQueue.splice(index,1)
    })
  }
}
const ArrayMethods = {}
ArrayMethods.__proto__ = Array.prototype
const methods = [
  'push',
  'pop',
  //其他需要拦截的方法
]
methods.forEach(method => {
  ArrayMethods[method] = function (...args) {
    // [].push(1,2,3)
    // args  [1,2,3]
    if(method === 'push'){
      this.__ob__.observeArray(args)
    }
    const result = Array.prototype[method].apply(this, args)
    this.__ob__.dep.notify()
    return result
  }
})