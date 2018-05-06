// import { Component, Controller, Router } from '../src';
const { Component, Controller, Router } = require('../src');

class PComponent extends Component {
  constructor(name, props) {
    super(name, props);
    // this.declareTemplate = '<p rt-on:click="this.componentClick()">被替换的组件</p>';
    // this.declareTemplate = '<p rt-on:click="this.componentClick()" rt-text="this.state.b"></p>';
    this.declareTemplate = `
      <p rt-on:click="this.componentClick()">{{this.props.ax}}</p>
    `;
    // this.declareTemplate = '<p rt-on:click="this.componentClick()" rt-html="this.state.c"></p>';
    // this.declareTemplate = '<p rt-on:click="this.componentClick()" class="b" rt-class="this.state.a">rt-class</p>';
    // this.declareTemplate = '<input rt-model="this.state.b" />';
    this.state = {
      a: 'a',
      b: 100,
      c: '<p>1111</p>',
    };
  }
  $onInit() {
    console.log('props', this.props);
  }
  componentClick() {
    // alert('点击了组件');
    this.setState({ b: 2 });
    this.setProps({ ax: 5 });
    // this.props.b(3);
  }
  $watchState(oldData, newData) {
    console.log('oldData Component:', oldData);
    console.log('newData Component:', newData);
  }
}

class R1 extends Controller {
  constructor() {
    super();
    this.state = {
      a: 1,
      b: 2,
    };
    this.declareTemplate = (`
      <p rt-on:click="this.showAlert()">R1 点我然后打开控制台看看</p>
      <pComponent1/><pComponent2/>
      <p rt-click="this.showAlert()">R1 点我然后打开控制台看看</p>
    `);
    this.declareComponents = {
      pComponent1: new PComponent('pComponent1', {
        ax: 'a', // key in this.state
        b: this.getProps.bind(this), // action in this
      }),
      pComponent2: new PComponent('pComponent2', {
        ax: 'a', // key in this.state
        b: this.getProps.bind(this), // action in this
      }),
    };
  }
  $onInit() {
    // console.log('is $onInit');
  }
  $beforeMount() {
    // console.log('is $beforeMount');
  }
  $afterMount() {
    // console.log('is $afterMount');
  }
  $onDestory() {
    // console.log('is $onDestory');
  }
  $watchState(oldData, newData) {
    console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  showAlert() {
    alert('我错了 点下控制台看看吧');
    this.setState({ a: 2 });
    console.log('state', this.state);
  }
  getProps(a) {
    // alert('里面传出来了');
    this.setState({ a: a });
  }
}

class R2 extends Controller {
  constructor() {
    super();
    this.state = { a: 1 };
    this.declareTemplate = '<p rtClick="this.showAlert()">R2 点我然后打开控制台看看</p>';
    this.declareComponents = {
      pComponent1: new PComponent('pComponent1', {
        a: this.state.a,
      }),
    };
  }
  $onInit() {
    // console.log('is $onInit');
  }
  $beforeMount() {
    // console.log('is $beforeMount');
  }
  $afterMount() {
    // console.log('is $afterMount');
  }
  $onDestory() {
    // console.log('is $onDestory');
  }
  $watchState(oldData, newData) {
    console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  showAlert() {
    // alert('我错了 点下控制台看看吧');
    this.setState(() => ({ a: 2 }));
  }
}

const router = new Router();
const routes = [
  {
    path: 'R1',
    controller: R1,
  },
  {
    path: 'R2',
    controller: R2,
  },
];
router.init(routes);
router.$routeChange = function (old, next) {
  console.log('$routeChange', old, next);
};
