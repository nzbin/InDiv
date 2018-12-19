import { IComponent, IDirective } from '../types';

/**
 * For input props
 * 
 * param name?: string is prop name of @Component or @Directive, default value is the property name of instance
 * if you set param name, so the property name of instance will receive prop of param name
 *
 * @export
 * @param {string} [name]
 * @returns
 */
export function Input(name?: string) {
  return function (target: IComponent | IDirective, propertyName: string) {
      const propName = name ? name : propertyName;
      const inputName = propertyName;
      if (target.inputPropsMap && !target.inputPropsMap.has(propName)) target.inputPropsMap.set(propName, inputName);
      if (!target.inputPropsMap) {
        target.inputPropsMap = new Map();
        target.inputPropsMap.set(propName, inputName);
      }
  };
}
