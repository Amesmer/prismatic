import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'

import Child from './components/Child'

function App() {
  return <div><Child /></div>
}

render(
    <App />,
  document.getElementById('root')
)