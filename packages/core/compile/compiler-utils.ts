import { IComponent, IDirective } from '../types';
import { ElementRef } from '../component';
import { factoryCreator } from '../di';

/**
 * build scope for Components in Component
 *
 * @export
 * @param {Function} ComponentClass
 * @param {*} inputs
 * @param {*} nativeElement
 * @param {IComponent} componentInstance
 * @returns {IComponent}
 */
export function buildComponentScope(ComponentClass: Function, inputs: any, nativeElement: any, componentInstance: IComponent): IComponent {
  const provideAndInstanceMap = new Map();
  provideAndInstanceMap.set(ElementRef, new ElementRef(nativeElement));

  const _component: IComponent = factoryCreator(ComponentClass, componentInstance.otherInjector, provideAndInstanceMap);

  // _save_inputs in @Component for save props states
  _component._save_inputs = inputs;
  _component.nativeElement = nativeElement;

  for (const key in inputs) {
    if (_component.inputsList) {
      _component.inputsList.forEach(({ propertyName, inputName }) => {
        if (inputName === key) (_component as any)[propertyName] = inputs[key];
      });
    }
  }

  componentInstance.declarationMap.forEach((declaration, key) => {
    if (!_component.declarationMap.has(key)) _component.declarationMap.set(key, declaration);
  });

  // bind compile for @Component
  _component.otherInjector = componentInstance.otherInjector;

  return _component;
}

/**
 * build scope for Directives in Directive
 *
 * @export
 * @param {Function} DirectiveClass
 * @param {*} inputs
 * @param {*} nativeElement
 * @param {IComponent} componentInstance
 * @returns {IDirective}
 */
export function buildDirectiveScope(DirectiveClass: Function, inputs: any, nativeElement: any, componentInstance: IComponent): IDirective {
  const provideAndInstanceMap = new Map();
  provideAndInstanceMap.set(ElementRef, new ElementRef(nativeElement));

  const _directive: IDirective = factoryCreator(DirectiveClass, componentInstance.otherInjector, provideAndInstanceMap);

  _directive._save_inputs = inputs;
  _directive.nativeElement = nativeElement;

  if (_directive.inputsList) {
    _directive.inputsList.forEach(({ propertyName, inputName }) => {
      if (inputName === (DirectiveClass as any).selector) (_directive as any)[propertyName] = inputs;
    });
  }

  componentInstance.declarationMap.forEach((declaration, key) => {
    if (!_directive.declarationMap.has(key)) _directive.declarationMap.set(key, declaration);
  });

  _directive.otherInjector = componentInstance.otherInjector;

  return _directive;
}
