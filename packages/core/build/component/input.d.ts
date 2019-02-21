import { IComponent, IDirective } from '../types';
/**
 * For input props
 *
 * param name?: string is prop name of @Component or @Directive, default value is the property name of instance
 * if you set param name, so the property name of instance will receive prop of param name
 *
 * @export
 * @param {string} [input]
 * @returns {((target: IComponent | IDirective, propertyName: string) => any)}
 */
export declare function Input(input?: string): (target: IComponent | IDirective, propertyName: string) => any;
