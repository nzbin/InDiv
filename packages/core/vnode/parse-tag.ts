export type TNvAttribute = 'attribute' | 'nv-attribute' | 'directive' | 'prop' | 'nv-event';

export type TEventType = { type: string; handler: Function, token: any };

export type TAttributes = {
  name: string;
  value: string;
  type: TNvAttribute;
  nvValue?: any;
};

export interface IPatchList {
  type?: number;
  nativeElement?: any;
  parentVnode?: Vnode;
  newIndex?: number;
  oldIndex?: number;
  oldValue?: TAttributes | string | number | boolean | Function;
  originVnode?: Vnode;
  changedVnode?: Vnode;
  changedValue?: TAttributes | string | number | boolean | Function | TEventType;
  attributeType?: TNvAttribute;
}

/**
 * Vnode for diff
 *
 * @class Vnode
 */
export class Vnode {
  public tagName?: string;
  public nativeElement?: any;
  public parentVnode?: Vnode;
  public attributes?: TAttributes[];
  public nodeValue?: string | null;
  public childNodes?: Vnode[];
  public type?: string;
  public value?: string | number;
  public repeatData?: any;
  public eventTypes?: TEventType[] = [];
  public key?: any;
  public checked?: boolean;
  public voidElement?: boolean = false;
  public template?: string;

  /**
   * Creates an instance of Vnode.
   * @param {Vnode} options
   * @memberof Vnode
   */
  constructor(options: Vnode) {
    this.tagName = options.tagName;
    this.nativeElement = options.nativeElement;
    this.parentVnode = options.parentVnode;
    this.attributes = [];
    this.childNodes = [];
    this.nodeValue = options.nodeValue;
    this.type = options.type;
    this.value = options.value;
    this.repeatData = { ...options.repeatData };
    this.eventTypes = [];
    this.key = options.key;
    this.checked = false;
    this.voidElement = options.voidElement;
    this.template = options.template;

    if (options.attributes && options.attributes.length > 0) {
      options.attributes.forEach(attr => {
        this.attributes.push({...attr});
      });
    }

    if (options.eventTypes && options.eventTypes.length > 0) {
      options.eventTypes.forEach(eventType => {
        this.eventTypes.push({...eventType});
      });
    }
  
    if (options.childNodes && options.childNodes.length > 0) {
      options.childNodes.forEach(child => {
        this.childNodes.push(new Vnode({ ...child }));
      });
    }
  }
}

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
