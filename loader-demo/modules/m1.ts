import { InDiv, NvModule } from '@indiv/core';
import { RouteModule } from '@indiv/router';

import { HeroSearchService } from '../services/service';

import { PComponent } from '../components/pc-component';
import { R1 } from '../components/r1';
import { TestComponent } from '../components/test-component';
import Container from '../components/container';

import { M2 } from './m2';

@NvModule({
  imports: [
    M2,
  ],
  declarations: [
    Container,
    PComponent,
    TestComponent,
    R1,
  ],
  exports: [
    RouteModule,
  ],
  bootstrap: Container,
})
export class M1 {
  constructor(
    private hsr: HeroSearchService,
    private indiv: InDiv,
  ) {
    console.log(999999888777, '来自注入的模块 M1', this.hsr, this.indiv);
  }
}
