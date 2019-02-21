import { InDiv, IPlugin } from '@indiv/core';
/**
 * indiv plugin for platform server
 *
 * includes setIndivEnv, setRootElement and setRenderer
 *
 * @export
 * @class PlatformServer
 * @implements {IPlugin}
 */
export declare class PlatformServer implements IPlugin {
    bootstrap(indivInstance: InDiv): void;
}
