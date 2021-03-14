
export const add = () => ({
  type: 'ADD',
})

export const save = (key, value) => ({
  type: 'SAVE',
  key,
  value,
})

export const deleteItem = (key) => ({
  type: 'DELETE',
  key,
})

export const copy = (key) => ({
  type: 'COPY',
  key,
})


