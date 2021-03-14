import React from 'react'
import { Form } from 'antd'

import EditableContext from './context'

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

export default Form.create()(EditableRow);

