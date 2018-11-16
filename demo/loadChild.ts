import { NvModule, Component } from '../src';
import { HeroSearchService, SharedModule } from './index';

// @Injected
@Component({
  selector: 'test-loadchild-component',
  template: `
    <div>
      <p router-to="to">test loadChild</p>
      <router-render></router-render>
    </div>
  `,
})
class TestLoadchildComponent {
  public state: any;
  constructor(
    private sss: HeroSearchService,
  ) {
    this.state = {
      to: '/R1/C1/D1', 
    };
    console.log(99999, 'from TestLoadchildModule');
    this.sss.test();
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

@NvModule({
  imports: [
    SharedModule,
  ],
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
