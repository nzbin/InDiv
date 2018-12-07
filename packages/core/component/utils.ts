import { IComponent } from '../types';
import { Utils } from '../utils';
import { WatcherDependences } from './watch';

const utils = new Utils();

export type SetState = (newState: any) => void;

/**
 * set dependences states from @Component instance
 *
 * merge multiple changes like remove properties or add properties or change Array to once render
 *
 * @export
 * @param {*} newState
 * @returns {void}
 */
export function setState(newState: any): void {
  const _oldState: any = {};
  let _newState = null;

  if (newState && utils.isFunction(newState)) _newState = newState();
  if (newState && newState instanceof Object) _newState = newState;

  (this as IComponent).renderStatus = 'pending';

  for (const key in _newState) {
    if (this[key] && (this as IComponent).nvWatchState) _oldState[key] = JSON.parse(JSON.stringify(this[key]));
    this[key] = _newState[key];
    WatcherDependences(this as IComponent, key);
  }

  (this as IComponent).renderStatus = 'available';

  if ((this as IComponent).nvWatchState) (this as IComponent).nvWatchState(_oldState);
  (this as IComponent).render();
}

/**
 * collect dependences from props of @Component template
 *
 * @param {IComponent} componentInstance
 * @returns {void}
 */
function resolveProps(componentInstance: IComponent): void {
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
      if (/^nv-repeat=.*/.test(matchProps)) pureProps = pureMatchProps.split(' ')[3].split('.')[0];
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
  resolveProps(componentInstance);
  resolveDirective(componentInstance);
  resolveTemplateText(componentInstance);
}
