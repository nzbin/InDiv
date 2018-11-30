import { InDiv, IMiddleware } from '@indiv/core';
export { Compile, CompileUtilForRepeat, CompileUtil } from './compile';
export { render } from './render';
export declare class PlatformBrowser implements IMiddleware {
    bootstrap(indivInstance: InDiv): void;
}
