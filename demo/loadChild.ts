import { NvModule, Component, ElementRef, InDiv } from '../src';
// import { NvModule, Component, ElementRef, InDiv } from '../build';

import { HeroSearchService, HeroSearchService1, HeroSearchService2 } from './service';
import { SharedModule } from './share.module';

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
    private element: ElementRef,
    private indiv: InDiv,
  ) {
    this.state = {
      to: '/R1/C1/D1', 
    };
    console.log(99999, 'from TestLoadchildComponent', this.element, this.indiv);
    this.sss.test(5);
  }
}

@Component({
  selector: 'R2',
  template: `
    <p>我是R22222</p>
    `,
})
class R2 {
  constructor(
    private sss: HeroSearchService,
    private element: ElementRef,
    private indiv: InDiv,
  ) {
    console.log(100000, 'from R2 LoadModule', this.sss, this.element, this.indiv);
    this.sss.test(6);
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
  providers: [
    HeroSearchService1, HeroSearchService2, HeroSearchService,
  ],
  exports: [
    TestLoadchildComponent,
  ],
  bootstrap: TestLoadchildComponent,
})
export class TestLoadchildModule {
  constructor (
    private indiv: InDiv,
  ) {
    console.log(999999888777, '来自懒加载的模块 TestLoadchildModule', this.indiv);
  }
}
