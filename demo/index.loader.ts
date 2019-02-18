function Component(option: any): (_constructor: Function) => void {
    return function (_constructor: Function): void {};
}

@Component({
  selector: 'container-wrap',
  template: `
  <div class="fucck" nv-id="'cc'"></div>
  <p>1111</p>
`,
})

class Container {
  public xxx: number;
  constructor() {
    this.xxx = 1;
  }
}

