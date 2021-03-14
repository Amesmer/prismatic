import React from 'react'
import { observer, inject } from 'mobx-react'
import { autorun } from 'mobx'

@inject('clickTimes')
@observer
class Counter extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    autorun(() => {
      console.log(this.props.clickTimes.count, '----')
    })
  }

  onInc = () => {
    this.props.clickTimes.inc()
  }

  onDec = () => {
    this.props.clickTimes.dec()
  }

	render() {
		return (
      <div>
        <button onClick={this.onInc}> + </button>
        <button onClick={this.onDec}> - </button>
        <p>observable Count: </p>
        <pre>
         {/* 这里显示 count */}
         {this.props.clickTimes.count}
        </pre>
        <pre>
         {this.props.clickTimes.randomCount}
        </pre>
      </div>
    )
	}
}

export default Counter
