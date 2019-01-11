import { NvModule } from '@indiv/core';

import IntroductionContainer from '../pages/introduction';

@NvModule({
    imports: [
    ],
    declarations: [
        IntroductionContainer,
    ],
    providers: [
    ],
    exports: [
        IntroductionContainer,
    ],
    bootstrap: IntroductionContainer,
})
export default class IntroductionModule { }
