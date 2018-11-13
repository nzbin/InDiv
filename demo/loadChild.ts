// import { NvModule, Component, Injected, setLocation, SetLocation, NvLocation } from '../src';
import { NvModule, Component, NvLocation } from '../src';
import { HeroSearchService } from './index';

// @Injected
@Component({
  selector: 'test-loadchild-component',
  template: `
    <div>
      <p nv-on:click="@jump()">test loadChild</p>
      <router-render></router-render>
    </div>
  `,
})
class TestLoadchildComponent {
  // private setLocation: SetLocation;
  constructor(
    private sss: HeroSearchService,
    private location: NvLocation,
  ) {
    console.log(99999, 'from TestLoadchildModule');
    this.sss.test();
    // this.setLocation = setLocation;
  }
  public jump() {
    // this.setLocation('/R1/C1/D1');
    this.location.setLocation('/R1/C1/D1');
  }
}

// @Injected
@Component({
  selector: 'R2',
  template: `
    <p>我是R22222</p>
    `,
})
class R2 {
  constructor(private sss: HeroSearchService) {
    console.log(100000, 'from R2 LoadModule', this.sss);
    this.sss.test();
  }
}

// @Injected
@NvModule({
  // providers: [
  //   HeroSearchService,
  //   HeroSearchService1,
  // ],
  declarations: [
    TestLoadchildComponent,
    R2,
  ],
  exports: [
    TestLoadchildComponent,
  ],
  bootstrap: TestLoadchildComponent,
})
export class TestLoadchildModule {}
