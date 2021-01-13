# 房源发布模块

## 目标

- 如何解决JS 文本输入框防抖（用户输入过快导致请求服务器的压力过大）
- 能够完成搜索模块
- 能够获取发布房源的相关信息
- 能够知道图片上传的流程
- 能够完成图片上传功能
- 能够完成房源发布功能

## 前期准备工作

### 功能

- 获取房源的小区信息，房源图片上传，房源发布等

![](images/发布房源.png)

### 模板改动说明

- 修改首页（Index）去出租链接为： /rent/add
- 修改公共组件NoHouse的children属性校验为： node（任何可以渲染的内容）

![](images/noHouse.jpg)

- 修改公共组件HousePackage，添加onSelect的默认值

![](images/onSelect.png)

- 添加utils/city.js，封装当前定位城市 localStorage的操作

![](images/city.png)

- 创建了三个页面组件：Rent（已发布房源列表）、Rent/Add（发布房源）、Rent/Search（关键词搜索校区信息）

![](images/rent.png)

- Rent 模板代码

```react
import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import { API, BASE_URL } from '../../utils'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import NoHouse from '../../components/NoHouse'

import styles from './index.module.css'

export default class Rent extends Component {
  state = {
    // 出租房屋列表
    list: []
  }

  // 获取已发布房源的列表数据
  async getHouseList() {
    const res = await API.get('/user/houses')

    const { status, body } = res.data
    if (status === 200) {
      this.setState({
        list: body
      })
    } else {
      const { history, location } = this.props
      history.replace('/login', {
        from: location
      })
    }
  }

  componentDidMount() {
    this.getHouseList()
  }

  renderHouseItem() {
    const { list } = this.state
    const { history } = this.props

    return list.map(item => {
      return (
        <HouseItem
          key={item.houseCode}
          onClick={() => history.push(`/detail/${item.houseCode}`)}
          src={BASE_URL + item.houseImg}
          title={item.title}
          desc={item.desc}
          tags={item.tags}
          price={item.price}
        />
      )
    })
  }

  renderRentList() {
    const { list } = this.state
    const hasHouses = list.length > 0

    if (!hasHouses) {
      return (
        <NoHouse>
          您还没有房源，
          <Link to="/rent/add" className={styles.link}>
            去发布房源
          </Link>
          吧~
        </NoHouse>
      )
    }

    return <div className={styles.houses}>{this.renderHouseItem()}</div>
  }

  render() {
    const { history } = this.props

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={() => history.go(-1)}>房屋管理</NavHeader>

        {this.renderRentList()}
      </div>
    )
  }
}
```

### 三个路由规则配置

- 在App.js 中导入Rent已发布房源列表页面
- 在App.js 中导入AuthRoute组件
- 使用AuthRoute组件，配置路由规则
- 使用同样方式，配置Rent/Add 房源发布页面，Rent/Search 关键词搜索小区信息页面

```react
{/* 配置登录后，才能访问的页面 */}
<AuthRoute exact path="/rent" component={Rent} />
<AuthRoute path="/rent/add" component={RentAdd} />
<AuthRoute path="/rent/search" component={RentSearch} />
```

## 搜索模块（★★★）

### 关键词搜索小区信息

- 获取SearchBar 搜索栏组件的值
- 在搜索栏的change事件中，判断当前值是否为空
- 如果为空，直接return，不做任何处理
- 如果不为空，就根据当前输入的值以及当前城市id，获取该关键词对应的小区信息
- **问题：**搜索栏中每输入一个值，就发一次请求，这样对服务器压力比较大，用户体验不好
- **解决方式：**使用定时器来进行延迟执行（关键词：JS文本框输入 防抖）

![](images/输入框防抖.png)

#### 实现步骤

- 给SearchBar组件，添加onChange配置项，获取文本框的值

```react
<div className={styles.root}>
  {/* 搜索框 */}
  <SearchBar
    placeholder="请输入小区或地址"
    value={searchTxt}
    onChange={this.handleSearchTxt}
    showCancelButton={true}
    onCancel={() => history.go(-1)}
  />

  {/* 搜索提示列表 */}
  <ul className={styles.tips}>{this.renderTips()}</ul>
</div>
```

- 判断当前文本框的值是否为空
- 如果为空，清空列表，然后return，不再发送请求

```react
handleSearchTxt = value => {
    this.setState({ searchTxt: value })
    if (!value) {
      // 文本框的值为空
      return this.setState({
        tipsList: []
      })
    }
  }
```

- 如果不为空，使用API发送请求，获取小区数据
- 使用定时器来延迟搜索，提升性能

