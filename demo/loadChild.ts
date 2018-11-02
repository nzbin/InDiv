import { NvModule, Component, Injected } from '../src';
import { HeroSearchService, HeroSearchService1 } from './index';

@Injected
@Component({
  selector: 'test-loadchild-component',
  template: `
    <div>
      <p>test loadChild</p>
      <router-render></router-render>
    </div>
  `,
})
class TestLoadchildComponent {
  constructor(
    private sss: HeroSearchService,
  ) {
    console.log(99999, 'from TestLoadchildModule');
    this.sss.test();
  }
}

@Injected
@NvModule({
  providers: [
    HeroSearchService,
    HeroSearchService1,
  ],
  components: [
    TestLoadchildComponent,
  ],
  exports: [
    TestLoadchildComponent,
  ],
  bootstrap: TestLoadchildComponent,
})
export class TestLoadchildModule {}
