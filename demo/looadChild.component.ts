import { Component, ElementRef, InDiv } from '@indiv/core';
// import { Component, ElementRef, InDiv } from '../build/core';

import { HeroSearchService } from './service';
import { PrivateService } from './private.service';

@Component({
  selector: 'test-loadchild-component',
  template: `
    <div>
      <p router-to="'/R1/C1/D1'" router-from="'/R1/C1?a=1'">test loadChild</p>
      <router-render></router-render>
    </div>
  `,
})
export class TestLoadchildComponent {
  constructor(
    private sss: HeroSearchService,
    private element: ElementRef,
    private indiv: InDiv,
    private pss: PrivateService,
  ) {
    console.log(99999, 'from TestLoadchildComponent', this.element, this.indiv);
    this.sss.test(5);
    this.pss.change();
  }
}

@Component({
  selector: 'R2',
  template: `
    <p router-to="'/R2'">我是R22222</p>
    <pp-childs ax={3}></pp-childs>
    `,
})
export class R2 {
  constructor(
    private sss: HeroSearchService,
    private element: ElementRef,
    private indiv: InDiv,
    private priSS: PrivateService,
  ) {
    console.log(100000, 'from R2 LoadModule', this.sss, this.element, this.indiv, this.priSS);
    this.sss.test(6);
  }
}