```react
handleSearchTxt = value => {
    this.setState({ searchTxt: value })

    if (!value) {
      // 文本框的值为空
      return this.setState({
        tipsList: []
      })
    }

    // 清除上一次的定时器
    clearTimeout(this.timerId)

    this.timerId = setTimeout(async () => {
      // 获取小区数据
      const res = await API.get('/area/community', {
        params: {
          name: value,
          id: this.cityId
        }
      })
      this.setState({
        tipsList: res.data.body
      })
    }, 500)
  }
```

### 传递校区信息给发布房源页面

- 给搜索列表项添加点击事件

```react
// 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li
        key={item.community}
        className={styles.tip}
        onClick={() => this.onTipsClick(item)}
      >
        {item.communityName}
      </li>
    ))
  }
```

- 在事件处理程序中，调用 history.replace() 方法跳转到发布房源页面
- 将被点击的校区信息作为数据一起传递过去

```react
onTipsClick = item => {
    this.props.history.replace('/rent/add', {
      name: item.communityName,
      id: item.community
    })
  }
```

- 在发布房源页面，判断history.location.state 是否为空
- 如果为空，不做任何处理
- 如果不为空，则将小区信息存储到发布房源页面的状态中

```react
 constructor(props) {
    super(props)

    // console.log(props)
    const { state } = props.location
    const community = {
      name: '',
      id: ''
    }

    if (state) {
      // 有小区信息数据，存储到状态中
      community.name = state.name
      community.id = state.id
    }
}
```

## 发布房源

### 布局结构

![](images/发布房源 -布局结构.png)

- List列表 组件
- InputItem 文本输入组件
- TextareaItem 多行输入组件
- Picker 选择器组件
- ImagePicker 图片选择器组件
- 模板结构

```react
import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal
} from 'antd-mobile'

import NavHeader from '../../../components/NavHeader'
import HousePackge from '../../../components/HousePackage'

import styles from './index.module.css'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)

    // console.log(props)
    const { state } = props.location
    const community = {
      name: '',
      id: ''
    }

    if (state) {
      // 有小区信息数据，存储到状态中
      community.name = state.name
      community.id = state.id
    }

    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community,
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }
  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
      size
    } = this.state

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={this.onCancel}>发布房源</NavHeader>

        {/* 房源信息 */}
        <List
          className={styles.header}
          renderHeader={() => '房源信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          {/* 相当于 form 表单的 input 元素 */}
          <InputItem
            placeholder="请输入租金/月"
            extra="￥/月"
            value={price}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem
            placeholder="请输入建筑面积"
            extra="㎡"
            value={size}
            onChange={val => this.getValue('size', val)}
          >
            建筑面积
          </InputItem>
          <Picker
            data={roomTypeData}
            value={[roomType]}
            cols={1}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker
            data={floorData}
            value={[floor]}
            cols={1}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker
            data={orientedData}
            value={[oriented]}
            cols={1}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        {/* 房屋标题 */}
        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
          />
        </List>

        {/* 房屋图像 */}
        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            multiple={true}
            className={styles.imgpicker}
          />
        </List>

        {/* 房屋配置 */}
        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackge select />
        </List>

        {/* 房屋描述 */}
        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            value={description}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
```

### 获取房源数据分析（★★）

- InputItem、TextareaItem、Picker组件，都使用onChange配置项，来获取当前值
- 处理方式：封装一个事件处理函数 getValue 来统一获取三种组件的值
  - 创建方法getValue作为三个组件的事件处理函数
  - 该方法接受两个参数：1. name 当前状态名；2. value 当前输入值或者选中值
  - 分别给 InputItem/TextareaItem/Picker 组件，添加onChange配置项
  - 分别调用 getValue 并传递 name 和 value 两个参数（注意：Picker组件选中值为数组，而接口需要字符串，所以，取索引号为 0 的值即可）

![](images/getValue.png)

示例代码：

```react
  /* 
    获取表单数据：
  */
  getValue = (name, value) => {
    this.setState({
      [name]: value
    })
  }
  
  // 给相应组件添加 onChange 事件，传递 name 和value
  
```

### 获取房屋配置数据（★★）

- 给HousePackge 组件， 添加 onSelect 属性
- 在onSelect 处理方法中，通过参数获取到当前选中项的值
- 根据发布房源接口的参数说明，将获取到的数组类型的选中值，转化为字符串类型
- 调用setState 更新状态

```react
/* 
  获取房屋配置数据
*/
handleSupporting = selected => {
  this.setState({
    supporting: selected.join('|')
  })
}
  
...
<HousePackge select onSelect={this.handleSupporting} />
```

