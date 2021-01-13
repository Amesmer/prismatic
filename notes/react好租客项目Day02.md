

# 首页模块

## 目标

- 能够使用Carousel组件完成轮播图功能
- 能够安装axios，并且使用axios进行网络请求
- 能够使用Flex组件完成TabBar功能
- 能够知道轮播图与TabBar出现的bug，并且解决
- 能够安装Sass，编写Sass代码
- 能够使用Grid组件完成租房小组功能
- 能够利用H5 API获取当前的定位信息
- 能够使用百度地图API展示地图页面，获取对应城市信息

## 轮播图（★★★）

### 组件使用的基本步骤

- 打开antd-mobile组件库的Carousel组件文档
- 选择基本，点击 (`</>`) 显示源码
- 拷贝核心代码到Index的组件中
- 分析并且调整代码，让其能够在项目中运行

### 轮播图的移植

- 拷贝示例代码中的内容

  - 导入组件

  ```react
  import { Carousel, WingBlank } from 'antd-mobile';
  ```

  - 状态

  ```react
      state = {
          // 图片的名称
          data: ['1', '2', '3'],
          // 图片的高度
          imgHeight: 176,
      }
  ```

  - 声明周期钩子函数，修改状态，设置数据

  ```react
  componentDidMount() {
      // simulate img loading
      setTimeout(() => {
          this.setState({
              data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
          });
      }, 100);
  }
  ```

  - 结构

  ```react
  <div className="index">
      <Carousel
          {/* 自动播放 */}
          autoplay={false}
          {/* 无限循环 */}
          infinite
          {/* 轮播图切换前的回调函数 */}
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          {/* 轮播图切换后的回调函数 */}
          afterChange={index => console.log('slide to', index)}
          {/* 自动切换的时间 */}
          autoplayInterval='2000'
      >    
          {/* 遍历状态里面的数据，创建对应的a标签和img图片标签 */}
          {this.state.data.map(val => (
              <a
                  key={val}
                  href="http://www.alipay.com"
                  style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
              >
                  <img
                      src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                      alt=""
                      style={{ width: '100%', verticalAlign: 'top' }}
                      {/* 图片加载完成的时候调用 */}
                      onLoad={() => {
                          // fire window resize event to change height
                          window.dispatchEvent(new Event('resize'));
                          this.setState({ imgHeight: 'auto' });
                      }}
                  />
              </a>
          ))}
      </Carousel>
  </div>
  ```

- 现在我们需要对轮播图进行定制

  - 先优化相应的结构，删除不必要的代码

  ```react
  <div className="index">
      <Carousel
          autoplay={true}
          infinite
          autoplayInterval='2000'
      >
          {this.state.data.map(val => (
              <a
                  key={val}
                  href="http://www.alipay.com"
                  style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
              >
                  <img
                      src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                      alt=""
                      style={{ width: '100%', verticalAlign: 'top' }}
                  />
              </a>
          ))}
      </Carousel>
  </div>
  ```

### 获取轮播图的数据

- 安装 axios： yarn add axios
- 在Index组件中导入axios

```react
import axios from 'axios'
```

- 在state中添加轮播图数据：swipers

```react
state = {
    // 轮播图状态
    swipers: [],
}
```

- 新建一个方法 getSwipers 用来获取轮播图数据

```react
async getSwipers() {
    // 请求数据
    let {data: res} = await axios.get('http://localhost:8080/home/swiper')
    // 判断返回的状态是否是成功
    if(res.status!= 200){
        console.error(res.description)
        return
    }
    // 把获取到的值设置给state
    this.setState({
        swipers: res.body
    })

}
```

- 在componentDidMount钩子函数中调用这个方法

```react
componentDidMount() {
    // 调用请求轮播图的方法
   this.getSwipers()
}
```

- 使用获取到的数据渲染轮播图

```react
// 渲染轮播图的逻辑代码
renderSwipers(){
    return this.state.swipers.map(item => (
        <a
            key={item.id}
            href="http://www.itcast.cn"
            style={{ display: 'inline-block', width: '100%', height: 212 }}
        >
            <img
                src={`http://localhost:8080${item.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
            />
        </a>
    ))
}
render() {
    return (
        <div className="index">
            <Carousel
                autoplay={true}
                infinite
                autoplayInterval='2000'
            >
                {/* 调用渲染轮播图的方法 */}
                {this.renderSwipers()}
            </Carousel>
        </div>
    )
}
```

## 导航菜单（★★★）

- 利用了antd-moblie的Flex组件进行的布局
- 导入nav的图片

```react
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
```

- 编写页面页面

```react
<Flex className="nav">
    <Flex.Item>
        <img src={nav1} alt=""/>
        <h2>整租</h2>
    </Flex.Item>
    <Flex.Item>
        <img src={nav2} alt=""/>
        <h2>合租</h2>
    </Flex.Item>
    <Flex.Item>
        <img src={nav3} alt=""/>
        <h2>地图找房</h2>
    </Flex.Item>
    <Flex.Item>
        <img src={nav4} alt=""/>
        <h2>去出租</h2>
    </Flex.Item>
