# 我的页面

## 目标

- 我的页面能够实现判断用户登录状态来显示不同的效果
- 能够实现退出登录功能

## 结构和样式

- 对应的结构样式可以直接拿过来用，我们最主要要实现里面的代码逻辑，文件在 pages/Profile/index

```react
render() {
    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img
                className={styles.avatar}
                src={avatar || DEFAULT_AVATAR}
                alt="icon"
              />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickname || '游客'}</div>
              {/* 登录后展示： */}
              {isLogin ? (
                <>
                  <div className={styles.auth}>
                    <span onClick={this.logout}>退出</span>
                  </div>
                  <div className={styles.edit}>
                    编辑个人资料
                    <span className={styles.arrow}>
                      <i className="iconfont icon-arrow" />
                    </span>
                  </div>
                </>
              ) : (
                <div className={styles.edit}>
                  <Button
                    type="primary"
                    size="small"
                    inline
                    onClick={() => history.push('/login')}
                  >
                    去登录
                  </Button>
                </div>
              )}
              {/* 未登录展示： */}
            </div>
          </div>
        </div>
        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          // 列数
          columnNum={3}
          // 不需要分割线
          hasLine={false}
          // 渲染每一项
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
              <div className={styles.menuItem}>
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            )
          }
        />
        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
```

## 功能分析

- 判断是否登录（本地缓存中是否有token信息，直接调用isAuth() 方法即可，这里在utils/auth.js文件中已经封装好了）
- 如果登录了，就发送请求获取个人资料，并且在页面中展示个人资料
- 如果没有登录，则不获取个人资料，只在页面中展示未登录信息
- 在页面中展示登录或未登录信息，就要通过state变化来体现，因此，需要一个标示是否登录的状态

![](images/我的页面功能分析.png)

## 判断用户是否登陆步骤（★★★）

- 在state中添加两个状态：isLogin（是否登录）和userInfo（用户信息）

```react
  state = {
    // 是否登录
    isLogin: isAuth(),
    // 用户信息
    userInfo: {
      avatar: '',
      nickname: ''
    }
  }
```

- 从utils中导入isAuth（登录状态）、getToken（获取token）

```react
import { BASE_URL, isAuth, getToken, API } from '../../utils'
```

- 创建方法getUserInfo，用户来获取个人资料

```react
async getUserInfo() {
    ...
}
```

- 在方法中，通过isLogin判断用户是否登录

```react
if (!this.state.isLogin) {
    // 未登录
    return
}
```

- 如果没有登录，则不发送请求，渲染未登录信息

```react
// 对用结构使用状态来判断显示登录还是未登录UI
 {/* 登录后展示： */}
{isLogin ? (
  <>
    <div className={styles.auth}>
      <span onClick={this.logout}>退出</span>
    </div>
    <div className={styles.edit}>
      编辑个人资料
      <span className={styles.arrow}>
        <i className="iconfont icon-arrow" />
      </span>
    </div>
  </>
) : (
  <div className={styles.edit}>
    <Button
      type="primary"
      size="small"
      inline
      onClick={() => history.push('/login')}
    >
      去登录
    </Button>
  </div>
)}
```

- 如果已登录，就根据接口发送请求，获取用户个人资料
- 渲染个人资料数据

```react
async getUserInfo() {
  if (!this.state.isLogin) {
    // 未登录
    return
  }

  // 发送请求，获取个人资料
  const res = await API.get('/user', {
    headers: {
      authorization: getToken()
    }
  })

  if (res.data.status === 200) {
    // 请求成功
    const { avatar, nickname } = res.data.body
    this.setState({
      userInfo: {
        avatar: BASE_URL + avatar,
        nickname
      }
    })
  }
}


// render方法中 
render(){
    const { history } = this.props

    const {
      isLogin,
      userInfo: { avatar, nickname }
    } = this.state
    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img
                className={styles.avatar}
                src={avatar || DEFAULT_AVATAR}
                alt="icon"
              />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickname || '游客'}</div>
              ...
}
```

