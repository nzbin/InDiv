class Vnode {
  constructor(info) {
    this.tagName = info.tagName;
    this.node = info.node;
    this.parentNode = info.parentNode;
    this.attributes = info.attributes;
    this.childNodes = info.childNodes;
    this.nodeValue = info.nodeValue;
    this.type = info.type;
  }
}

function bindNodeType(node) {
  if (node.nodeType === 1) return 'element';
  if (node.nodeType === 3) return 'text';
  if (node.nodeType === 11) return 'document-fragment';
  return '';
}

function bindAttributes(node) {
  const nodeAttrs = node.attributes;
  const attributes = [];
  if (nodeAttrs) {
    Array.from(nodeAttrs).forEach(attr => {
      attributes.push({
        name: attr.name,
        value: attr.value,
      });
    });
  }
  return attributes;
}

function parseToVnode(node) {
  const childNodes = [];
  if (node.childNodes) {
    Array.from(node.childNodes).forEach(child => {
      childNodes.push(parseToVnode(child));
    });
  }
  return new Vnode({
    tagName: node.tagName,
    node: node,
    parentNode: node.parentNode,
    attributes: bindAttributes(node),
    childNodes,
    nodeValue: node.nodeValue,
    type: bindNodeType(node),
  });
}

function diffAttributes(oldVnode, newVnode, patchList) {
  newVnode.attributes.forEach((attr) => {
    const oldVnodeAttr = oldVnode.attributes.find(at => at.name === attr.name);
    if (!oldVnodeAttr || oldVnodeAttr.value !== attr.value) {
      patchList.push({
        type: 3,
        node: oldVnode.node,
        newValue: attr,
        oldValue: oldVnodeAttr,
      });
    }
  });
  oldVnode.attributes.forEach((attr) => {
    const newVnodeAttr = newVnode.attributes.find(at => at.name === attr.name);
    if (!newVnodeAttr) {
      patchList.push({
        type: 4,
        node: oldVnode.node,
        oldValue: attr,
      });
    }
  });
}

function diffNodeValue(oldVnode, newVnode, patchList) {
  if (!oldVnode.nodeValue || !newVnode.nodeValue) return;
  if (oldVnode.nodeValue !== newVnode.nodeValue) {
    patchList.push({
      type: 5,
      node: oldVnode.node,
      newValue: newVnode.nodeValue,
      oldValue: oldVnode.nodeValue,
    });
  }
}

function diffTagName(oldVnode, newVnode, patchList) {
  if (oldVnode.tagName !== newVnode.tagName) {
    patchList.push({
      type: 0,
      newNode: newVnode.node,
      oldVnode: oldVnode.node,
      parentNode: oldVnode.parentNode,
    });
  }
}

function diffChildNodes(newVnode, oldVnode, patchList) {
  if (newVnode.childNodes.length > 0) {
    newVnode.childNodes.forEach((nChild, index) => {
      if (!oldVnode.childNodes[index]) {
        patchList.push({
          type: 1,
          newNode: nChild.node,
          parentNode: oldVnode.node,
        });
      } else {
        diffVnode(oldVnode.childNodes[index], nChild, patchList);
      }
    });
  }
  if (oldVnode.childNodes.length > 0) {
    oldVnode.childNodes.forEach((oChild, index) => {
      if (!newVnode.childNodes[index]) {
        patchList.push({
          type: 2,
          node: oChild.node,
          parentNode: oldVnode.node,
        });
      }
    });
  }
}

function diffVnode(oldVnode, newVnode, patchList) {
  if (!patchList) {
    console.error('patchList can not be null, diffVnode must need an Array');
    return;
  }

  if (newVnode.type === 'document-fragment') {
    diffChildNodes(newVnode, oldVnode, patchList);
    return;
  }

  if (newVnode.node.isEqualNode(oldVnode.node)) return;
  if (oldVnode.tagName !== newVnode.tagName) {
    diffTagName(oldVnode, newVnode, patchList);
    return;
  }
  diffAttributes(oldVnode, newVnode, patchList);
  diffNodeValue(oldVnode, newVnode, patchList);
  diffChildNodes(newVnode, oldVnode, patchList);
}

/**
 * REMOVETAG: 0, 替换dom: 0
 * ADDTAG: 1, 增加dom: 1
 * REMOVETAG: 2, 增加dom: 2
 * ADDATTRIBUTES: 3, 增加属性: 3
 * REPLACEATTRIBUTES: 4, 移除属性: 4
 * TEXT: 5, 更改文字: 5
 * @param [] patchList
 */
function renderVnode(patchList) {
  console.log('patchListpatchList', patchList);
  patchList.forEach(patch => {
    switch (patch.type) {
    case 0:
      patch.parentNode.replaceChild(patch.newNode, patch.oldVnode);
      break;
    case 1:
      patch.parentNode.appendChild(patch.newNode);
      break;
    case 2:
      patch.parentNode.removeChild(patch.node);
      break;
    case 3:
      patch.node.setAttribute(patch.newValue.name, patch.newValue.value);
      break;
    case 4:
      patch.node.removeAttribute(patch.newValue.name);
      break;
    case 5:
      patch.node.nodeValue = patch.newValue;
      break;
    }
  });
}

const VirtualDOM = {
  parseToVnode,
  diffVnode,
  renderVnode,
};

export default VirtualDOM;
