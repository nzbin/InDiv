import { IVnode, TAttributes } from '../../types';

/**
 * Vnode
 *
 * @class Vnode
 */
class Vnode {
  public tagName?: string;
  public node?: DocumentFragment | Element;
  public parentNode?: Node;
  public attributes?: TAttributes[];
  public nodeValue?: string | null;
  public childNodes?: IVnode[] | any[];
  public type?: string;
  public value?: string | number;
  public repeatData?: any;
  public eventTypes?: string;
  public key?: any;
  public checked?: boolean;

  /**
   * Creates an instance of Vnode.
   * @param {IVnode} info
   * @memberof Vnode
   */
  constructor(info: IVnode) {
    this.tagName = info.tagName;
    this.node = info.node;
    this.parentNode = info.parentNode;
    this.attributes = info.attributes;
    this.childNodes = info.childNodes;
    this.nodeValue = info.nodeValue;
    this.type = info.type;
    this.value = info.value;
    this.repeatData = info.repeatData;
    this.eventTypes = info.eventTypes;
    this.key = info.key;
    this.checked = false;
  }
}

/**
 * bind nodeType and return type
 *
 * @param {Node} node
 * @returns {string}
 */
function bindNodeType(node: Node): string {
  if (node.nodeType === 1) return 'element';
  if (node.nodeType === 3) return 'text';
  if (node.nodeType === 11) return 'document-fragment';
  return '';
}

/**
 * bind node attributes and return TAttributes
 *
 * @param {(DocumentFragment | Element)} node
 * @param {((node: DocumentFragment | Element) => string[])} [shouldDiffAttributes]
 * @returns {TAttributes[]}
 */
function bindAttributes(node: DocumentFragment | Element, shouldDiffAttributes?: (node: DocumentFragment | Element) => string[]): TAttributes[] {
  const nodeAttrs: NamedNodeMap = (node as Element).attributes;
  const attributes: TAttributes[] = [];
  const shouldDiffAttr = shouldDiffAttributes ? shouldDiffAttributes(node) : null;
  if (nodeAttrs) {
    Array.from(nodeAttrs).forEach(attr => {
      if (shouldDiffAttr && shouldDiffAttr.indexOf(attr.name) === -1) return;
      attributes.push({
        name: attr.name,
        value: attr.value,
      });
    });
  }
  return attributes;
}

/**
 * parse node to VNode
 *
 * @export
 * @param {(DocumentFragment | Element)} node
 * @param {((node: DocumentFragment | Element) => string[])} [shouldDiffAttributes]
 * @returns {IVnode}
 */
export function parseToVnode(node: DocumentFragment | Element, shouldDiffAttributes?: (node: DocumentFragment | Element) => string[]): IVnode {
  const childNodes: IVnode[] = [];
  if (node.childNodes) {
    Array.from(node.childNodes).forEach((child: Element) => {
      childNodes.push(parseToVnode(child, shouldDiffAttributes));
    });
  }
  return new Vnode({
    tagName: (node as Element).tagName,
    node: node,
    parentNode: node.parentNode,
    attributes: bindAttributes(node, shouldDiffAttributes),
    childNodes,
    nodeValue: node.nodeValue,
    type: bindNodeType(node),
    value: (node as Element).value,
    repeatData: node.repeatData ? node.repeatData : null,
    eventTypes: node.eventTypes ? node.eventTypes : null,
    key: node.indiv_repeat_key ? node.indiv_repeat_key : null,
  });
}