### 图片上传（★★★）

#### 分析

- 根据发布房源接口，最终需要的是房屋图片的路径
- 两个步骤： 1- 获取房屋图片； 2- 上传图片获取到图片的路径
- 如何获取房屋图片？ ImagePicker图片选择器组件，通过onChange配置项来获取
- 如何上传房屋图片？ 根据图片上传接口，将图片转化为FormData数据后再上传，由接口返回图片路径

![](images/图片上传接口.png)

#### 获取房屋图片

要上传图片，首先需要先获取到房屋图片

- 给ImagePicker 组件添加 onChange 配置项
- 通过onChange 的参数，获取到上传的图片，并且存储到tempSlides中

```react
  handleHouseImg = (files, type, index) => {
    // files 图片文件的数组； type 操作类型：添加，移除（如果是移除，那么第三个参数代表就是移除的图片的索引）
    console.log(files, type, index)
    this.setState({
      tempSlides: files
    })
  }
  ...
   <ImagePicker
     files={tempSlides}
     onChange={this.handleHouseImg}
     multiple={true}
     className={styles.imgpicker}
   />
```

#### 上传房屋图片

图片已经可以通过 ImagePicker 的 onChange 事件来获取到了，接下来就需要把图片进行上传，然后获取到服务器返回的成功上传图片的路径

- 给提交按钮，绑定点击事件
- 在事件处理函数中，判断是否有房屋图片
- 如果没有，不做任何处理
- 如果有，就创建FormData的示例对象（form）
- 遍历tempSlides数组，分别将每一个图片图片对象，添加到form中（键为：file，根据接口文档获取）
- 调用图片上传接口，传递form参数，并设置请求头 Content-Type 为 multipart/form-data
- 通过接口返回值获取到图片路径

```react
// 上传图片
addHouse = async() => {
    const { tempSlides } = this.state
    let houseImg = ''

    if (tempSlides.length > 0) {
        // 已经有上传的图片了
        const form = new FormData()
        tempSlides.forEach(item => form.append('file', item.file))

        const res = await API.post('/houses/image', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        // console.log(res)
        houseImg = res.data.body.join('|')
    }
}
...
<Flex.Item className={styles.confirm} onClick={this.addHouse}>
  提交
</Flex.Item>
```

#### 发布房源

到现在，我们已经可以获取到发布房源的所有信息了，接下来就需要把数据传递给服务器

- 在 addHouse 方法中， 从state 里面获取到所有的房屋数据
- 使用API 调用发布房源接口，传递所有房屋数据
- 根据接口返回值中的状态码，判断是否发布成功
- 如果状态码是200，标示发布成功，就提示：发布成功，并跳转到已发布的房源页面
- 否则，就提示：服务器偷懒了，请稍后再试

```react
addHouse = async () => {
  const {
    tempSlides,
    title,
    description,
    oriented,
    supporting,
    price,
    roomType,
    size,
    floor,
    community
  } = this.state
  let houseImg = ''

  // 上传房屋图片：
  if (tempSlides.length > 0) {
    // 已经有上传的图片了
    const form = new FormData()
    tempSlides.forEach(item => form.append('file', item.file))

    const res = await API.post('/houses/image', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    houseImg = res.data.body.join('|')
  }

  // 发布房源
  const res = await API.post('/user/houses', {
    title,
    description,
    oriented,
    supporting,
    price,
    roomType,
    size,
    floor,
    community: community.id,
    houseImg
  })

  if (res.data.status === 200) {
    // 发布成功
    Toast.info('发布成功', 1, null, false)
    this.props.history.push('/rent')
  } else {
    Toast.info('服务器偷懒了，请稍后再试~', 2, null, false)
  }
}
```

# 项目打包

## 目标

- 能够配置生产环境的环境变量
- 能够完成简易的打包
- 知道react中如果要配置webpack的两种方式
- 知道 antd-mobile 按需加载的好处
- 知道路由代码分割的好处
- 能够参照笔记来进行 按需加载配置和代码分割配置，然后打包
- 能够知道如何解决react中跨域问题

## 简易打包（★★★）

