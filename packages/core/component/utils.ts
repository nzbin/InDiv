import { IComponent, ComponentList, DirectiveList } from '../types';
import { utils } from '../utils';
import { WatcherDependences } from './watch';

export type SetState = (newState: any) => void;

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
export function setState(newState: any): void {
  let _newState = null;

  if (newState && utils.isFunction(newState)) _newState = newState();
  if (newState && newState instanceof Object) _newState = newState;

  const saveWatchStatus = (this as IComponent).watchStatus;

  if (saveWatchStatus === 'available') (this as IComponent).watchStatus = 'pending';

  for (const key in _newState) {
    this[key] = _newState[key];
    WatcherDependences(this as IComponent, key);
  }

  if (saveWatchStatus === 'available') {
    (this as IComponent).watchStatus = 'available';
    if ((this as IComponent).nvDoCheck) (this as IComponent).nvDoCheck();
    (this as IComponent).render();
  }
}

/**
 * collect dependences from inputs of @Component template
 *
 * @param {IComponent} componentInstance
 * @returns {void}
 */
function resolveInputs(componentInstance: IComponent): void {
  const templateMatchResult: string[] = componentInstance.template.match(/\"\{[^\{\}]+?\}\"/g);
  if (!templateMatchResult) return;
  templateMatchResult.forEach((matchProps) => {
    const pureMatchProps = matchProps.replace(/^\"\{/, '').replace(/\}\"$/, '');
    if (/^.*\(.*\)$/.test(pureMatchProps)) {
      const args = pureMatchProps.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
      args.forEach(arg => {
        const pureArg = arg.split('.')[0];
        if (componentInstance && pureArg in componentInstance && componentInstance.dependencesList.indexOf(pureArg) === -1) componentInstance.dependencesList.push(pureArg);
      });
    } else {
      const pureProps = pureMatchProps.split('.')[0];
      if (componentInstance && pureProps in componentInstance && componentInstance.dependencesList.indexOf(pureProps) === -1) componentInstance.dependencesList.push(pureProps);
    }
  });
}

/**
 * collect dependences from nv directives of @Component template
 *
 * @param {IComponent} componentInstance
 * @returns {void}
 */
function resolveDirective(componentInstance: IComponent): void {
  const templateMatchResult: string[] = componentInstance.template.match(/nv\-[a-z,A-Z]+\=\"((?!nv\-)(?!\=).)+\"/g);
  if (!templateMatchResult) return;
  templateMatchResult.forEach((matchProps) => {
    const pureMatchProps = matchProps.split('=')[1].replace(/^\"/, '').replace(/\"$/, '');
    if (/^.*\(.*\)$/.test(pureMatchProps)) {
      const args = pureMatchProps.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
      args.forEach(arg => {
        const pureArg = arg.split('.')[0];
        if (componentInstance && pureArg in componentInstance && componentInstance.dependencesList.indexOf(pureArg) === -1) componentInstance.dependencesList.push(pureArg);
      });
    } else {
      let pureProps = null;
      if (/^nv-repeat=.*/.test(matchProps)) {
        const _value = pureMatchProps.split(' in ')[1];
        if (!_value) throw new Error(`directive nv-repeat 's expression ${pureMatchProps} is wrong!`);
        const value = _value.replace(/\s*/g, '');
        pureProps = value.split('.')[0];
      }
      if (!/^nv-repeat=.*/.test(matchProps)) pureProps = pureMatchProps.split('.')[0];
      if (componentInstance && pureProps in componentInstance && componentInstance.dependencesList.indexOf(pureProps) === -1) componentInstance.dependencesList.push(pureProps);
    }
  });
}

/**
 * collect dependences from {{ }} of @Component template
 *
 * @param {IComponent} componentInstance
 * @returns
 */
function resolveTemplateText(componentInstance: IComponent) {
  const templateMatchResult: string[] = componentInstance.template.match(/(\{\{[^\{\}]+?\}\})/g);
  if (!templateMatchResult) return;
  templateMatchResult.forEach((matchProps) => {
    const pureMatchProps = matchProps.replace(/^\{\{/, '').replace(/\}\}$/, '');
    if (/^.*\(.*\)$/.test(pureMatchProps)) {
      const args = pureMatchProps.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
      args.forEach(arg => {
        const pureArg = arg.split('.')[0];
        if (componentInstance && pureArg in componentInstance && componentInstance.dependencesList.indexOf(pureArg) === -1) componentInstance.dependencesList.push(pureArg);
      });
    } else {
      const pureProps = pureMatchProps.split('.')[0];
      if (componentInstance && pureProps in componentInstance && componentInstance.dependencesList.indexOf(pureProps) === -1) componentInstance.dependencesList.push(pureProps);
    }
  });
}

/**
 * collect dependences from @Component template
 *
 * @export
 * @param {IComponent} componentInstance
 */
export function collectDependencesFromViewModel(componentInstance: IComponent): void {
  resolveInputs(componentInstance);
  resolveDirective(componentInstance);
  resolveTemplateText(componentInstance);
}

/**
 * to build foundMap for @ViewChild @ViewChildren @ContentChild @ContentChildren
 *
 * @param {IComponent} component
 * @param {(string | Function)} selector
 * @returns {(ComponentList[] | DirectiveList[])}
 */
export function buildFoundMap(component: IComponent, selector: string | Function): ComponentList[] | DirectiveList[] {
  let toFindMap: ComponentList[] | DirectiveList[];
  if (typeof selector === 'string') {
    if ((component.declarationMap.get(selector) as any).nvType === 'nvComponent') toFindMap = component.componentList;
    if ((component.declarationMap.get(selector) as any).nvType === 'nvDirective') toFindMap = component.directiveList;
  }
  if (utils.isFunction(selector)) {
    if ((selector as any).nvType === 'nvComponent') toFindMap = component.componentList;
    if ((selector as any).nvType === 'nvDirective') toFindMap = component.directiveList;
  }
  return toFindMap;
}
