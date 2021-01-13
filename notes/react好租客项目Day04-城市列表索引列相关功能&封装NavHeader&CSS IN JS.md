

# 渲染城市列表

## 目标

- 完成城市索引高亮效果
- 完成点击索引跳转到对应位置
- 能够实现切换城市功能（除了北京，上海，广州，深圳，其他成均无房源信息，需要提示用户）

## 城市索引列表高亮

- 给list组件添加onRowsRendered配置项，用于获取当前列表渲染的行信息，在里面就会有相应信息
- 通过参数 startIndex 获取到 起始行对应的索引号
- 判断 startIndex 和 activeIndex 不同时候，更新状态 activeIndex为 startIndex

```react
<List
    ...
    onRowsRendered={this.rowRendered}
/>

/**
 * 获取滚动时候,相应的数据
 * @param {*} param0 
 */
rowRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
        this.setState({
            activeIndex: startIndex
        })
    }
}
```

## 点击索引置顶该索引城市

- 给索引列表绑定点击事件
- 在点击事件中，通过index获取到当前项索引号

- 调用List组件的 scrollToRow方法，让List组件滚动到指定行
  - 在constructor中，调用React.createRef() 创建ref对象
  - 将创建好的ref对象，添加为List组件的ref属性
  - 通过ref的current属性，获取到组件实例，再调用组件的scrollToRow方法
- 设置List组件的scrollToAlignment配置项值为start，保证点击行出现在页面顶部
- 对于点击索引无法正确定位的问题，调用List组件的 measureAllRows 方法，提前计算高度来解决

```react
// 核心代码
constructor() {
    ...
    this.listComponent = React.createRef()
}
async componentDidMount() {
    await this.getCityList()
    // 计算List组件高度
    this.listComponent.current.measureAllRows()
}
renderCityIndex() {
    return this.state.cityIndex.map((item, index) => {
        return (
            <li className="city-index-item" key={item} onClick={() => {
                // 拿到List组件的实例
                this.listComponent.current.scrollToRow(index)
            }}>
              ...
            </li>
        )
    })
}
render() {
    return (
        <div className="citylist">
            ...
            {/* 城市列表 */}
            <AutoSizer>
                {
                    ({ width, height }) => {
                        return <List
                            ref={this.listComponent}
                            ...
                        />
                    }
                }
            </AutoSizer>
            ...
        </div>
    )
}
```

## 切换城市

- 给城市列表项绑定事件
- 判断当前城市是否有房源数据
- 如果有房源数据，则保持当前城市数据到本地缓存中，并返回上一页
- 如果没有房源数据，则提示用户：改城市暂无房源数据，不执行任何操作

```react
const HOST_CITY = ['北京', '上海', '广州', '深圳']
// 渲染每一行的内容
rowRenderer({
    key,         // Unique key within array of rows
    index,       // 索引号
    isScrolling, // 当前项是否正在滚动中
    isVisible,   // 当前项在List中是可见的
    style        // 重点属性：一定要给每一个行数添加该样式
}) {
    let letter = this.state.cityIndex[index]
    let citys = this.state.cityList[letter]
    return (
        <div
            key={key}
            style={style}
            className="city"
        >
            <div className="title">{this.formatCityIndex(letter)}</div>
            {citys.map(item => {
                return (
                    // 绑定点击事件，传递城市名称和value
                    <div className="name" key={item.value} onClick={() => this.changeCity(item.label, item.value)}>{item.label}</div>
                )
            })}</div>
    )
}
changeCity = (label, value) => {
    if (HOST_CITY.indexOf(label) > -1) {
        // 说明是有房源数据的城市
        localStorage.setItem('localCity', JSON.stringify({
            label,
            value
        }))
    } else {
        // 没有房源城市，提示用户
        Toast.info('当前城市没有房源', 1);
    }
}
```

# 好客租房移动Web（上）-总结

- 项目准备：部署本地接口，脚手架初始化项目，antd-mobile，路由等
- 项目整体布局：分析两种页面布局，使用嵌套路由实现带TabBar页面布局等
- 首页模块：租房小组结构布局，数据获取，H5地理定位和百度地图地理定位等
- 城市选择模块：数据结构处理，长列表性能优化，react-virtualized，索引列表等

# 好客租房移动Web（中）-目标

- 能够在百度地图中展示当前定位城市
- 能够使用地图标注完成房源信息绘制
- 能够展示城市所有区的房源数据
- 能够封装找房页面的条件筛选栏组件
- 能够使用 react-spring 组件实现动画效果
- 能够完成房屋详情页面的数据展示

# 地图找房模块

## 目标

- 封装NavHeader组件
- 实现NavHeader组件中左侧按钮功能
- 能够解决NavHeader组件中获取不到路由信息的问题

- 对NavHeader的props进行校验

## 功能分析

- 展示当前定位城市
- 展示该城市所有区的房源数据
- 展示某区下所有镇的房源数据
- 展示某镇下所有的校区的房源数据
- 展示某小区下的房源数据列表

## 顶部导航栏

### 结构实现

- 封装NavHeader组件实现城市选择，地图找房页面的复用
- 在components目录中创建组件 NavHeader/index.js
- 在该组件中封装 antd-mobile 组件库中的 NavBar组件
- 在地图找房页面使用封装好的 NavHeader组件实现顶部导航栏功能
- 使用NavHeader组件，替换城市选择页面的NavBar组件

