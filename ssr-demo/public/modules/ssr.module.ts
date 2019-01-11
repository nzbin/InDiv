import { NvModule } from '@indiv/core';

import SSRContainer from '../pages/ssr';

@NvModule({
    declarations: [
        SSRContainer,
    ],
    exports: [
        SSRContainer,
    ],
    bootstrap: SSRContainer,
})
export default class SSRModule {}
