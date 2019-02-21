import { InDiv, Utils, NvModule } from '@indiv/core';
import { NvLocation } from '@indiv/router';
import { HttpClient } from '@indiv/common';

import { SharedModule } from './share.module';
import { HeroSearchService, HeroSearchService1, HeroSearchService2, ValueType } from '../services/service';
import { R2 } from '../components/r2';

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

export class M2 {
  constructor(
    private indiv: InDiv,
  ) {
    console.log(99999988866666, '来自注入的模块 M2', this.indiv);
  }
}
