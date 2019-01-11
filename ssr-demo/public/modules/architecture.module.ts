import { NvModule } from '@indiv/core';

import ArchitectureContainer from '../pages/architecture';

@NvModule({
    declarations: [
        ArchitectureContainer,
    ],
    exports: [
        ArchitectureContainer,
    ],
    bootstrap: ArchitectureContainer,
})
export default class ArchitectureModule { }
