import React from 'react'
import ReactDom from 'react-dom'
import AddNum from './addNum'

import { Provider } from 'react-redux'
import store from './store'
const app = (
    <Provider store={store}>
        <AddNum />
    </Provider>
)



ReactDom.render(
    app,
    document.getElementById('root')
)