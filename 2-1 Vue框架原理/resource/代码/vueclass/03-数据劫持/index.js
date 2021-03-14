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
    for (let i = 0; i < keys.length; i++) {
      let value = data[keys[i]]
      Object.defineProperty(data,keys[i],{
        enumerable:true,
        configurable:true,
        get:function reactiveGetter() {
          console.log(`data的${keys[i]}取值`);
          return value
        },
        set:function reactiveSetter(val) {
          if(val === value){
            return
          }
          console.log(`data的${keys[i]}的值发生了改变`);
          value = val
        }
      })
    }
  }
}