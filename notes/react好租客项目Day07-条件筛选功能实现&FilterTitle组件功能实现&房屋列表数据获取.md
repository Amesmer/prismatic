# 列表找房模块-条件筛选

## 目标

- 能够设置FilterPicker组件为受控组件
- 能够获取选中值，并且设置默认选中值

## 获取选中值（★★★）

- 在FilterPicker组件中，添加状态value（用于获取PickerView组件的选中值）

```react
  state = {
    value: null
  }
```

- 给PickerView组件添加配置项 onChange，通过参数获取到选中值，并更新状态 value

```react
<PickerView
  data={data}
  // 我们一旦监听了 onChange事件，同步了value值，那么这个组件成了受控组件，所以我们需要同步value的值
  value={this.state.value}
  cols={cols}
  onChange={val => {
    this.setState({ value: val });
  }}
/>
```

- 在确定按钮的事件处理程序中，讲 type 和 value 作为参数传递给父组件

```react
// Filter组件
 <FilterPicker ... type={openType}/>
 
// FilterPicker组件
{/* 底部按钮，这个type由外界进行的传递，所以我们需要通过props来进行接收 */}
<FilterFooter onCancel={onCancel} onOk={() => onSave(type,this.state.value)} />
```

## 设置默认选中值

如果是之前选中了的，当我们再次显示FilterPicker的时候，应该展示默认选中项

- 在Filter组件中，提供选中值状态： **selectedValues**

```react
// 默认选中的状态
const selectedValues = {
  area: ["area", null],
  mode: ["null"],
  price: ["null"],
  more: []
};
...
  state = {
    ...
    // 筛选默认选中的状态值
    selectedValues
  };
```

- 通过openType获取到当前类型的选中值（defaultValue），通过props传递给FilterPicker组件

```react
const {
  ...,
  selectedValues
} = this.state;
// 默认选中值
let defaultValue = selectedValues[openType];
...
<FilterPicker
  ...
  defaultValue={defaultValue}
/>
```

- 在FilterPicker组件中，将当前defaultValue设置为状态value的默认值

```react
state = {
  value: this.props.defaultValue
}
```

- 在点击确定按钮后，在父组件中更新当前type对应的selectedValues状态值

```react
// 保存，隐藏对话框
onSave = (type, value) => {
  this.setState({
    openType: '',
    selectedValues: {
      ...this.state.selectedValues,
      [type]: value
    }
  });
};
```

### 问题

- 在前面三个标签之间来回切换时候，默认选中值不会生效，当点击确定，重新打开FilterPicker组件时候，才会生效
- 分析：两种操作方式的区别在于有没有重新创建FilterPicker组件，重新创建的时候，会生效，不重新创建，不会生效
- 原因：不重新创建FilterPicker组件时，不会再次执行state初始化，也就拿不到最新的props
- 解决方式：给FilterPicker组件添加key值为openType，这样，在不同标题之间切换时候，key值都不相同，React内部会在key不同时候，重新创建该组件

# 列表找房模块-完善FilterTitle（★★★）

## 目标

- 能够说出FilterTitle高亮显示的逻辑
- 参照老师代码实现FilterTitle的高亮显示

## 思路

- 点击标题时，遍历标题高亮数据
- 如果是当前标题，直接设置为高亮
- 分别判断每个标题对应的筛选条件有没有选中值（判断每个筛选条件的选中值与默认值是否相同，相同表示没有选中值，不同，表示选中了值）
  - selectedVal 表示当前type的选中值
  - 如果type为area，此时，selectedVal.length !== 2 || selectedVal[0] !== 'area'，就表示已经有选中值
  - 如果 type 为 mode，此时，selectedVal[0] !== 'null'，就表示已经有选中值
  - 如果 type 为 price，此时，selectedVal[0] !== 'null'，就表示有选中值
- 如果有，就让该标题保持高亮
- 如果没有，就让该标题取消高亮

## 实现步骤

- 在标题点击事件 onTitleClick事件里面，获取到两个状态：标题选中状态对象和筛选条件的选中值对象

```react
 const { titleSelectedStatus, selectedValues } = this.state;
```

- 根据当前标题选中状态对象，获取到一个新的标题选中状态对象（newTitleSelectedStatus）

```react
// 创建新的标题选中状态对象
let newTitleSelectedStatus = { ...titleSelectedStatus };
```

- 使用Object.keys()，遍历标题选中状态对象

