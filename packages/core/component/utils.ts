import { IComponent } from '../types';
import { Utils } from '../utils';
import { Watcher } from './watch';

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
// todo  有点问题
export function setState(newState: any): void {
  let _newState = null;
  if (newState && utils.isFunction(newState)) _newState = newState();
  if (newState && newState instanceof Object) _newState = newState;
  for (const key in _newState) {
    this[key] = _newState;
    Watcher(this, key);
  }
  // if (newState && utils.isFunction(newState)) {
  //   const _newState = newState();
  //   if (_newState && _newState instanceof Object) {
  //     if (utils.isEqual(this.state, _newState)) return;
  //     const _state = JSON.parse(JSON.stringify(this.state));
  //     Object.assign(_state, _newState);
  //     this.state = _state;
  //     // if ((this as IComponent).nvWatchState) (this as IComponent).stateWatcher = new Watcher((this as IComponent).state, (this as IComponent).nvWatchState.bind(this as IComponent), (this as IComponent).render.bind(this as IComponent));
  //     // if (!(this as IComponent).nvWatchState) (this as IComponent).stateWatcher = new Watcher((this as IComponent).state, null, (this as IComponent).render.bind(this as IComponent));
  //     (this as IComponent).render();
  //   }
  // }
  // if (newState && newState instanceof Object) {
  //   if (utils.isEqual(this.state, newState)) return;
  //   const _state = JSON.parse(JSON.stringify(this.state));
  //   Object.assign(_state, newState);
  //   this.state = _state;
  //   // if ((this as IComponent).nvWatchState) (this as IComponent).stateWatcher = new Watcher((this as IComponent).state, (this as IComponent).nvWatchState.bind(this as IComponent), (this as IComponent).render.bind(this as IComponent));
  //   // if (!(this as IComponent).nvWatchState) (this as IComponent).stateWatcher = new Watcher((this as IComponent).state, null, (this as IComponent).render.bind(this as IComponent));
  //   (this as IComponent).render();
  // }
}

function buildProps(template: string, componentInstance: IComponent, dependences: string[]): void {
  const templateMatchResult: string[] = template.match(/\"\{[^\{\}]+?\}\"/g);
  if (!templateMatchResult) return;
  templateMatchResult.forEach((matchProps) => {
    const pureMatchProps = matchProps.replace(/^\"\{/, '').replace(/\}\"$/, '');
    if (/^.*\(.*\)$/.test(pureMatchProps)) {
      const args = pureMatchProps.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
      args.forEach(arg => {
        const pureArg = arg.split('.')[0];
        if (componentInstance && pureArg in componentInstance && dependences.indexOf(pureArg) === -1) dependences.push(pureArg);
      });
    } else {
      const pureProps = pureMatchProps.split('.')[0];
      if (componentInstance && pureProps in componentInstance && dependences.indexOf(pureProps) === -1) dependences.push(pureProps);
    }
  });
}

function buildAttribute(template: string, componentInstance: IComponent, dependences: string[]): void {
  const templateMatchResult: string[] = template.match(/nv\-[a-z,A-Z]+\=\"((?!nv\-)(?!\=).)+\"/g);
  if (!templateMatchResult) return;
  templateMatchResult.forEach((matchProps) => {
    const pureMatchProps = matchProps.split('=')[1].replace(/^\"/, '').replace(/\"$/, '');
    if (/^.*\(.*\)$/.test(pureMatchProps)) {
      const args = pureMatchProps.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
      args.forEach(arg => {
        const pureArg = arg.split('.')[0];
        if (componentInstance && pureArg in componentInstance && dependences.indexOf(pureArg) === -1) dependences.push(pureArg);
      });
    } else {
      let pureProps = null;
      if (/^nv-repeat=.*/.test(matchProps)) pureProps = pureMatchProps.split(' ')[3].split('.')[0];
      if (!/^nv-repeat=.*/.test(matchProps)) pureProps = pureMatchProps.split('.')[0];
      if (componentInstance && pureProps in componentInstance && dependences.indexOf(pureProps) === -1) dependences.push(pureProps);
    }
  });
}

function buildTemplateText(template: string, componentInstance: IComponent, dependences: string[]) {
  const templateMatchResult: string[] = template.match(/(\{\{[^\{\}]+?\}\})/g);
  if (!templateMatchResult) return;
  templateMatchResult.forEach((matchProps) => {
    const pureMatchProps = matchProps.replace(/^\{\{/, '').replace(/\}\}$/, '');
    if (/^.*\(.*\)$/.test(pureMatchProps)) {
      const args = pureMatchProps.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
      args.forEach(arg => {
        const pureArg = arg.split('.')[0];
        if (componentInstance && pureArg in componentInstance && dependences.indexOf(pureArg) === -1) dependences.push(pureArg);
      });
    } else {
      const pureProps = pureMatchProps.split('.')[0];
      if (componentInstance && pureProps in componentInstance && dependences.indexOf(pureProps) === -1) dependences.push(pureProps);
    }
  });
}

export function collectDependencesFromViewModel(template: string, componentInstance: IComponent): string[] {
  const dependences: string[] = [];
  buildProps(template, componentInstance, dependences);
  buildAttribute(template, componentInstance, dependences);
  buildTemplateText(template, componentInstance, dependences);
  return dependences;
}
