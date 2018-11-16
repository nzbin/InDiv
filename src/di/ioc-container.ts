/**
 * IOC container for InDiv
 * 
 * methods: push, find, get
 *
 * @export
 * @class IOCContainer
 */
export class IOCContainer {
  private containerMap: Map<any, any> = new Map();
  private instanceMap: Map<any, any> = new Map();

  public pushContainer(key: any, value: any): void {
    this.containerMap.set(key, value);
  }

  public getContainer(key: any): any {
    return this.containerMap.get(key);
  }

  public getInstance(key: any): any {
    if (this.instanceMap.has(key)) return this.instanceMap.get(key);
    return null;
  }

  public pushInstance(key: any, value: any): void {
    this.instanceMap.set(key, value);
  }
}