```react
Object.keys(titleSelectedStatus).forEach(key => {
     ...
});
```

- 先判断是否为当前标题，如果是，直接让该标题选中状态为true（高亮）

```react
Object.keys(titleSelectedStatus).forEach(key => {
 // key表示数组中每一项
 if (key === type) {
   // 当前标题
   newTitleSelectedStatus[type] = true;
   return;
 }
 ...
});
```

- 否则，分别判断每个标题的选中值是否与默认值相同
- 如果不同，则设置该标题的选中状态为true
- 如果相同，则设置该标题的选中状态为false

```react
Object.keys(titleSelectedStatus).forEach(key => {
    ...
	// 其他标题
	let selectedVal = selectedValues[key];
	if (
	  (key === "area" && selectedVal.length !== 2) ||
	  selectedVal[0] !== "area"
	) {
	  newTitleSelectedStatus[type] = true;
	} else if (key === "more" && selectedVal[0] !== "null") {
	  newTitleSelectedStatus[type] = true;
	} else if (key === "price" && selectedVal[0] !== "null") {
	  newTitleSelectedStatus[type] = true;
	} else if (key === "more") {
	  // 更多选择
	}else {
	  newTitleSelectedStatus[type] = false;
	}
});
```

- 更新状态 titleSelectedStatus的值为： newTitleSelectedStatus

```react
this.setState({
  titleSelectedStatus: newTitleSelectedStatus,
  openType: type
});
```

# 列表找房模块-FilterMore组件

## 目标

- 能够渲染FilterMore组件
- 能够实现 清除按钮和确定按钮 的逻辑
- 能够实现 FilterMore的默认选中

## 渲染组件数据（★★★）

- 封装renderFilterMore方法，渲染FilterMore组件

- 从filtersData中，获取数据（roomType，oriented，floor，characteristic），通过props传递给FilterMore组件

```react
renderFilterMore() {
  // 获取对应数据 roomType，oriented，floor，characteristic
  const {
    openType,
    filtersData: { roomType, oriented, floor, characteristic }
  } = this.state;
  // 把数据封装到一个对象中，方便传递
  const data = {
    roomType,
    oriented,
    floor,
    characteristic
  };
  if (openType !== "more") {
    return null;
  }
  // 传递给子组件
  return <FilterMore data={data}/>;
}
```

- FilterMore组件中，通过props获取到数据，分别将数据传递给renderFilters方法
- 正在renderFilters方法中，通过参数接收数据，遍历数据，渲染标签

```react
// 渲染标签
renderFilters(data) {
  // 高亮类名： styles.tagActive
  return data.map(item => {
    return (
      <span key={item.value} className={[styles.tag].join(" ")}>{item.label}</span>
    );
  });
}

render() {
  const {
    data: { roomType, oriented, floor, characteristic }
  } = this.props;
  return (
    <div className={styles.root}>
      ...
      <div className={styles.tags}>
        <dl className={styles.dl}>
          <dt className={styles.dt}> 户型 </dt>
          <dd className={styles.dd}> {this.renderFilters(roomType)} </dd>
          <dt className={styles.dt}> 朝向 </dt>
          <dd className={styles.dd}> {this.renderFilters(oriented)} </dd>
          <dt className={styles.dt}> 楼层 </dt>
          <dd className={styles.dd}> {this.renderFilters(floor)} </dd>
          <dt className={styles.dt}> 房屋亮点 </dt>
          <dd className={styles.dd}>
          ...
      </div>
      ...
    </div>
  );
}
```

## 获取选中值并且高亮显示（★★★）

- 在state中添加状态 selectedValues

```react
  state = {
    selectedValues: []
  };
```

- 给标签绑定单击事件，通过参数获取到当前项的value

```react
<span
  key={item.value}
  className={[styles.tag, isSelected ? styles.tagActive : ""].join(" ")}
  onClick={() => this.onTagClick(item.value)}
>
  {item.label}
</span>
```

- 判断selectedValues中是否包含当前value值
- 如果不包含，就将当前项的value添加到selectedValues数组中
- 如果包含，就从selectedValues数组中移除（使用数组的splice方法，根据索引号删除）
- 在渲染标签时，判断selectedValues数组中，是否包含当前项的value，包含，就添加高亮类

