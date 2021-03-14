import { observable, computed, action } from 'mobx'

class ClickTimesStore {
  @observable count = 0

  @action inc = () => {
    this.count++
  }

  @action dec = () => {
    this.count--
  }

  @computed get randomCount() {
    return this.count + '-' + Math.random()
  }
}

export default new ClickTimesStore