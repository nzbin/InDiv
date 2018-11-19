/**
 * IOC container for InDiv
 * 
 * methods: push, find, get
 *
 * @export
 * @class IOCContainer
 */
export class Injector {
  private providerMap: Map<any, any> = new Map();
  private instanceMap: Map<any, any> = new Map();

  public setProvider(key: any, value: any): void {
    if (!this.providerMap.has(key)) this.providerMap.set(key, value);
  }

  public getProvider(key: any): any {
    return this.providerMap.get(key);
  }

  public getInstance(key: any): any {
    if (this.instanceMap.has(key)) return this.instanceMap.get(key);
    return null;
  }

  public setInstance(key: any, value: any): void {
    if (!this.instanceMap.has(key)) this.instanceMap.set(key, value);
  }
}

export const rootInjector = new Injector();