## 退出功能（★★★）

- 点击退出按钮，弹出对话框，提示是否确定退出
- 给退出按钮绑定点击事件，创建方法logout作为事件处理函数
- 导入Modal对话框组件（弹出模态框）

```react
import {..., Modal } from 'antd-mobile'
```

- 在方法中，拷贝Modal组件文件高中确认对话框的示例代码

```react
const alert = Modal.alert
alert('Delete', 'Are you sure?', [
      { text: 'Cancel',onPress: () => console.log('cancel) },
      { text: 'Ok', onPress: () => console.log('ok')}
])
```

- 修改对话框的文字提示

```react
alert('提示', '是否确定退出?', [
      { text: '取消'},
      { text: '退出', onPress: () => console.log('ok')}
])
```

- 在退出按钮的事件处理程序中，先调用退出接口（让服务器端退出），再移除本地token（本地退出）
- 把登录状态isLogin设置为false
- 清空用户状态对象

```react
{
  text: '退出',
  onPress: async () => {
    // 调用退出接口
    await API.post('/user/logout', null, {
      headers: {
        authorization: getToken()
      }
    })

    // 移除本地token
    removeToken()

    // 处理状态
    this.setState({
      isLogin: false,
      userInfo: {
        avatar: '',
        nickname: ''
      }
    })
  }
}
```

# 登录访问控制

## 目标

- 理解访问控制中的两种功能和两种页面
- 能够说出处理两种功能用什么方式来实现
- 能够写出 axios请求拦截器与响应拦截器，并且能够说出这两种拦截器分别在什么时候触发，有什么作用
- 能够说出处理两种页面用什么方式来实现
- 能够说出AuthRoute 鉴权路由组件实现思路
- 能够参照官网自己封装AuthRoute 鉴权路由组件
- 能够实现修改登录成功后的跳转

## 概述

项目中的两种类型的功能和两种类型的页面：

两种功能：

- 登录后才能进行操作（比如：获取个人资料）
- 不需要登录就可以操作（比如：获取房屋列表）

两种页面：

- 需要登录才能访问（比如：发布房源页）
- 不需要登录即可访问（比如：首页）

对于需要登录才能操作的功能使用 **axios 拦截器** 进行处理（比如：统一添加请求头 authorization等）

对于需要登录才能访问的页面使用 **路由控制**

## 功能处理-使用axios拦截器统一处理token（★★★）

- 在api.js 中，添加请求拦截器  (API.interceptors.request.user())
- 获取到当前请求的接口路径（url）
- 判断接口路径，是否是以/user 开头，并且不是登录或注册接口（只给需要的接口添加请求头）
- 如果是，就添加请求头Authorization

```react
// 添加请求拦截器
API.interceptors.request.use(config => {
  const { url } = config
  // 判断请求url路径
  if (
    url.startsWith('/user') &&
    !url.startsWith('/user/login') &&
    !url.startsWith('/user/registered')
  ) {
    // 添加请求头
    config.headers.Authorization = getToken()
  }
  return config
})
```

- 添加响应拦截器 (API.interceptors.response.use())
- 判断返回值中的状态码
- 如果是400，标示token超时或异常，直接移除token

```react
// 添加响应拦截器
API.interceptors.response.use(response => {
  const { status } = response.data
  if (status === 400) {
    // 此时，说明 token 失效，直接移除 token 即可
    removeToken()
  }
  return response
})
```

## 页面处理-AuthRoute鉴权路由组件（★★★）

### 实现原理

- 限制某个页面只能在登陆的情况下访问，但是在React路由中并没有直接提供该组件，需要手动封装，来实现登陆访问控制（类似与Vue路由的导航守卫）

