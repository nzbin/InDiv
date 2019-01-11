export const templateInfo = () => [
  {
    h1: '模板语法',
    p: [
      '从使用模型-视图-控制器 (MVC) 或模型-视图-视图模型 (MVVM) 的经验中，很多开发人员都熟悉了组件和模板这两个概念。',
      '在 InDiv 中，组件扮演着控制器或视图模型的角色，模板则扮演视图的角色。',
      '模板很像字符串的HTML，但是它还包含 InDiv 的模板语法，这些模板语法可以根据你的应用逻辑、应用状态和 DOM 数据来修改这些 HTML。',
      '你的模板可以使用数据绑定来协调应用和 DOM 中的数据，把程序逻辑应用到要显示的内容上。',
      'InDiv 模板指令使用 nv- 开头，下面介绍一下 InDiv 的模板语法。',
      '1. 拥有特殊渲染方法的指令有 nv-model nv-text nv-html nv-if nv-class nv-repeat nv-key nv-on:Event。',
      '2. 如果属性可以通过 Element.attribute = value来设置的话，也可以使用 nv-attribute 来使用。例如：nv-src nv-href nv-alt',
      '3. 内置指令接收2种：',
      '(1) xxx(指代this.state.xxx) 和 nv-repeat被循环的itme值：nv-text="text" nv-text="repeatData.text"',
      '(2) （其实就是filter）除 nv-on:Event 和 nv-model 外，其他指令可以接收 @开头 加 组件实例上带返回值的方法 ，参数可以使用事件指令中除了$event之外的参数，指令的值渲染为方法返回值：nv-text="@bindText(text, $index, $element)"',
    ],
    info: [
      {
        title: '1. 事件指令',
        p: [
          '以 nv-on:event 开头, event 为未加on的事件名， 指令值为 @开头 加 组件实例上的方法',
          '例如：nv-on:click="@goTo()"',
          '方法可使用参数：',
        ],
        pchild: [
          `- Element => $element`,
          `- event => $event`,
          `- string => '1','2','3'`,
          ` - number => 1,2,3`,
          ` - index > $index`,
          `- 变量: 仅能传递state上的值， 通过 xxx 标示`,
          `- repeat value: 传递nv-repeat='let item in array'的item值，如： nv-on:click="@show(nav)" nv-repeat="let nav in navList" nv-key="nav.id"`,
        ],
        code: `
  <a class="nav" nv-on:click="@goTo($event, $index, 1, 'state', nav.to)">{{nav.name}}</a>

  public goTo(event: Event, index: number, aa: number, s: string, to: string) {
    this.$setLocation(to);
  }
 `,
      },
      {
        title: '2. text 指令',
        p: [
          '该指令可直接渲染为标签内的文字，或 <input> 的 value。',
        ],
        pchild: [
          '可以使用 nv-text 也可以使用模板语法 {{}}。',
        ],
        code: `
  <p nv-text="b"></p>
  <p nv-text="@returnValue(b)"></p>
  <p>{{b}}</p>
  <p>{{@returnValue(b)}}</p>
 `,
      },
      {
        title: '3. html 指令',
        p: [
          '该指令可直接渲染为标签内的 HTML，内部实现相当于 innerHTML。',
        ],
        pchild: [
          '可以使用 nv-html。',
        ],
        code: `
  <p nv-html="b"></p>
  <p nv-html="@returnValue(b)"></p>
 `,
      },
      {
        title: '4. model 指令',
        p: [
          '此指令等同于 nv-text 和 nv-on:input 同时使用',
        ],
        pchild: [
          '仅仅可以对 <input> 使用 nv-model, model会主动更新被绑定的值并更新视图。',
        ],
        code: `
  <input nv-model="c"/>
 `,
      },
      {
        title: '5. class 指令',
        p: [
          '指令会主动把被绑定的值作为 className 增加到元素的class中。',
        ],
        pchild: [
          '使用 nv-class。',
        ],
        code: `
  <input nv-class="d"/>
  <input nv-class="@returnValue(d)"/>
 `,
      },
      {
        title: '6. if 指令',
        p: [
          '如果被绑定的值被 javascript 判定为 true/false，将分别在DOM树中显示或移除。',
        ],
        pchild: [
          '使用 nv-if。',
        ],
        code: `
  <input nv-if="e"/>
  <input nv-if="@returnValue(e)"/>
 `,
      },
      {
        title: '7. repeat 指令',
        p: [
          'repeat 是一个重复器指令 —— 自定义数据显示的一种方式。',
          '你的目标是展示一个由多个条目组成的列表。',
          '首先定义了一个 HTML 块，它规定了单个条目应该如何显示。',
          '再告诉 InDiv 把这个块当做模板，渲染列表中的每个条目。',
          '该指令可以搭配 nv-key 指令使用提高渲染性能。',
        ],
        pchild: [
          '使用 nv-repeat="let item in Array"语法, Array只能为其他被repeat值或组件实例state上的数组。',
          '可以通过 let item in Array 的语法定义 nv-repeat 指令，在元素本身或子元素可以直接使用 item 作为值。',
          '此指令十分耗费性能，不建议多用，并且建议搭配 nv-key 使用。',
        ],
        code: `
  <div nv-class="li.class" nv-repeat="let li in arrayList" nv-key="li.id">
    <input nv-model="l.value" nv-repeat="let l in li" nv-key="l.id"/>
    <demo-component value="{l}" nv-key="li.id"></demo-component>
  </div>
 `,
      },
      {
        title: '8. key 指令',
        p: [
          '搭配 repeat 指令使用，为每个被 repeat 的元素指定一个唯一的值',
          '该指令会提高 repeat 指令的渲染性能，',
          '每次虚拟DOM更新时会优先匹配 tagName 和 key 都相同的虚拟DOM。',
        ],
        pchild: [
          'nv-key 的值必须在 同级且同标签名的元素 中为唯一值',
          '建议如果对 自定义组件的父元素 或 自定义组件本身 使用 nv-repeat，尽量加上 nv-key 指令来避免重复创建组件实例，并保存组件内部状态。',
        ],
        code: `
  <div nv-class="li.class" nv-repeat="let li in arrayList" nv-key="li.id">
    <input nv-model="l.value" nv-repeat="let l in li" nv-key="l.id"/>
    <demo-component value="{l}" nv-key="li.id"></demo-component>
  </div>
 `,
      },
      {
        title: '9. 其他指令',
        p: [
          '如果属性可以通过 Element.attribute = value来设置的话，也可以使用 nv-attribute 来使用。',
        ],
        pchild: [
          '例如：nv-src nv-href nv-alt等',
        ],
        code: `
  <img nv-src="src" nv-alt="alt"/>
  <img nv-src="@return(src)" nv-alt="@return(alt)"/>
 `,
      },
    ],
  },
];
