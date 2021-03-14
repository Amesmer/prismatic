// import _cloneDeep from 'lodash/cloneDeep';
import { fromJS } from 'immutable';

const initData = {
  dataSource: fromJS([
    {
      key: '0',
      name: {
        text: 'Edward King 0',
      },
      age: '32',
      address: 'London, Park Lane no. 0',
    },
    {
      key: '1',
      name: {
        text: 'Edward King 1',
      },
      age: '32',
      address: 'London, Park Lane no. 1',
    },
  ]),
  count: 2,
}

// 1. reducer 的返回值需要与 prev state 不同，否则就不会触发更新
// 2. 当 state 是引用类型，那么至少需要进行一层浅复制

// 3. 如果我们改变的数据层级比较深，那么同样需要复制，否则会导致引用类型数据的共享问题
// 4. 仅仅复制需要修改的层级会导致整个数据结构混乱

// 5. 可以采用修改之前，先整体复制，保证每一次修改的数据都是一个新的引用数据
// 6. 会带来性能问题，以及内存消耗

// 7. immutable data
const editTable = (state = initData, action) => {
  switch (action.type) {
    case 'ADD': {
      const { dataSource, count } = state;
      // const cloneDataSource = _cloneDeep(dataSource);
      const newData = fromJS({
        key: count,
        name: {
          text: `Edward King ${count}`
        },
        age: 32,
        address: `London, Park Lane no. ${count}`,
      });
      // cloneDataSource.push(newData);
      return {
        dataSource: dataSource.push(newData),
        count: count + 1,
      };
      // dataSource.push(newData)
      // return {
      //   dataSource,
      //   count,
      // }
    }
    case 'DELETE': {
      // const newData = [...state.dataSource];
      // const index = newData.findIndex(item => action.key === item.key);
      // newData.splice(index, 1);
      // return {
      //   ...state,
      //   ...{ dataSource: newData }
      // }
      const index = state.dataSource.findIndex(item => action.key === item.get('key'));
      return {
        dataSource: state.dataSource.delete(index),
        count: state.count,
      }
    }
    case 'SAVE': {
      // const newData = [...state.dataSource];
      // const index = newData.findIndex(item => action.key === item.key);
      // const item = newData[index];
      // item.name.text = action.value.name.text;
      // return {
      //   ...state,
      //   ...{ dataSource: newData }
      // }
      const index = state.dataSource.findIndex(item => action.key === item.get('key'));
      return {
        dataSource: state.dataSource.update(index, item => item.setIn(['name', 'text'], action.value.name.text)),
        count: state.count,
      }
    }
    case 'COPY': {
      // const newData = [...state.dataSource];
      // // 拿到数据
      // const index = newData.findIndex(item => action.key === item.key);
      // // 复制数据
      // const item = {...newData[index]};
      // item.name = {...newData[index].name};
      // item.key = state.count;
      // // 插入数据
      // newData.splice(index, 0, item);
      // return {
      //   dataSource: newData,
      //   count: state.count + 1,
      // }
      const index = state.dataSource.findIndex(item => action.key === item.get('key'));
      const item = state.dataSource.get(index).set('key', state.count);
      return {
        dataSource: state.dataSource.insert(index, item),
        count: state.count + 1,
      }
    }
    default:
      return state;
  }
}

export default editTable