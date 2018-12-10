export type TAttributes = {
  name: string;
  value: string;
  type: string;
  nvValue?: any;
};

export interface IPatchList {
  type?: number;
  node?: DocumentFragment | Element;
  parentVnode?: Vnode;
  newNode?: DocumentFragment | Element;
  oldVnode?: DocumentFragment | Element;
  newValue?: TAttributes | string | number | boolean | Function;
  oldValue?: TAttributes | string | number | boolean | Function;
  eventType?: string;
  newIndex?: number;
  originVnode?: Vnode;
  changedVnode?: Vnode;
  changedValue?: TAttributes | string | number | boolean | Function;
}

/**
 * Vnode
 *
 * @class Vnode
 */
export class Vnode {
  public tagName?: string;
  public node?: DocumentFragment | Element;
  public parentVnode?: Vnode;
  public attributes?: TAttributes[];
  public nodeValue?: string | null;
  public childNodes?: Vnode[];
  public type?: string;
  public value?: string | number;
  public repeatData?: any;
  public eventTypes?: { type: string; handler: Function}[] = [];
  public key?: any;
  public checked?: boolean;
  public voidElement?: boolean = false;
  public template: string;

  /**
   * Creates an instance of Vnode.
   * @param {Vnode} options
   * @memberof Vnode
   */
  constructor(options: Vnode) {
    this.tagName = options.tagName;
    this.node = options.node;
    this.parentVnode = options.parentVnode;
    this.attributes = options.attributes ? [...options.attributes] : [];
    this.childNodes = options.childNodes ? [...options.childNodes] : [];
    this.nodeValue = options.nodeValue;
    this.type = options.type;
    this.value = options.value;
    this.repeatData = options.repeatData;
    this.eventTypes = options.eventTypes ? [...options.eventTypes] : [];
    this.key = options.key;
    this.checked = false;
    this.voidElement = options.voidElement;
    this.template = options.template;
  }
}

export function parseTag(tag: string, directives: string[]): Vnode {
  const vNodeOptions: Vnode = {
    tagName: '',
    node: null,
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
  };

  const attrRE = /[\w-:]+(\=['"]([^=-]*)['"]){0,1}/g;
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

  tag.match(attrRE).forEach((attr, index) => {
    if (index === 0) {
      if (voidElementList.indexOf(attr) !== -1 || tag.charAt(tag.length - 2) === '/') vNodeOptions.voidElement = true;
      vNodeOptions.tagName = attr;
    } else {
      const name = attr.split('=')[0];
      const _value = attr.split('=')[1];
      const value = attr.split('=')[1] ? _value.substr(0, _value.length - 1).substr(1) : null;
      let type = 'attribute';
      if (name.indexOf('nv-') === 0) type = 'nv-attribute';
      if (name.indexOf('nv-on:') === 0) type = 'nv-event';
      if (directives.indexOf(name) !== -1 && /^\{[^{}]*\}$/.test(value)) type = 'directive';
      if (directives.indexOf(name) === -1 && /^\{[^{}]*\}$/.test(value)) type = 'prop';
      vNodeOptions.attributes.push({ name, value, type });
    }
  });

  return new Vnode(vNodeOptions);
}
