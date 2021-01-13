# 地图找房模块

## 目标

- 完成根据定位展示当前城市
- 能够完成在地图上渲染出文本覆盖物
- 能够对文本覆盖物进行内容和样式修改
- 能够说出地图找房功能的业务逻辑
- 理解地图找房的封装流程，知道每一个方法的作用是什么？
- 能够参照老师代码敲出地图找房的封装代码
- 能够使用Toast的loading效果来对页面进行优化

## 根据定位展示当前城市（★★★）

- 获取当前定位城市
- 使用 地址解析器 解析当前城市坐标
- 调用 centerAndZoom() 方法在地图中展示当前城市，并设置缩放级别为11
- 在地图中添加比例尺和平移缩放控件

## 实现房源信息子地图中展示（★★★）

![](images/房源覆盖物.png)

这些房源信息其实就是用文本覆盖物来实现的，所以我们先查看百度开发文档，先创建文本覆盖物

### 创建文本覆盖物

- 创建Label 示例对象
- 掉用setStyle() 方法设置样式
- 在map对象上调用 addOverlay() 方法，讲文本覆盖物添加到地图中

![](images/创建文本覆盖物.png)

### 绘制房源覆盖物

- 由于默认提供的本文覆盖物与我们效果不符合，所以我们需要进行重新的绘制

- 调用Label的 setContent方法，传入html结构，修改HTML的内容样式;注意：调用了setContent 那么里面文本的内容就失效了

![](images/绘制覆盖物.png)

- 调用setStyle方法修改覆盖物样式

![](images/绘制覆盖物-02.png)

- 给覆盖物添加点击事件

![](images/绘制覆盖物-03.png)

- 覆盖的内容结构

```html
<div class="${styles.bubble}">
  <p class="${styles.name}">${name}</p>
  <p>${num}套</p>
</div>
```

- 覆盖物的样式

```react
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255,0,0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rbg(255,255,255)',
    textAlign: 'center'
}
```

## 地图找房-业务逻辑分析（★★★）

- 获取房源数据，渲染覆盖物
- 点击覆盖物：
  - 放大地图
  - 获取数据，渲染下一级覆盖物
- 区、镇覆盖物的点击事件中，清除现有的覆盖物，获取下一级数据，创建新的覆盖物
- 小区：不清楚覆盖物，移动地图，展示该小区下的房源信息

### 获取所有区的信息

- 发送请求获取房源数据
- 遍历数据，创建覆盖物，给每一个覆盖物添加唯一标识
- 给覆盖物添加点击事件
- 在单击事件中，获取到当前单击项的唯一标识
- 放大地图（级别为13），调用clearOverlays()方法清除当前覆盖物

```react
// 请求接口，获取房源数据
let res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
// 遍历房源信息，创建对应的覆盖物
res.data.body.map(item => {
    // 给每一条数据添加覆盖物
    // 得到返回的经纬度信息
    let { coord: { longitude, latitude }, label: areaName, count, value } = item
    // 创建覆盖物
    let label = new window.BMap.Label('', {
        position: new window.BMap.Point(longitude, latitude),
        offset: new window.BMap.Size(-35, -35)
    })
    // 设置覆盖物内容
    label.setContent(`<div class="${styles.bubble}">
    <p class="${styles.name}">${areaName}</p>
    <p>${count}套</p>
  </div>`)
    // 设置样式
    label.setStyle(labelStyle)
    // 添加点击事件
    label.addEventListener('click', function () {
        // 当点击了覆盖物，要以当前点击的覆盖物为中心来放大地图
        map.centerAndZoom(this.K.position, 13);
        // 解决清除覆盖物的时候，百度地图js报错问题
        setTimeout(function () {
            map.clearOverlays()
        }, 0)
    })
    // 给label添加唯一标识
    label.id = value
    // 添加到地图上
    map.addOverlay(label)
})
```

### 封装流程（★★）

到目前为止，我们才完成地图找房的一环，也就是获取了区的房源信息，然后可以点击对应区的房源，清除地图上的覆盖物，而我们再实现镇的时候也是相同的逻辑，，实现小区的时候，逻辑流程也是相似的，所以我们可以对此进行一层封装，提高代码复用性

