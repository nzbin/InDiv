import { parseTag, Vnode } from './parse-tag';

export type ParseOptions = {
  components: string[];
  directives: string[];
};

export function parseTemplateToVnode(template: string, options: ParseOptions = { components: [], directives: [] }): Vnode[] {

  const tagRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;

  const result: Vnode[] = [];
  let current: Vnode = null;
  let level = -1;
  const arr: Vnode[] = [];
  const byTag = {};
  let inComponent = false;

  template.replace(tagRegex, (tag: any, index: number): any => {
    if (inComponent) {
      if (tag !== ('</' + current.tagName + '>')) return;
      else inComponent = false;
    }

    const isOpen = tag.charAt(1) !== '/';
    const start = index + tag.length;
    const nextChar = template.charAt(start);
    let parent = null;

    if (isOpen) {
      level++;

      current = parseTag(tag, options.directives);
      if (current.type === 'tag' && options.components.indexOf(current.tagName) !== -1) {
        current.type = 'component';
        inComponent = true;
      }

      if (!current.voidElement && !inComponent && nextChar && nextChar !== '<' && !/^\s*$/.test(template.slice(start, template.indexOf('<', start)))) {
        current.childNodes.push({
          type: 'text',
          nodeValue: template.slice(start, template.indexOf('<', start)),
          parentVnode: current,
          template: template.slice(start, template.indexOf('<', start)),
        });
      }

      (byTag as any)[(current as any).tagName] = current;

      // if we're at root, push new base node
      if (level === 0) result.push(current);

      parent = arr[level - 1];

      if (parent && parent.tagName !== 'router-render') {
        current.parentVnode = parent;
        parent.childNodes.push(current);
      }

      arr[level] = current;
    }

    if (!isOpen || current.voidElement) {
      level--;
      if (!inComponent && nextChar !== '<' && nextChar) {
        // trailing text node
        // if we're at the root, push a base text node. otherwise add as
        // a child to the current node.
        // parent = level === -1 ? result : arr[level].childNodes;
        parent = level === -1 ? null : arr[level];
        
        // calculate correct end of the content slice in case there's
        // no tag after the text node.
        const end = template.indexOf('<', start);
        const nodeValue = template.slice(start, end === -1 ? undefined : end);
        // if a node is nothing but whitespace, no need to add it.
        if (!/^\s*$/.test(nodeValue) && !parent) result.push({
          type: 'text',
          nodeValue: nodeValue,
          parentVnode: parent,
          template: nodeValue,
        });
        if (!/^\s*$/.test(nodeValue) && parent && parent.tagName !== 'router-render') arr[level].childNodes.push({
          type: 'text',
          nodeValue: nodeValue,
          parentVnode: parent,
          template: nodeValue,
        });
      }
    }
    return null;
  });

  return result;
}

const aaa = (`
  <div>
    <input nv-model="test.a" nv-on:click="show(test)" />
    <p test-directive="{'123'}" nv-id="232" nv-if="countState(a)" nv-on:click="changeInput()">{{a}}</p>
    <test-component nv-repeat="let man in testArray" nv-key="man.name" man="{countState(man.name)}" nv-if="a"></test-component>
    <p nv-on:click="go()">container: {{countState(color)}}</p>
    <input nv-model="a" />
    <div nv-repeat="let man in testArray" nv-key="man.name">
        <div nv-on:click="show(testArray2, '你111')">姓名：{{man.name}}</div>
        <div>性别：{{countState(man.sex, $index)}}</div>
        <a nv-href="countState(man.sex, $index)">a {{man.sex}}</a>
        <img nv-src="man.sex" nv-alt="man.sex" />
        <test-component nv-key="man.name" man="{countState(man.name)}"></test-component>
        <input nv-on:click="show(b, $index)" nv-repeat="let b in testArray2" nv-on:input="showInput($event, $index)" nv-text="b" nv-class="b" />
        <input nv-model="test.a"/>
        <div class="fuck" nv-repeat="let c in man.job" nv-key="c.id">
          <input nv-on:click="show(c, $index)" nv-model="c.name" nv-class="c.id" />
        </div>
    </div>
    <router-render></router-render>
  </div>
`);
console.log(55555555, aaa, parseTemplateToVnode(aaa));
