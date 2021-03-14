import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, Popconfirm } from 'antd';
import EditableRow from '../../components/EditableRow';
import EditableCell from '../../components/EditableCell';
import { add, save, deleteItem, copy } from '../../actions'

import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'name',
        dataIndex: 'name',
        width: '30%',
        editable: true,
      },
      {
        title: 'age',
        dataIndex: 'age',
      },
      {
        title: 'address',
        dataIndex: 'address',
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) =>
          <>
            <Popconfirm title="Sure to delete?" onConfirm={() => this.props.handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
            <a style={{marginLeft: 8}} onClick={() => this.props.handleCopy(record.key)}>Copy</a>
          </>
      },
    ];
  }

  render() {
    const { dataSource, handleAdd, handleSave } = this.props;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleSave,
        }),
      };
    });
    return (
      <div>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          // dataSource={dataSource}
          dataSource={dataSource.toJS()}
          columns={columns}
        />
      </div>
    );
  }
}

const mapStateToProps = state => state

const mapDispatchToProps = dispatch => ({
  handleAdd: () => dispatch(add()),
  handleSave: (key, value) => dispatch(save(key, value)),
  handleDelete: (key) => dispatch(deleteItem(key)),
  handleCopy: (key) => dispatch(copy(key)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)