![](images/封装流程.png)

- renderOverlays() 作为入口
  - 接收区域id参数，获取该区域下的房源数据
  - 获覆盖物类型以及下级地图缩放级别
- createOverlays() 方法
  - 根据传入的类型，调用对应方法，创建覆盖物，到底是创建区镇的覆盖物还是小区覆盖物
- createCircle() 方法
  - 根据传入的数据创建覆盖物，绑定事件（放大地图，清除覆盖物，渲染下一级房源数据）
- createReact() 方法
  - 根据传入的数据创建覆盖物，绑定事件（移动地图，渲染房源列表）

#### renderOverlays 方法的封装

- 这个方法是整个封装的入口
- 在这个方法需要 接收区域id ，获取对应的房源数据

![](images/renderOverlays-01.png)

- 调用 getTypeAndZoom 方法获取地图缩放级别，覆盖物类别

![](images/renderOverlays-02.png)

示例demo

```react
/** 
* 根据id获取对应的房源信息
*/
async renderOverlays(id) {
    // 请求，拿到对应房源数据
    let res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
    let data = res.data.body

    let {type,nextZoom} = this.getTypeAndZoom()

    // 遍历，调用createOverlays,创建覆盖物
    data.map(item => {
        this.createOverlays(item,type,nextZoom)
    })
}
/**
 * 获取对应要绘制的类型和缩放的比例
 */
getTypeAndZoom() {
    // 获取当前地图缩放级别
    let zoom = this.map.getZoom()
    let nextZoom, type;
    if (zoom >= 10 && zoom < 12) {
        nextZoom = 13;
        // circle 表示绘制圆形的覆盖物，区
        type = "circle"
    } else if (zoom >= 12 && zoom < 14) {
        nextZoom = 15
        // circle 表示绘制圆形的覆盖物，镇
        type = "circle"
    } else if (zoom >= 14 && zoom < 16) {
        // circle 表示绘制矩形的覆盖物，小区
        type = "rect"
    }
    return { nextZoom, type }
}
```

#### createOverlays 方法的封装

- 这个方法没有太多的逻辑，主要是逻辑判断，然后根据不同条件调用不同渲染的方法

![](images/createOverlays.png)

示例demo

```react
/**
 * 绘制覆盖物的方法，根据type来判断绘制的是圆形还是矩形
 */
createOverlays(item, type, nextZoom) {
    let { coord: { longitude, latitude }, label: areaName, count, value } = item
    let point = new window.BMap.Point(longitude, latitude)
    // 判断需要渲染的是哪种类型
    if (type === 'circle') {
        // 区 或者 镇
        this.createCircle(point, areaName, count, value, nextZoom)
    } else if (type === 'rect') {
        // 小区
        this.createRect(point, areaName, count, value)
    }
}
```

#### createCircle 方法的封装

- 复用之前的创建覆盖物的代码逻辑
- 在覆盖物的单击事件中，调用 renderOverlays(id)方法，重新渲染该区域的房屋数据

![](images/createCircle.png)

#### createRect 方法的封装

- 创建Label、设置 样式、设置html内容，绑定事件
- 在单击事件中，获取小区下的所有房源数据
- 展示房源列表
- 渲染获取到的房源列表

房源列表相关样式：

```css
/* 房源列表样式： */

.houseList {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 330px;
    transition: all 1s;
    transform: translate3d(0, 330px, 0);
    background: #fff;
}

.show {
    transform: translate3d(0, 0, 0);
}

.titleWrap {
    position: relative;
    width: 100%;
    background: #c0c0c2;
    border-top: 1px solid #c8c8c8;
}

.listTitle {
    display: inline-block;
    padding-left: 10px;
    line-height: 43px;
    font-size: 16px;
    color: #1e1e1e;
    vertical-align: middle;
}

.titleMore {
    float: right;
    padding-right: 15px;
    line-height: 43px;
    font-size: 13px;
    color: #1e1e1e;
    vertical-align: middle;
}

.titleMore:visited {
    text-decoration: none;
}


/* 房屋列表项样式 */

.houseItems {
    padding: 0 10px;
    overflow-y: auto;
    height: 100%;
    padding-bottom: 45px;
}
```

 房屋列表样式

