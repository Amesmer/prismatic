import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import rootReducer from './reducers'

const store = createStore(rootReducer)

import { fromJS, is } from 'immutable';
import _cloneDeep from 'lodash/cloneDeep';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

const treeData = {
  tree: [
    {
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-1',
          key: '0-0-1',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
              children: [
                {
                  title: 'Child Node1',
                  value: '0-0-1',
                  key: '0-0-1',
                  children: [
                    {
                      title: 'Child Node1',
                      value: '0-0-1',
                      key: '0-0-1',
                      children: [
                        {
                          title: 'Child Node1',
                          value: '0-0-1',
                          key: '0-0-1',
                        },
                        {
                          title: 'Child Node2',
                          value: '0-0-2',
                          key: '0-0-2',
                        },
                      ],
                    },
                    {
                      title: 'Child Node2',
                      value: '0-0-2',
                      key: '0-0-2',
                    },
                  ],
                },
                {
                  title: 'Child Node2',
                  value: '0-0-2',
                  key: '0-0-2',
                },
              ],
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
              children: [
                {
                  title: 'Child Node1',
                  value: '0-0-1',
                  key: '0-0-1',
                },
                {
                  title: 'Child Node2',
                  value: '0-0-2',
                  key: '0-0-2',
                },
              ],
            },
          ],
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2',
          children: [
            {
              title: 'Child Node1',
              value: '0-0-1',
              key: '0-0-1',
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
      ],
    },
    {
      title: undefined,
      value: '0-1',
      key: '0-1',
    },
  ]
};

console.time()
var deep = _cloneDeep(treeData);
deep.tree[1].title = function() {};
console.log(deep.tree[1]);
console.log(deep === treeData, JSON.stringify(deep) === JSON.stringify(treeData));
console.timeEnd();

const immutableTreeData = fromJS(treeData);
console.time();
var deep2 = immutableTreeData.setIn(['tree', 1, 'title'], undefined);
console.log(deep2.getIn(['tree', 1]).toJS());
console.log(is(immutableTreeData, deep2));
console.timeEnd();


