class Component {
  constructor() {
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

  setState(key, value) {
    console.log('key', key);
    console.log('value', value);
    console.log('this.state', this.state);
    if (this.state[key]) {
      this.state[key] = value;
    } else {
      console.error(`setState failed: ${key} isn't exit`);
    }
  }
}
