  const mark = (state = false, action) => {
  switch (action.type) {
    case 'CHANGE_MARK':
      return !state
    default:
      return state
  }
}

export default mark