- 参数 react-router-dom的[鉴权文档](https://reacttraining.com/react-router/web/wxample/auth-workflow)

- AuthRoute 组件实际上就是对原来Route组件做了一次包装，来实现一些额外的功能

  - 使用

  ![](images/使用.png)

- render方法：render props模式，指定该路由要渲染的组件内容

- Redirect组件：重定向组件，通过to属性，指定要跳转的路由信息

```react
// 官网封装的核心逻辑代码
// ...rest  把之前的组件中传递的属性原封不动传递过来
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      // render方法： render props模式，指定该路由要渲染的组件内容
      render={props =>
        // 判断是否登陆，如果登陆，跳转配置的component，如果没有登陆，利用 Redirect组件来进行重定向
        fakeAuth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              // 把当前的页面路径保存起来，方便用户登录后能够跳回当前页面
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}
```

### 封装AuthRoute鉴权路由组件

- 在components目录中创建AuthRoute/index.js 文件
- 创建组件AuthRoute并导出
- 在AuthRoute组件中返回Route组件（在Route基础上做了一层包装，用于实现自定义功能）
- 给Route组件，添加render方法，指定改组件要渲染的内容（类似与component属性）
- 在render方法中，调用isAuth() 判断是否登陆
- 如果登陆了，就渲染当前组件（通过参数component获取到要渲染的组件，需要重命名）
- 如果没有登陆，就重定向到登陆页面，并且指定登陆成功后腰跳转的页面路径
- 将AuthRoute组件接收到的props原样传递给Route组件（保证与Route组件使用方式相同）
- 使用AuthRoute组件配置路由规则，验证是否实现页面的登陆访问控制

```react
const AuthRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        const isLogin = isAuth()

        if (isLogin) {
          // 已登录
          // 将 props 传递给组件，组件中才能获取到路由相关信息
          return <Component {...props} />
        } else {
          // 未登录
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location
                }
              }}
            />
          )
        }
      }}
    />
  )
}
export default AuthRoute
```

### 修改登录成功跳转

- 登陆成功后，判断是否需要跳转到用户想要访问的页面（判断props.location.state 是否有值）
- 如果不需要，则直接调用history.go(-1) 返回上一页
- 如果需要，就跳转到from.pathname 指定的页面（推荐使用replace方法模式，不是push）

```react
 // 表单的提交事件
  handleSubmit: async (values, { props }) => {
    ...
    if (status === 200) {
      // 登录成功
      localStorage.setItem('hkzf_token', body.token)

      /* 
        1 登录成功后，判断是否需要跳转到用户想要访问的页面（判断 props.location.state 是否有值）。
        2 如果不需要（没有值），则直接调用 history.go(-1) 返回上一页。
        3 如果需要，就跳转到 from.pathname 指定的页面（推荐使用 replace 方法模式，而不是 push）。
      */
      if (!props.location.state) {
        // 此时，表示是直接进入到了该页面，直接调用 go(-1) 即可
        props.history.go(-1)
      } else {
        // replace: [home, map]
        props.history.replace(props.location.state.from.pathname)
      }
    } else {
      // 登录失败
      Toast.info(description, 2, null, false)
    }
  }
```

# 我的收藏模块

## 目标

- 能够实现检测房源是否收藏
- 能够实现收藏房源功能

## 功能分析

- 收藏房源
- 功能：
  - 检查房源是否收藏
  - 收藏房源

## 检查房源是否收藏（★★）

- 在state中添加状态，isFavorite（表示是否收藏），默认值是false

```react
state= {
    // 表示房源是否收藏
    isFavorite: false
}
```

- 创建方法 checkFavorite，在进入房源详情页面时调用该方法
- 先调用isAuth方法，来判断是否登陆
- 如果未登录，直接return，不再检查是否收藏
- 如果已登陆，从路由参数中，获取当前房屋id
- 使用API调用接口，查询该房源是否收藏
- 如果返回状态码为200，就更新isFavorite；否则，不做任何处理

```react
async checkFavorite() {
    const isLogin = isAuth()

    if (!isLogin) {
      // 没有登录
      return
    }

    // 已登录
    const { id } = this.props.match.params
    const res = await API.get(`/user/favorites/${id}`)

    const { status, body } = res.data
    if (status === 200) {
      // 表示请求已经成功，需要更新 isFavorite 的值
      this.setState({
        isFavorite: body.isFavorite
      })
    }
  }
```

- 在页面结构中，通过状态isFavorite修改收藏按钮的文字和图片内容

```react
{/* 底部收藏按钮 */}
<Flex className={styles.fixedBottom}>
  <Flex.Item>
    <img
      src={
        BASE_URL + (isFavorite ? '/img/star.png' : '/img/unstar.png')
      }
      className={styles.favoriteImg}
      alt="收藏"
    />
    <span className={styles.favorite}>
      {isFavorite ? '已收藏' : '收藏'}
    </span>
  </Flex.Item>
  <Flex.Item>在线咨询</Flex.Item>
  <Flex.Item>
    <a href="tel:400-618-4000" className={styles.telephone}>
      电话预约
    </a>
  </Flex.Item>
</Flex>
```

## 收藏房源（★★★）

- 给收藏按钮绑定点击事件，创建方法handleFavorite作为事件处理程序

```react
handleFavorite = async () => {
    ...
}
```

- 调用isAuth方法，判断是否登陆
- 如果未登录，则使用Modal.alert 提示用户是否去登陆
- 如果点击取消，则不做任何操作
- 如果点击去登陆，就跳转到登陆页面，同时传递state(登陆后，再回到房源收藏页面)

```react
const isLogin = isAuth()
const { history, location, match } = this.props

if (!isLogin) {
  // 未登录
  return alert('提示', '登录后才能收藏房源，是否去登录?', [
    { text: '取消' },
    {
      text: '去登录',
      onPress: () => history.push('/login', { from: location })
    }
  ])
}
```

- 根据isFavorite判断，当前房源是否收藏
- 如果未收藏，就调用添加收藏接口，添加收藏
- 如果收藏了，就调用删除接口，删除收藏

```react
if (isFavorite) {
  // 已收藏，应该删除收藏
  const res = await API.delete(`/user/favorites/${id}`)
  // console.log(res)
  this.setState({
    isFavorite: false
  })

  if (res.data.status === 200) {
    // 提示用户取消收藏
    Toast.info('已取消收藏', 1, null, false)
  } else {
    // token 超时
    Toast.info('登录超时，请重新登录', 2, null, false)
  }
} else {
  // 未收藏，应该添加收藏
  const res = await API.post(`/user/favorites/${id}`)
  // console.log(res)
  if (res.data.status === 200) {
    // 提示用户收藏成功
    Toast.info('已收藏', 1, null, false)
    this.setState({
      isFavorite: true
    })
  } else {
    // token 超时
    Toast.info('登录超时，请重新登录', 2, null, false)
  }
}
```

- 完整逻辑代码

```react
handleFavorite = async () => {
    const isLogin = isAuth()
    const { history, location, match } = this.props

    if (!isLogin) {
      // 未登录
      return alert('提示', '登录后才能收藏房源，是否去登录?', [
        { text: '取消' },
        {
          text: '去登录',
          onPress: () => history.push('/login', { from: location })
        }
      ])
    }

    // 已登录
    const { isFavorite } = this.state
    const { id } = match.params

    if (isFavorite) {
      // 已收藏，应该删除收藏
      const res = await API.delete(`/user/favorites/${id}`)
      // console.log(res)
      this.setState({
        isFavorite: false
      })

      if (res.data.status === 200) {
        // 提示用户取消收藏
        Toast.info('已取消收藏', 1, null, false)
      } else {
        // token 超时
        Toast.info('登录超时，请重新登录', 2, null, false)
      }
    } else {
      // 未收藏，应该添加收藏
      const res = await API.post(`/user/favorites/${id}`)
      // console.log(res)
      if (res.data.status === 200) {
        // 提示用户收藏成功
        Toast.info('已收藏', 1, null, false)
        this.setState({
          isFavorite: true
        })
      } else {
        // token 超时
        Toast.info('登录超时，请重新登录', 2, null, false)
      }
    }
  }
```

