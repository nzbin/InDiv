import { Component, Controller, Router, RouterHash } from '../src';

class PComponent extends Component {
  constructor(name, props) {
    super(name, props);
    this.state = {
      a: 'a',
      b: 100,
      c: '<p>1111</p>',
      d: [
        {
          z: 111111111111111,
          b: 'a',
        },
        {
          z: 33333333333333,
          b: 'a',
        },
      ],
      e: false,
    };
  }

  $declare() {
    this.$template = (`
      <div>
        <p es-if="this.state.e" es-class="this.state.a" es-repeat="let a in this.state.d"  es-on:click="this.componentClick($event, this.state.b, '111', 1, false, true, a, this.aaa)">{{a.z}}</p>
        <input es-repeat="let a in this.state.d" es-model="a.z" />
        <p es-on:click="this.sendProps(5)">props from component.state.a: {{this.props.ax}}</p>
      </div>
    `);
  }

  $onInit() {
    console.log('props', this.props);
  }
  componentClick(e) {
    alert('点击了组件');
    this.setState({ b: 2 });
    this.setProps({ ax: 5 });
    this.props.b(3);
  }
  sendProps(ax) {
    this.setProps({ ax: ax });
    this.props.b(ax);
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
      a: 'a11',
      b: 2,
      d: [{
        z: 111111111111111,
        b: 'a',
        show: true,
      },
      {
        z: 33333333333333,
        b: 'a',
        show: true,
      }],
      c: 'c',
      e: [{
        z: 232323,
        b: 'a',
        show: true,
      },
      {
        z: 1111,
        b: 'a',
        show: false,
      }],
      f: true,
    };
  }

  $declare() {
    this.$template = (`
    <div>
      <pComponent1/>
      <pComponent2/>
      <div es-if="this.state.f">
        <input es-repeat="let a in this.state.e" es-model="a.z" />
        <p es-class="this.state.c" es-if="a.show" es-repeat="let a in this.state.e" es-text="a.z" es-on:click="this.showAlert(a.z)"></p>
        this.state.a：<br/>
        <input es-model="this.state.a" />
      </div>
    </div>
    `);
    this.$components = {
      pComponent1: new PComponent('pComponent1', {
        ax: this.state.a,
        b: this.getProps.bind(this), // action in this
      }),
      pComponent2: new PComponent('pComponent2', {
        ax: this.state.a,
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
  showAlert(a) {
    this.$location.go('/R1/R4', { a: '1' });
    console.log('this.$location', this.$location.state());

    // console.log('location2', history.length);
    // history.go(1);
    // alert('我错了 点下控制台看看吧');
    // console.log('aa', a);
    // console.log('!this.state.f', !this.state.f);
    // this.setState({
      // a: 'a2323',
      // b: 100,
      // f: !this.state.f,
    // });
    // console.log('state', this.state.f);
  }
  getProps(a) {
    alert('里面传出来了');
    this.setState({ a: a });
  }
}

class R2 extends Controller {
  constructor() {
    super();
    this.state = { a: 1 };
  }
  $declare() {
    this.$template = '<p es-on:click="this.showAlert()">R2 点我然后打开控制台看看</p>';
    this.$components = {
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
    alert('我错了 点下控制台看看吧');
    this.setState(() => ({ a: 2 }));
  }
}

const router = new Router();
const routes = [
  {
    path: '/R1',
    controller: R1,
  },
  {
    path: '/R2',
    controller: R2,
  },
  {
    path: '/R2/R3',
    controller: R1,
  },
  {
    path: '/R1/R4',
    controller: R2,
  },
];
router.init(routes);
router.$routeChange = function (old, next) {
  console.log('$routeChange', old, next);
};
