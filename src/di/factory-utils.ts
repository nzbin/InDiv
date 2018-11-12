import { InDiv } from '../indiv';

export function internalDependence(_constructor: Function, key: Function | string, rootModule: any, loadModule?: any): any {
  if (key === InDiv && rootModule.$indivInstance) return rootModule.$indivInstance;
}
