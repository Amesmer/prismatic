class Vue {
  constructor(options) {
    this.$options = options
    // TODO:data可能是函数
    //初始化渲染函数
    if(options.el){
      let html = document.querySelector(options.el).outerHTML
      let ast = parser(html)
      let code = generate(ast).render
      this.$options.render = new Function(code)
    }
    this._data = options.data
    this.initData()
    this.initComputed()
    this.initWatch()

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
  }
  initComputed() {
    let computed = this.$options.computed
    if(computed){
      let keys = Object.keys(computed)
      for (let i = 0; i < keys.length; i++) {
        const watcher = new Watcher(this, computed[keys[i]],function () {},{
          lazy:true
        })
        Object.defineProperty(this,keys[i],{
          enumerable:true,
          configurable:true,
          get:function computedGetter() {
            //1号watcher lazy watcher 计算属性
            if(watcher.dirty){
              watcher.get()
              watcher.dirty = false
            }
            //person已经收集了 1号watcher,此时1号watcher也记录了person的dep
            //watcher.get()
            //watcher.exp.call(watcher.vm)
            if(Dep.target){
              //1号watcher收集到的dep，把这些dep一个个拿出来通知他们收集，现在仍然在台上的2号watcher
              for (let j = 0; j < watcher.deps.length; j++) {
                watcher.deps[j].depend()
              }
            }
            return watcher.value
          },
          set:function computedSetter() {
            console.warn('请不要给计算属性赋值')
          }
        })
      }
    }
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
let targetStack = []
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  depend() {
    if(Dep.target){
      Dep.target.addDep(this)
    }
  }
  notify() {
    this.subs.forEach((watcher)=>{
      //依次执行回调函数
      watcher.update()
    })
  }
}
let watcherId = 0
let watcherQueue = []
class Watcher {
  constructor(vm,exp,cb,options = {}) {
    this.dirty = this.lazy = !!options.lazy
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.id = ++watcherId
    this.deps = []
    if(!this.lazy){
      this.get()
    }
  }
  addDep(dep) {
    //dep实例有可能被收集过，如果收集过，则直接返回
    if(this.deps.indexOf(dep) !== -1){
      return
    }
    this.deps.push(dep)
    dep.addSub(this)
  }
  //求值
  get() {
    targetStack.push(this)
    Dep.target = this
    if(typeof this.exp === 'function'){
      this.value = this.exp.call(this.vm)
    }else {
      this.value = this.vm[this.exp]
    }
    targetStack.pop()
    if(targetStack.length > 0){
      //将栈顶的watcher拿出来放到“舞台”
      Dep.target = targetStack[targetStack.length - 1]
    }else {
      Dep.target = null
    }

  }
  update() {
    if(this.lazy){
      this.dirty = true
    }else {
      this.run()
    }
  }
  run() {

    if(watcherQueue.indexOf(this.id) !== -1){ //已经存在于队列中
      return
    }
    watcherQueue.push(this.id)

    Promise.resolve().then(()=>{
      this.get()
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