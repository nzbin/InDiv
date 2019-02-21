import { IComponent } from '../types';
export declare type SetState = (newState: any) => void;
/**
 * set dependences states from @Component instance
 *
 * merge multiple changes like remove properties or add properties or change Array to once render
 *
 * if Componet's watchStatus is 'available', firstly changer watchStatus to 'pending' and at last change back to 'available'
 * if Componet's watchStatus has been 'pending', only to change instance
 *
 * @export
 * @param {*} newState
 * @returns {void}
 */
export declare function setState(newState: any): void;
/**
 * collect dependences from @Component template
 *
 * @export
 * @param {IComponent} componentInstance
 */
export declare function collectDependencesFromViewModel(componentInstance: IComponent): void;