```react
import React from 'react';
import {NavBar} from 'antd-mobile'

// components/NavHeader/index.js
export default class extends React.Component {
    render() {
        return (
            <NavBar
                    className="navbar"
                    // 模式 默认值是 dark
                    mode="light"
                    // 左侧小图片
                    icon={<i className='iconfont icon-back' />}
                    // 左侧按钮的点击事件
                    onLeftClick={() => this.props.history.go(-1)}
                // 标题内容不定的，所以我们通过外界来传入
                >{this.props.children}</NavBar>
        )
    }
}
// pages/Map/index.js
...
import NavHeader from '../../components/NavHeader'
export default class extends React.Component {
    ...
    render() {
        return (
            <div className="map">
                <NavHeader>
                    地图找房
                </NavHeader>
                <div id="container"></div>
            </div>
        )
    }
}
```

### 样式调整

- 在components下的NavHeader文件夹中创建 index.scss 文件
- 把之前城市列表写过的样式，复制到这个文件下

### 功能处理

注意：默认情况下，只有路由 Route 直接渲染的组件才能够获取到路由信息，如果需要在其他组件中获取到路由信息可以通过 withRouter 高阶组件来获取

- 从 react-router-dom 中导入 withRouter 高阶组件

- 使用  withRouter 高阶组件包装 NavHeader 组件

  - 目的：包装后，就可以在组建中获取到当前路由信息

- 从 props 中就能获取history对象

- 调用history对象的 go() 方法就能实现返回上一页功能了

- 由于头部的左侧按钮不一定是返回上一个页面的功能，所以我们需要把左侧点击逻辑处理需要通过父组件传递进来，如果说外界传递了，那么我们就直接使用外界的行为，如果没有传递，那么就用默认的行为

```react
import React from 'react';
import { NavBar } from 'antd-mobile'
import './index.scss'
import { withRouter } from 'react-router-dom'

class NavHeader extends React.Component {
    render() {
        let defaultHandler = () => {
            this.props.history.go(-1)
        }
        return (
            <NavBar
                className="navbar"
                // 模式 默认值是 dark
                mode="light"
                // 左侧小图片
                icon={<i className='iconfont icon-back' />}
                // 左侧按钮的点击事件
                onLeftClick={this.props.onLeftClick || defaultHandler}
            >{this.props.children}</NavBar>
        )
    }
}
// 通过withRouter 包装一层后，返回的还是一个组件，这个跟我们之前讲到的包装组件很类似
export default withRouter(NavHeader)
```

### 添加props校验

往往我们封装好了的组件可能会提供给别人去使用，然而别人在使用我们组件的时候不清楚需要传递怎样的props，所以我们可以通过添加props校验，来提示使用者，应该怎样正确的传递props

- 安装 yarn add prop-types
- 导入 PropTypes
- 给NavHeader组件的 children 和 onLeftClick添加props校验

```react
import PropTypes from 'prop-types'
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick:PropTypes.func
}
```

### 城市选择页面使用NavHeader组件

- 在CityList.js文件中，引入 NavHeader组件
- 把之前NavBar组件去掉，使用我们封装好的NavHeader组件就好

# 组件之间样式覆盖问题

## 目标

- 能够利用CSS Modules解决组件之间样式覆盖的问题

## 概念

- 问题：CityList组件的样式，会影响Map组件的样式
- 原因：在**配置路由**的时候，CityList组件与Map组件都会被导入到路由中，那么只要组件被导入，那么相关的样式也会被导入进来，如果两个组件的样式名称相同，那么就会影响另外一个组件的样式
- 小结：默认情况下，只要导入了组件，不管组件有没有显示在页面中，组件的样式就会生效
- 解决方式
  - 写不同的类名
  - CSS IN JS

## CSS IN JS

CSS IN JS 是使用JavaScript 编写 CSS 的统称，用来解决CSS样式冲突，覆盖等问题；

[CSS IN JS](https://github.com/MicheleBertoli/css-in-js) 的具体实现有50多种，比如：CSS Modules、styled-components等

推荐使用：CSS Modules（React脚手架已经集成进来了，可以直接使用）

## CSS Modules 

### 概念

- CSS Modules 通过对CSS类名重命名，保证每一个类名的唯一性，从而避免样式冲突问题
- 实现方式：webpack的css-loader 插件
- 命名采用：BEM（Block块、Element元素、Modifier三部分组成）命名规范。比如： .list_item_active
- 在React脚手架中演化成：文件名、类名、hash（随机）三部分，只需要指定类名即可

![](images/css-modules.png)

### 使用

- 创建名为[name].module.css 的样式文件（React脚手架中的约定，与普通CSS区分开）

![](images/css-modules使用-01.png)

- 组件中导入样式文件**（注意语法）**

![](images/css-modules使用-02.png)

- 通过styles对象访问对象中的样式名来设置样式

![](images/css-modules使用-03.png)

### 使用CSS Modules修改 NavHeader 样式

- 在NavHeader目录中创建 index.module.css 的样式文件
- 在样式文件中修改当前组件的样式
- 对于组件库中已经有的全局样式，需要使用：global() 来指定，例如：我们在修改NavBar里面文字颜色的时候，用到了一个类名叫： am-navbar-title  这个类名不是我们设置的，而是组件库中定义的，所以对于这一类，我们需要这样去设置:

![](images/css-modules使用-04.png)

**或者：**

![](images/css-modules使用-05.png)

示例demo

```css
.navbar {
    color: #333;
    background-color: #f6f5f6;
}

.navbar :global(.am-navbar-title) {
    color: #333;
}
```

## 在Map组件中修改头部样式

```css
.map {
    height: 100%;
    padding-top: 45px;
}

.map :global(.am-navbar) {
    margin-top: -45px;
}

.container {
    height: 100%;
}
```

页面结构

```react
<div className={styles.map}>
    <NavHeader>
        地图找房
    </NavHeader>
    <div id='container' className={styles.container}></div>
</div>
```