```css
/* 房屋列表项样式 */

.houseItems {
    padding: 0 10px;
    overflow-y: auto;
    height: 100%;
    padding-bottom: 45px;
}

.house {
    height: 120px;
    position: relative;
    box-sizing: border-box;
    justify-content: space-around;
    padding-top: 18px;
    border-bottom: 1px solid #e5e5e5;
}

.imgWrap {
    float: left;
    width: 106px;
    height: 80px;
}

.img {
    width: 106px;
    height: 80px;
}

.content {
    overflow: hidden;
    line-height: 22px;
    padding-left: 12px;
}

.title {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    font-size: 15px;
    color: #394043;
}

.desc {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
    font-size: 12px;
    color: #afb2b3;
}

.price {
    font-size: 12px;
    color: #fa5741;
}

.priceNum {
    font-size: 16px;
    font-weight: bolder;
}

.tag {
    display: inline-block;
    font-size: 12px;
    border-radius: 3px;
    padding: 4px 5px;
    margin-right: 5px;
    line-height: 12px;
}

.tag1 {
    color: #39becd;
    background: #e1f5f8;
}

.tag2 {
    color: #3fc28c;
    background: #e1f5ed;
}

.tag3 {
    color: #5aabfd;
    background: #e6f2ff;
}
```

示例demo

```react
// createRect逻辑代码
/**
 * 绘制矩形
 * @param {*} point 当前房源坐标
 * @param {*} areaName  名称
 * @param {*} count  数量
 * @param {*} value  id 
 */
createRect(point, areaName, count, value) {
    // 创建覆盖物
    let label = new window.BMap.Label('', {
        position: point,
        offset: new window.BMap.Size(-50, -28)
    })
    // 设置内容
    label.setContent(`
    <div class="${styles.rect}">
       <span class="${styles.housename}">${areaName}</span>
       <span class="${styles.housenum}">${count}套</span>
       <i class="${styles.arrow}"></i>
    </div>
    `)
    // 设置样式
    label.setStyle(labelStyle)
    label.id = value
    label.addEventListener('click', () => {
        this.getHouseList(value)
    })
    // 添加到地图中
    this.map.addOverlay(label)
}
async getHouseList(id) {
    let res = await axios.get('http://localhost:8080/houses?cityId=' + id)
    this.setState({
        housesList: res.data.body.list,
        isShowList: true
    })
}
//结构
{/* 房源列表 */}
{/* 添加 styles.show 展示房屋列表 */}
    <div
        className={[
            styles.houseList,
            this.state.isShowList ? styles.show : ''
        ].join(' ')}
    >
        <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
                更多房源</Link>
        </div>
        <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
        </div>
    </div>
</div>
// 渲染房屋列表的item方法
/**
 * 渲染房源列表
 */
renderHousesList() {
    return this.state.housesList.map(item => (
        <div className={styles.house}>
            <div className={styles.imgWrap}>
                <img className={styles.img} src={`http://localhost:8080${item.houseImg}`} alt="" />
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{item.title}</h3>
                <div className={styles.desc}>{item.desc}</div>
                <div>
                    {/* ['近地铁', '随时看房'] */}
                    {item.tags.map((tag, index) => {
                        const tagClass = 'tag' + (index + 1)
                        return (
                            <span
                                className={[styles.tag, styles[tagClass]].join(' ')}
                                key={tag}
                            >
                                {tag}
                            </span>
                        )
                    })}
                </div>
                <div className={styles.price}>
                    <span className={styles.priceNum}>{item.price}</span> 元/月
    </div>
            </div>
        </div>
    )
    )
}
```



- 使用地图的 panBy() 方法，移动地图到中间位置
  - 垂直位移：(window.innerHeight（屏幕高度）-330（房源列表高度）/2） - target.clientY（目标覆盖层的位置）
  - 水平位移：window.innerWidth（屏幕宽度）/2 - target.clientX
- 移动地图的时候（监听movestart事件），隐藏房源列表

![](images/地图移动.png)

### 添加Loading效果（★★★）

- 利用Toast的loading方法来实现
- 在每次请求开始的时候开启loading    Toast.loading('加载中。。。', 0, null, false)
- 在请求结束后关闭loading   Toast.hide()