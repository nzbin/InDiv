import { NvModule } from '@indiv/core';

import MiddlewareContainer from '../pages/middleware';

@NvModule({
  declarations: [
      MiddlewareContainer,
    ],
  exports: [
      MiddlewareContainer,
    ],
  bootstrap: MiddlewareContainer,
})
export default class MiddlewareModule { }
