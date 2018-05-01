class Lifecycle {
  constructor() {
    this.declareTemplate = '';
    this.state = {};
  }

  $onInit() {}

  $beforeMount() {}

  $afterMount() {}

  $onDestory() {}

  $watchState(oldData, newData) {}

  setState(newState) {
    if (newState && newState instanceof Function) {
      const _newState = newState();
      if (_newState && _newState instanceof Object) {
        for (var key in _newState) {
          if (this.state[key] && this.state[key] !== _newState[key]) this.state[key] = _newState[key];
        }
      }
    }
    if (newState && newState instanceof Object) {
      for (var key in newState) {
        if (this.state[key] && this.state[key] !== newState[key]) this.state[key] = newState[key];
      }
    }
  }
}