- 打开 create-react-app 脚手架的 [打包文档说明](https://facebook.github.io/create-react-app/docs/deployment)
- 在根目录创建 .env.production 文件，配置生产环境的接口基础路径

![](images/生产环境.jpg)

- 在项目根目录中，打开终端
- 输入命令： yarn build，进行项目打包，生成build文件夹（打包好的项目内容）
- 将build目录中的文件内容，部署到都服务器中即可
- 也可以通过终端中的提示，使用 serve-s build 来本地查看（需要全局安装工具包 serve）

**如果出现以下提示，就代表打包成功，在根目录中就会生成一个build文件夹**

![](images/build命令.png)

## 脚手架的配置说明（★★★）

- create-react-app 中隐藏了 webpack的配置，隐藏在react-scripts包中

- 两种方式来修改

  - 运行命令 npm run eject 释放 webpack配置（注意：不可逆）

    如果您对构建工具和配置选择不满意，您可以`eject`随时进行。此命令将从项目中删除单个构建依赖项。

    相反，它会将所有配置文件和传递依赖项（Webpack，Babel，ESLint等）作为依赖项复制到项目中`package.json`。从技术上讲，依赖关系和开发依赖关系之间的区别对于生成静态包的前端应用程序来说是非常随意的。此外，它曾经导致某些托管平台出现问题，这些托管平台没有安装开发依赖项（因此无法在服务器上构建项目或在部署之前对其进行测试）。您可以根据需要自由重新排列依赖项`package.json`。

    除了`eject`仍然可以使用所有命令，但它们将指向复制的脚本，以便您可以调整它们。在这一点上，你是独立的。

    你不必使用`eject`。策划的功能集适用于中小型部署，您不应觉得有义务使用此功能。但是，我们知道如果您准备好它时无法自定义此工具将无用

  - 通过第三方包重写 webpack配置（比如：**[react-app-rewired](https://mobile.ant.design/docs/react/use-with-create-react-app-cn)** 等）

## antd-mobile 按需加载（★★★）

- 打开 antd-mobile 在create-react-app中的使用文档
- 安装 yarn add react-app-rewired customize-cra（用于脚手架重写配置）
- 修改package.json 中的 scripts

![](images/scripts配置.png)

- 在项目根目录创建文件： config-overrides.js(用于覆盖脚手架默认配置)

![](images/overrides.png)

- 安装 yarn add babel-plugin-import 插件（用于按需加载组件代码和样式）
- 修改 config-overrides.js 文件，配置按需加载功能

```react
const { override, fixBabelImports } = require('customize-cra');
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css',
  }),
);
```

- 重启项目（yarn start）
- 移除index.js 中导入的 antd-mobile样式文件
- 将index.css 移动到App后面，让index.css 中的页面背景生效

 打完包后，你会发现，两次打包的体积会有变化，这样达到了一个代码体积优化的层面

![](images/两次打包对比.png)

## 基于路由代码分割（★★★）

- 目的：将代码按照路由进行分割，只在访问该路由的时候才加载该组件内容，提高首屏加载速度
- 如何实现？ React.lazy() 方法 + import() 方法、Suspense组件（[React Code-Splitting文档](https://reactjs.org/docs/code-splitting.html)）
- React.lazy() 作用： 处理动态导入的组件，让其像普通组件一样使用
- import('组件路径')，作用：告诉webpack，这是一个代码分割点，进行代码分割
- Suspense组件：用来在动态组件加载完成之前，显示一些loading内容，需要包裹动态组件内容

![](images/路由分割.png)

![](images/suspense.png)

项目中代码修改：

![](images/项目代码.png)

## 其他性能优化（★★）

- React.js 优化性能[文档](https://reactjs.org/docs/docs/optimizing-performance.html)

- react-virtualized只加载用到的组件 [文档](https://github.com/bvaughn/react-virtualized#getting-started)

- 脚手架配置 解决跨域问题

  - 安装 http-proxy-middleware

    ```
    $ npm install http-proxy-middleware --save
    $ # or
    $ yarn add http-proxy-middleware
    ```

  - 创建`src/setupProxy.js`并放置以下内容

    ```react
    const proxy = require('http-proxy-middleware');
    
    module.exports = function(app) {
      app.use(proxy('/api', { target: 'http://localhost:5000/' }));
    };
    ```

  - **注意：**无需在任何位置导入此文件。它在启动开发服务器时自动注册，此文件仅支持Node的JavaScript语法。请务必仅使用支持的语言功能（即不支持Flow，ES模块等）。将路径传递给代理功能允许您在路径上使用通配和/或模式匹配，这比快速路由匹配更灵活

![](images/长列表优化.png)

# 好客租房移动Web（下）-总结

- 登录模块：使用Fomik组件实现了表单处理和表单校验、封装鉴权路由AuthRoute和axios拦截器实现登录访问控制
- 我的收藏模块：添加、取消收藏
- 发布房源模块：小区关键词搜索、图片上传、发布房源信息
- 项目打包和优化：antd-mobile组件库按需加载，基于路由的代码分割实现组件的按需加载，提高了首屏加载速度