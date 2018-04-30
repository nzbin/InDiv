class Controller {
  constructor() {
    this.declareTemplate = '';
    this.state = {};
    this.declareComponents = {};
  }

  $renderComponent() {
    let variableReg = /\{\{(.*?)\}\}/g;
    for (let key in this.declareComponents) {
      if (this.declareComponents[key].$beforeInit) this.declareComponents[key].$beforeInit();
      const declareTemplate = this.declareComponents[key].declareTemplate.replace(/( )(rt)([A-Z]{1})([A-Za-z]+="|[A-Za-z]+=')(this)/g, (...args) => `${args[1]}on${args[3].toLowerCase()}${args[4]}window.routerController.declareComponents.${key}`);
      const domReg = new RegExp(`(\<)(${key})(\/>)`, 'g');
      this.declareTemplate = this.declareTemplate.replace(domReg, (...args) => `${declareTemplate}`);
    }
  }

  $beforeInit() {
    this.watcher = new Watcher(this.state, this.$watchState);
  }

  $watchState(oldData, newData) {
    console.log('oldData:', oldData);
    console.log('newData:', newData);
  }

  $onInit() {
    // this.console.innerText = 'is $onInit';
    // console.log('is $onInit');
  }

  $beforeMount() {
    // this.console.innerText = 'is $beforeMount';
    // console.log('is $beforeMount');
  }

  $afterMount() {
    // this.console.innerText = 'is $afterMount';
    // console.log('is $afterMount');
  }

  $onDestory() {
    // this.console.innerText = 'is $onDestory';
    // console.log('is $onDestory');
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
