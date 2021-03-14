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
}
function observe(data) {
  //data是基本类型则返回
  let type = Object.prototype.toString.call(data)
  if(type !== '[object Object]' && type !== '[object Array]'){
    return
  }
  new Observer(data)
}
function defineReactive(obj, key, value) {
  observe(obj[key])
  let dep = new Dep()
  Object.defineProperty(obj,key,{
    enumerable:true,
    configurable:true,
    get:function reactiveGetter() {
      //收集
      dep.depend()
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
    this.walk(data)
  }
  walk(data) {
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(data,keys[i],data[keys[i]])
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