</Flex>
```

- 给Flex 组件添加了类名是为了去更改相应的样式

```css
.nav {
    padding: 10px 0;
}

.nav img {
    width: 48px;
}

.nav h2 {
    font-size: 13px;
    font-weight: 400;
}
/* 通过调试工具我们看到，后续被生成的这个父元素的类名叫am-flexbox-item */
.am-flexbox-item {
    text-align: center;
}

h2 {
    margin: 0;
    margin-top: 7px;
}
```

### 导航菜单的重构

- 把内容封装成数组

```react
// 导航菜单的数据
const navs = [{
    id: 0,
    img: nav1,
    title: '整租',
    path: '/home/list'
}, {
    id: 1,
    img: nav2,
    title: '合租',
    path: '/home/list'
}, {
    id: 2,
    img: nav3,
    title: '地图找房',
    path: '/home/map'
}, {
    id: 3,
    img: nav4,
    title: '去出租',
    path: '/home/list'
}]
```

- 创建对应的方法 renderNavs,在方法中遍历navs，一个一个设置数据，把最终的JSX返回

```react
// 渲染导航菜单的逻辑代码
renderNavs() {
    return navs.map(item => {
        return (
            <Flex.Item key={item.id} onClick={()=>{this.props.history.push(item.path)}}>
                <img src={item.img} alt="" />
                <h2>{item.title}</h2>
            </Flex.Item>
        )
    })
}
```

- 在render方法中调用这个函数

```react
{/* 导航栏 */}
<Flex className="nav">
    {this.renderNavs()}
</Flex>
```

## 轮播图的问题（★★★）

- 由于我们动态加载数据，导致了轮播图不能自动去进行轮播以及高度的塌陷

- 解决办法

  - 在state中添加轮播图数据是否加载完成的状态

  ```react
      state = {
          // 轮播图状态
          swipers: [],
          isSwiperLoaded: false
      }
  ```

  - 在轮播图数据加载完成时候，修改这个状态为true

  ```react
      async getSwipers() {
          ...
          // 把获取到的值设置给state
          this.setState({
              swipers: res.body,
              isSwiperLoaded: true
          })
  
      }
  ```

  - 只有在录播图数据加载完成的情况下，才渲染轮播图组件

  - 给轮播图的外层包裹一个div，给这个div设置高度

  ```react
  <div className="swiper">
      {/* 轮播图 */}
      {this.state.isSwiperLoaded ? (<Carousel
          autoplay={true}
          infinite
          autoplayInterval='2000'
      >
          {/* 调用渲染轮播图的方法 */}
          {this.renderSwipers()}
      </Carousel>) : ('')}
  </div>
  ```


## TabBar的问题（★★★）

- 当我们通过首页菜单导航跳转到相应页面的时候，底部的TabBar没有进行高亮显示
- 原因： 我们实现该功能的时候，只考虑了点击以及第一次家的Home组件的情况下，但是，我们没有考虑不重新加载Home组件时路由的切换
- 解决：在路由发生切换的时候，再来处理TabBar的高亮显示
  - 添加componentDidUpDate 钩子函数
  - 在钩子函数中判断路由地址是否切换
  - 在路由地址切换的时候，让TabBar对应高亮
- 在Home.js里面注册钩子函数

```react
    // 当Home组件的内容发生更新的时候调用

    componentDidUpdate(prevProps) {

        // 在这里就能判断路由是否进行了切换，路由的信息保存在props属性里面

        // 如果当前的路由信息不等于上一次的，那么就代表发生了路由切换

        if(prevProps.location.pathname !== this.props.location.pathname){

            this.setState({

                selectedTab: this.props.location.pathname

            })

        }
    }
```

## Sass的使用

- 打开[脚手架文档](https://facebook.github.io/create-react-app/docs/getting-started)，找到添加Sass样式
- 安装Sass： yarn add node-sass
- 创建后缀名为.scss 或者 .sass 的样式文件
- 在组件中导入Sass样式

## 租房小组（★★★）

### 业务介绍

- 需求：根据当前地理位置展示不同小组信息
- 需要后台接口根据用户找房数据，推荐用户最感兴趣的内容(正常的逻辑是我们先获取到用户当前定位的信息，把信息发送给后台，后台根据定位信息获取对应的内容)
- 前端只需要展示数据

### 数据获取

- 在state中添加租房小组数据：groups

```react
    state = {
        ...
        // 租房小组状态
        groups: []
    }
