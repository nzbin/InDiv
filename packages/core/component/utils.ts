import { IComponent } from '../types';
import { Utils } from '../utils';
import { Watcher } from '../watcher';

const utils = new Utils();

export type SetState = (newState: any) => void;

/**
 * set state from @Component instance
 *
 * merge multiple changes like remove properties or add properties or change Array to once render
 *
 * @export
 * @param {*} newState
 * @returns {void}
 */
export function setState(newState: any): void {
  if (newState && utils.isFunction(newState)) {
    const _newState = newState();
    if (_newState && _newState instanceof Object) {
      if (utils.isEqual(this.state, _newState)) return;
      const _state = JSON.parse(JSON.stringify(this.state));
      Object.assign(_state, _newState);
      this.state = _state;
      if ((this as IComponent).nvWatchState) (this as IComponent).stateWatcher = new Watcher((this as IComponent).state, (this as IComponent).nvWatchState.bind(this as IComponent), (this as IComponent).render.bind(this as IComponent));
      if (!(this as IComponent).nvWatchState) (this as IComponent).stateWatcher = new Watcher((this as IComponent).state, null, (this as IComponent).render.bind(this as IComponent));
      (this as IComponent).render();
    }
  }
  if (newState && newState instanceof Object) {
    if (utils.isEqual(this.state, newState)) return;
    const _state = JSON.parse(JSON.stringify(this.state));
    Object.assign(_state, newState);
    this.state = _state;
    if ((this as IComponent).nvWatchState) (this as IComponent).stateWatcher = new Watcher((this as IComponent).state, (this as IComponent).nvWatchState.bind(this as IComponent), (this as IComponent).render.bind(this as IComponent));
    if (!(this as IComponent).nvWatchState) (this as IComponent).stateWatcher = new Watcher((this as IComponent).state, null, (this as IComponent).render.bind(this as IComponent));
    (this as IComponent).render();
  }
}

// todo remove state
function buildProps(template: string, componentInstance: IComponent, dependences: string[]): void {
  const templateMatchResult: string[] = template.match(/\"\{[^\{\}]+?\}\"/g);
  if (!templateMatchResult) return;
  templateMatchResult.forEach((matchProps) => {
    const pureMatchProps = matchProps.replace(/^\"\{/, '').replace(/\}\"$/, '');
    if (!/^(\@).*/.test(pureMatchProps)) {
      const pureProps = pureMatchProps.split('.')[0];
      if (componentInstance.state && componentInstance.state.hasOwnProperty(pureProps) && dependences.indexOf(pureProps) === -1) dependences.push(pureProps);
    }
    if (/^(\@).*/.test(pureMatchProps) && /^(\@).*\(.*\)$/.test(pureMatchProps)) {
      const args = pureMatchProps.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
      args.forEach(arg => {
        const pureArg = arg.split('.')[0];
        if (componentInstance.state && componentInstance.state.hasOwnProperty(pureArg) && dependences.indexOf(pureArg) === -1) dependences.push(pureArg);
      });
    }
  });
}

function buildAttribute(template: string, componentInstance: IComponent, dependences: string[]): void {
  // todo 整个匹配出
  const templateMatchResult: string[] = template.match(/nv\-[a-z,A-Z,\:]*\=\"((?!nv\-)(?!\=).)*\"/g);
  // console.log(4444444444444, templateMatchResult);
  // templateMatchResult.forEach((matchProps) => {
  //   const pureMatchProps = matchProps.replace(/^\"\{/, '').replace(/^\}\"/, '');
  // });
}

export function collectDependencesFromViewModel(template: string, componentInstance: IComponent): string[] {
  const dependences: string[] = [];

  buildProps(template, componentInstance, dependences);
  buildAttribute(template, componentInstance, dependences);

  return dependences;
}
