import React, { useState } from 'react';

function usePlacement() {
  const [placement, setPlacement] = useState('top');
  
  return {
    placement,
    setPlacement,
  };
}

function Child() {
  const {placement, setPlacement} = usePlacement();
  return (
  	<select value={placement} onChange={(e) => { setPlacement(e.currentTarget.value) }}>
    	<option value="top">top</option>
      <option value="bottom">bottom</option>
      <option value="left">left</option>
      <option value="right">right</option>
    </select>
  )
}

export default Child;