```

- 新建一个方法`getGroups`用来获取数据，并更新groups状态

```react
async getGroups() {
    let { data: res } = await axios.get('http://localhost:8080/home/groups', {
        params: {
            'area': 'AREA%7C88cff55c-aaa4-e2e0'
        }
    })
    // 判断返回的状态是否是成功
    if (res.status != 200) {
        console.error(res.description)
        return
    }
    // 把获取到的值设置给state
    this.setState({
        groups: res.body
    })
}
```

- 在`componentDidMount`钩子函数中调用该方法

```react
componentDidMount() {
    // 调用请求轮播图的方法
    this.getSwipers()
    this.getGroups()
}
```

- 使用获取到的数据渲染租房小组数据

### 页面结构样式

- 实现标题的结构和样式
- 打开Grid 宫格组件 
- 选择 基本 菜单，点击(`</>`) 显示源码
- 拷贝核心代码到Index组件中
- 分析调整代码

布局结构

```react
 {/* 租房小组 */}
<div className="group">
    <h3 className="group-title">
        租房小组 <span className="more">更多</span>
    </h3>
    <Grid data={this.state.groups}
        {/* 列数 */}
        columnNum={2} 
        {/* 是否强制正方形 */}
        square={false}
        {/* 是否有边框 */}
        hasLine={false}
        {/* 自定义里面的布局 */}
        renderItem={item => this.renderGroups(item)} />
</div>
```

自定布局单独抽取成方法

```react
renderGroups(item) {
    return (
        <Flex className="group-item" justify="around">
            <div className="desc">
                <p className="title">{item.title}</p>
                <span className="info">{item.desc}</span>
            </div>
            <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
        </Flex>
    )
}
```

相应的样式属性

```less
.group {
    background-color: #f6f5f6;
    overflow: hidden;
    padding: 0 10px;
    .group-title {
        position: relative;
        margin: 15px 0px 15px 10px;
        font-size: 15px;
        .more {
            color: #787d82;
            position: absolute;
            right: 0;
            font-size: 14px;
            font-weight: normal;
        }
    }
    // 覆盖默认背景色
    .am-grid .am-flexbox {
        background-color: inherit;
        .am-flexbox-item .am-grid-item-content {
            padding: 0;
            padding-bottom: 10px;
        }
    }
    .group-item {
        height: 75px;
        .desc {
            .title {
                font-weight: bold;
                font-size: 13px;
                margin-bottom: 5px;
            }
            .info {
                font-size: 12px;
                color: #999;
            }
        }
        img {
            width: 55px;
        }
    }
    .am-flexbox-align-stretch {
        margin-bottom: 10px;
        .am-grid-item {
            background-color: #fff;
            &:first-child {
                margin-right: 10px;
            }
        }
    }
}
```

## 最新资讯

### 数据获取&页面渲染

- 在state中添加租房小组数据：news

```react
    state = {
        ...
        // 最新资讯
        news: []
    }
```

- 创建一个函数 `getNews()`, 在这个函数中利用`axios`来请求服务器
- 获取到的数据判断返回的状态是否是200，如果不是，提示用户
- 如果状态是200，利用`this.setState()` 来更新页面
- 在`componentDidUpdate`钩子函数中调用 `getNews()` 

```react
async getNews() {
    let { data: res } = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    // 判断返回的状态是否是成功
    if (res.status != 200) {
        console.error(res.description)
        return
    }
    // 把获取到的值设置给state
    this.setState({
        news: res.body
    })
}
```

- 创建页面结构，渲染到页面
  - `WingBlank`组件 两翼留白 的效果
  - 渲染的逻辑代码比较多，抽取成一个方法，这样保证结构中的代码比较清晰

```react
 {/* 最新资讯 */}
<div className="news">
    <h3 className="group-title">最新资讯</h3>
    <WingBlank size="md">{this.renderNews()}</WingBlank>
</div>

