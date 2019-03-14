import { Vnode, TNvAttribute } from './vnode';

/**
 * parse a tag and return a Vnode
 *
 * @export
 * @param {string} tag
 * @param {string[]} directives
 * @returns {Vnode}
 */
export function parseTag(tag: string, directives: string[]): Vnode {
  const vNodeOptions: Vnode = {
    tagName: '',
    nativeElement: null,
    parentVnode: null,
    attributes: [],
    childNodes: [],
    nodeValue: null,
    type: 'tag',
    value: null,
    repeatData: null,
    eventTypes: [],
    key: null,
    checked: false,
    voidElement: false,
    template: tag,
    inComponent: false,
  };

  // const attrRegex = /[\w-:]+(\=['"]([^=-]*)['"]){0,1}/g;
  // todo optimize regular expressions
  const attrRegex = /[\w-:]+((\=[']([^']*)['])|(\=["]([^"]*)["])){0,1}/g;
  const voidElementList = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'menuitem',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ];

  tag.match(attrRegex).forEach((attr, index) => {
    if (index === 0) {
      if (voidElementList.indexOf(attr) !== -1 || tag.charAt(tag.length - 2) === '/') vNodeOptions.voidElement = true;
      vNodeOptions.tagName = attr;
    } else {
      const name = attr.match(/([^=]*)\=(.*)/)[1];
      const _value = attr.match(/([^=]*)\=(.*)/)[2];
      const value = _value ? _value.substr(0, _value.length - 1).substr(1) : null;
      let type: TNvAttribute = 'attribute';
      if (name.indexOf('nv-') === 0) type = 'nv-attribute';
      if (name.indexOf('nv-on:') === 0) type = 'nv-event';
      if (directives.indexOf(name) !== -1 && /^\{[^{}]*\}$/.test(value)) type = 'directive';
      if (directives.indexOf(name) === -1 && /^\{[^{}]*\}$/.test(value)) type = 'prop';
      vNodeOptions.attributes.push({ name, value, type });
    }
  });

  return new Vnode(vNodeOptions);
}
