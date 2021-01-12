Page({

  /**
   * 页面的初始数据
   */
  data: {
    val: "",
    msg: "hello mina",
    num: 1000,
    isGirl: false,
    person: {
      age: 74,
      height: 145,
      weight: 200,
      name: "富婆"
    },
    isChecked: true
  },


  inputHandle(e) {
    this.setData({
      val: e.detail.value
    })
  },
  warnhandle(e) {
    const { id, name } = e.target.dataset
    console.log(id)
    console.log(name)
  }

})