```react
onTagClick(value) {
    const { selectedValues } = this.state;
    // 创建新数组，尽量不要直接操作原数组
    const newSelectedValues = [...selectedValues];
    if (selectedValues.indexOf(value) <= -1) {
      // 不包含当前的value
      newSelectedValues.push(value);
    } else {
      // 说明包含，就需要移除
      const index = newSelectedValues.findIndex(item => item === value);
      newSelectedValues.splice(index, 1);
    }
    this.setState({
      selectedValues: newSelectedValues
    });
}
```

## 清除和确定按钮的逻辑处理（★★★）

- 设置FilterFooter组件的取消按钮文字为： 清除

```react
<FilterFooter
  className={styles.footer}
  cancelText="清除"
  onCancel={this.onCancel}
  onOk={this.onOk}
/>
```

- 点击取消按钮时，清空所有选中的项的值（selectedValues:[]）

```react
// 取消点击事件
onCancel = () => {
  this.setState({
    selectedValues: []
  });
};
```

- 点击确定按钮时，讲当前选中项的值和type，传递给Filter父组件
- 在Filter组件中的onSave方法中，接收传递过来的选中值，更新状态selectedValues

```react
// Filter 组件，传递type跟onSave
 <FilterMore data={data} type={openType} onSave={this.onSave} defaultValues={defaultValues}/>;
 
 
// 确定点击事件,通过props来获取type跟onSave方法
onOk = () => {
  const { type, onSave } = this.props;
  onSave(type, this.state.selectedValues);
};
```

## 设置默认选中值（★★★）

- 在渲染FilterMore组件时，从selectedValues中，获取到当前选中值more
- 通过props讲选中值传递给FilterMore组件
- 给遮罩层绑定事件，在事件中，调用父组件的onCancel关闭FilterMore组件

```react
// Filter组件
renderFilterMore() {
  ...
  let defaultValues = selectedValues.more
  // 传递给子组件
  return <FilterMore data={data} type={openType} onSave={this.onSave} defaultValues={defaultValues} onCancel={this.onCancel}/>;
}

// FilterMore组件
 {/* 遮罩层 */} <div className={styles.mask} onClick={this.props.onCancel}/>
```

- 在FilterMore组件中，讲获取到的选中值，设置为子组件状态selectedValues的默认值

```react
state = {
  selectedValues: this.props.defaultValues
};
```

## 完善FilterTitle高亮功能（★★）

- 在Filter组件的onTitleClick方法中，添加type为more的判断条件
- 当选中值数组长度不为0的时候，表示FilterMore组件中有选中项，此时，设置选中状态高亮
- 点击确定按钮时，根据参数type和value，判断当前菜单是否高亮

```react
// 保存，隐藏对话框
  onSave = (type, value) => {
    const { titleSelectedStatus } = this.state;
    let newTitleSelectedStatus = { ...titleSelectedStatus };
    let selectedVal = value;
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      // 更多选择
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }
    this.setState({
      openType: "",
      titleSelectedStatus: newTitleSelectedStatus,
      selectedValues: {
        ...this.state.selectedValues,
        [type]: value
      }
    });
  };
```

- 在关闭对话框时（onCancel），根据type和当前type的选中值，判断当前菜单是否高亮

```react
// 取消
  onCancel = type => {
    const { titleSelectedStatus, selectedValues } = this.state;
    let newTitleSelectedStatus = { ...titleSelectedStatus };
    let selectedVal = selectedValues[type];
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      // 更多选择
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }
    // 隐藏对话框
    this.setState({
      openType: "",
      titleSelectedStatus: newTitleSelectedStatus
    });
  };
```

# 列表找房模块-获取房屋列表数据

## 目标

- 能够封装筛选条件对象
- 能够获取到房屋列表数据
- 能够实现HouseItem组件在map页面和房屋列表页面的复用
- 能够渲染房屋列表数据在页面

## 组装筛选条件（★★★）

- 在Filter组件的onSave方法中，根据最新selectedValues组装筛选的条件数据 filters，以下是数据格式

![](images/数据格式.png)

- 获取区域数据的参数名：area 或 subway(选中值，数组的第一个元素)
- 获取区域数据值（以最后一个value为准）
- 获取方式和租金的值（选中值得第一个元素）
- 获取筛选（more）的值（讲选中值数组转换为以逗号分隔的字符串）

