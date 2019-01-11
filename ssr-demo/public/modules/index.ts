import { NvModule } from '@indiv/core';

import RootComponent from '../components/root-component';
import SideBar from '../components/side-bars';
import CodeShower from '../components/code-show';
import RouterModule from '../routes';

import TestService from '../service/test.service';

@NvModule({
  imports: [
    RouterModule,
  ],
  declarations: [
    SideBar,
    RootComponent,
    CodeShower,
  ],
  providers: [
    TestService,
  ],
  bootstrap: RootComponent,
})
export default class RootModule { }
