import { InDiv, Utils, NvModule } from '@indiv/core';
import { NvLocation, RouteModule } from '@indiv/router';
import { PlatformBrowser } from '@indiv/platform-browser';
import { HttpClient } from '@indiv/common';

import { SharedModule } from './share.module';
import { HeroSearchService, HeroSearchService1, HeroSearchService2, ValueType } from './service';

import { PComponent } from './pc-component';
import { R1 } from './r1';
import { R2 } from './r2';
import { TestComponent } from './test-component';
import Container from './container';

@NvModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    R2,
  ],
  providers: [
    Utils,
    HttpClient,
    HeroSearchService,
    {
      provide: HeroSearchService1,
      useClass: HeroSearchService1,
    },
    HeroSearchService2,
    {
      provide: ValueType,
      useValue: 1123,
    },
    NvLocation,
  ],
  exports: [
    R2,
    SharedModule,
  ],
})

class M2 {
  constructor(
    private indiv: InDiv,
  ) {
    console.log(99999988866666, '来自注入的模块 M2', this.indiv);
  }
}
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
class M1 {
  constructor(
    private hsr: HeroSearchService,
    private indiv: InDiv,
  ) {
    console.log(999999888777, '来自注入的模块 M1', this.hsr, this.indiv);
  }
}

const inDiv = new InDiv();
inDiv.bootstrapModule(M1);
inDiv.use(PlatformBrowser);
inDiv.init();