```react
// 组拼数据格式
let newSelectedValues = {
  ...selectedValues,
  [type]: value
};
const { area, mode, price, more } = newSelectedValues;

// 筛选条件数据
const filters = {};
// 区域
const areaKey = area[0];
let areaValue = "null";
if (area.length === 3) {
  areaValue = area[2] !== "null" ? area[2] : area[1];
}
filters[areaKey] = areaValue;
// 方式和租金
filters.mode = mode[0];
filters.price = price[0];
// more
filters.more = more.join(",");
```

## 获取房屋数据（★★★）

- 将筛选条件数据filters传递给父组件HouseList

```react
 // 保存，隐藏对话框
  onSave = (type, value) => {
    ...

    this.props.onFilter(filters)
    ...
  };
```

- HouseList组件中，创建方法onFilter，通过参数接收filters数据，并存储到this中

```react
  // 提供给Filter组件调用的函数，接受参数 filters
  onFilter = filters => {
    this.filters = filters;
    this.searchHouseList();
  };
```

- 创建方法searchHouseList（用来获取房屋列表数据）
- 根据接口，获取当前定位城市id参数
- 将筛选条件数据与分页数据合并后，作为借口的参数，发送请求，获取房屋数据

```react
 // 获取房源列表的函数
  async searchHouseList() {
    // 获取城市信息
    let { value } = JSON.parse(localStorage.getItem("localCity"));
    // 请求数据
    let res = await instance.get("/houses", {
      cityId: value,
      ...this.filters,
      start: 1,
      end: 20
    });
  }
```

## 进入页面时获取数据（★★）

- 在componentDidMount钩子函数中，调用searchHouseList，来获取房屋列表数据
- 给HouseList组件添加属性 filters，值为对象

```react
  // 初始化属性
  filters = {};
```

- 添加两个状态：list和count（存储房屋列表数据和总条数）

```react
  state = {
    list: [],
    count: 0
  };
```

- 将获取到的房屋数据，存储在state中

```react
 // 获取房源列表的函数
  async searchHouseList() {
    // 获取城市信息
    let { value } = JSON.parse(localStorage.getItem("localCity"));
    // 请求数据
    let res = await instance.get("/houses", {
      cityId: value,
      ...this.filters,
      start: 1,
      end: 20
    });
    let { list, count } = res.data.body;
    this.setState({
      list: list,
      count: count
    });
  }
```

## 使用List组件渲染数据（★★★）

- 封装HouseItem组件，实现map和HouseListuemian中，房屋列表项的复用

```react
import React from 'react'

import PropTypes from 'prop-types'

import styles from './index.module.css'

function HouseItem({ src, title, desc, tags, price, onClick }) {
  return (
    <div className={styles.house} onClick={onClick}>
      <div className={styles.imgWrap}>
        <img className={styles.img} src={src} alt="" />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.desc}>{desc}</div>
        <div>
          {/* ['近地铁', '随时看房'] */}
          {tags.map((tag, index) => {
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
          <span className={styles.priceNum}>{price}</span> 元/月
        </div>
      </div>
    </div>
  )
}

HouseItem.propTypes = {
  src: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
  tags: PropTypes.array.isRequired,
  price: PropTypes.number,
  onClick: PropTypes.func
}

export default HouseItem
```

- 使用HouseItem组件改造Map组件的房屋列表项

```react
renderHousesList() {
    return this.state.housesList.map(item => (
        <HouseItem
            key={item.houseCode}
            src={BASE_URL + item.houseImg}
            title={item.title}
            desc={item.desc}
            tags={item.tags}
            price={item.price}
        ></HouseItem>
    )
    )
}
```

- 使用react-virtualized的List组件渲染房屋列表（参考CityList组件的使用）

```react
// 渲染每一行的内容
renderHouseList = ({
  key, // Unique key within array of rows
  index, // 索引号
  style // 重点属性：一定要给每一个行数添加该样式
}) => {
  // 当前这一行的
  const { list } = this.state;
  const house = list[index];
  return (
    <HouseItem
      key={key}
      style={style}
      src={BASE_URL + house.houseImg}
      title={house.title}
      desc={house.desc}
      tags={house.tags}
      price={house.price}
    />
  );
};
render(){
    return (
      <div>
         ...
          {/* 房屋列表 */}
        <div className={styles.houseItems}>
          <List
            // 组件的宽度
            width={300}
            // 组件的高度
            height={300}
            rowCount={this.state.count} // List列表项总条目数
            // 每行的高度
            rowHeight={120} // 每一行高度
            rowRenderer={this.renderHouseList}
          />
        </div>
      </div>
    )
}
```

