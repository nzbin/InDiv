import { Component, ElementRef, InDiv, Watch, HasRender } from '@indiv/core';
// import { Component, ElementRef, InDiv } from '../build/core';

import { HeroSearchService } from './service';
import { PrivateService } from './private.service';

@Component({
  selector: 'test-loadchild-component',
  template: `
    <div>
      <p nv-repeat="t in ttt" nv-on:click="testt(t)" routerTo="{'/R1/C1/D1'}" routerFrom="{'/R1/C1?a=1'}">test loadChild</p>
      <router-render></router-render>
    </div>
  `,
})
export class TestLoadchildComponent implements HasRender {
  public ttt: string[] = [
    '1',
    '2',
  ];

  @Watch() public aa: string = '3';

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

  public testt(t: any) {
    console.log(4444444, '测试 repeat node', t);
    this.aa = Math.random().toString();
  }

  public nvHasRender() {
    console.log(99999, 'TestLoadchildComponent has rendered');
  }
}

@Component({
  selector: 'R2',
  template: `
    <p routerTo="{'/R2'}">我是R22222</p>
    <pp-childs ax="{3}"></pp-childs>
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