renderNews() {
 return this.state.news.map(item => {
     return (
         <div className="news-item" key={item.id}>
             <div className="imgwrap">
                 <img
                     className="img"
                     src={`http://localhost:8080${item.imgSrc}`}
                     alt=""
                 />
             </div>
             <Flex className="content" direction="column" justify="between">
                 <h3 className="title">{item.title}</h3>
                 <Flex className="info" justify="between">
                     <span>{item.from}</span>
                     <span>{item.date}</span>
                 </Flex>
             </Flex>
         </div>
     )
 })
```

- 样式属性

```less
// 最新资讯：
.news {
  padding: 10px;
  background-color: #fff;
  overflow: hidden;

  .group-title {
    margin: 10px 0 5px 10px;
    font-size: 15px;
  }

  .news-item {
    height: 120px;
    padding: 15px 10px 15px 0;
    border-bottom: 1px solid #e5e5e5;
  }

  .news-item:last-child {
    border: 0;
  }

  .imgwrap {
    float: left;
    height: 90px;
    width: 120px;
  }

  .img {
    height: 90px;
    width: 120px;
  }

  .content {
    overflow: hidden;
    height: 100%;
    padding-left: 12px;
  }

  .title {
    margin-bottom: 15px;
    font-size: 14px;
  }

  .info {
    width: 100%;
    color: #9c9fa1;
    font-size: 12px;
  }

  .message-title {
    margin-bottom: 48px;
  }
}
```

### 解决内容被`TabBar`压住的问题

我们在Home.js中找到 包裹 路由和底部导航栏的div盒子，给其添加 padding-bottom 属性即可

## 顶部导航功能（★★★）

- 实现结构和样式
- 添加城市选择、搜索、地图找房页面的路由跳转

相关结构

```react
 <Flex className='search-box'>
    {/* 左侧白色区域 */}
    <Flex className="search">
        {/* 位置 */}
        <div className="location" >
            <span className="name">长沙</span>
            <i className="iconfont icon-arrow" />
        </div>

        {/* 搜索表单 */}
        <div className="form">
            <i className="iconfont icon-seach" />
            <span className="text">请输入小区或地址</span>
        </div>
    </Flex>
    {/* 右侧地图图标 */}
    <i className="iconfont icon-map" />
</Flex>
```

相关样式

```less
// 顶部导航
.search-box {
    position: absolute;
    top: 25px;
    width: 100%;
    padding: 0 10px;
    // 左侧白色区域
    .search {
        flex: 1;
        height: 34px;
        margin: 0 10px;
        padding: 5px 5px 5px 8px;
        border-radius: 3px;
        background-color: #fff;
        // 位置
        .location {
            .icon-arrow {
                margin-left: 2px;
                font-size: 12px;
                color: #7f7f80;
            }
        }
        // 搜索表单
        .form {
            border-left: solid 1px #e5e5e5;
            margin-left: 12px;
            line-height: 16px;
            .icon-seach {
                vertical-align: middle;
                padding: 0 2px 0 12px;
                color: #9c9fa1;
                font-size: 15px;
            }
            .text {
                padding-left: 4px;
                font-size: 13px;
                color: #9c9fa1;
            }
        }
    }
    // 右侧地图图标
    .icon-map {
        font-size: 25px;
        color: #fff;
    }
}
```

### H5中利用定理定位API

地理位置API 允许用户向 Web应用程序提供他们的位置，出于隐私考虑，报告地理位置前先会请求用户许可

地理位置的API是通过 `navigator.geolocation` 对象提供，通过`getCurrentPosition`方法获取

获取到的地理位置跟 GPS、IP地址、WIFI和蓝牙的MAC地址、GSM/CDMS的ID有关

比如：手机优先使用GPS定位，笔记本等最准确的是定位是WIFI

我们所获取到的是经纬度，其实对我们来说是没有用的，所以我们需要借助百度地图、高德地图等的开放接口，来帮我们把经纬度进行换算

![](images/location.png)

# 定位相关

## 百度地图API（★★★）

- H5的地理位置API只能获取到对应经纬度信息
- 实际开发中，会使用百度地图/高德地图来完成地理位置的相关功能
- 租房项目中，通过百度地图API实现地理位置和地图找房功能
- 我们需要去参照[百度地图文档](http://lbsyun.baidu.com/)
- 注册百度开发者账号，申请对应的AK

![](images/百度AK.png)

### 使用步骤

- 引入百度地图的API的JS文件，替换自己申请好的密钥

![](images/使用步骤-01.png)

- 在index.css中设置全局样式

![](images/使用步骤-02.png)

- 创建Map组件，配置路由，在Map组件中，创建地图容器元素，并设置样式 

![](images/使用步骤-03.png)

- 创建地图实例

![](images/使用步骤-04.png)

- 设置中心点坐标

![](images/使用步骤-05.png)

- 初始化地图，同时设置展示级别

![](images/使用步骤-06.png)



## 获取顶部导航城市信息

- 查看百度地图的定位文档
- 通过IP定位获取到当前城市名称
- 调用我们服务器的接口，换取项目中的城市信息

![](images/定位接口.png)

