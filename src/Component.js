class Component {
  constructor() {
    this.template = '';
    this.state = {};
  }

  $beforeInit() {
    console.log('is $beforeInit');
    this.watcher = new Watcher(this.state, this.$watchState);
  }

  $watchState(oldData, newData) {
    console.log('oldData:', oldData);
    console.log('newData:', newData);
  }

  $onInit() {
    this.console.innerText = 'is $onInit';
    console.log('is $onInit');
  }

  $beforeMount() {
    this.console.innerText = 'is $beforeMount';
    console.log('is $beforeMount');
  }

  $afterMount() {
    this.console.innerText = 'is $afterMount';
    console.log('is $afterMount');
  }

  $onDestory() {
    this.console.innerText = 'is $onDestory';
    console.log('is $onDestory');
  }

  setState(newState) {
    if (newState && newState instanceof Function) {
      const _newState = newState();
      if (_newState && _newState instanceof Object) {
        for (var key in _newState) {
          if (this.state[key] && this.state[key] !== _newState[key]) {
            this.state[key] = _newState[key];
          }
        }
      }
    }
    if (newState && newState instanceof Object) {
      for (var key in newState) {
        if (this.state[key] && this.state[key] !== newState[key]) {
          this.state[key] = newState[key];
        }
      }
    }
  }
}
