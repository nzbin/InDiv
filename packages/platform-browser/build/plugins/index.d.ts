import { InDiv, IPlugin } from '@indiv/core';
/**
 * indiv plugin for platform browser
 *
 * includes setIndivEnv, setRootElement and setRenderer
 *
 * @export
 * @class PlatformBrowser
 * @implements {IPlugin}
 */
export declare class PlatformBrowser implements IPlugin {
    bootstrap(indivInstance: InDiv): void;
}
