import { Parser } from 'htmlparser2';

function createVNode(name: any, attrs: any, proto: any) {
  proto.name = name;
  proto.id = attrs.id || '';
  proto.class = attrs.class ? attrs.class.split(' ') : [];
  proto.attrs = attrs;
  return proto;
}
// todo string to Vnode
const parser = new Parser({
  onopentag: (name, attributes) => {
    console.log(111, 'onopentag', name, attributes);
    // createVNode
  },
  // onopentagname: (name) => {
  //   console.log(222, 'onopentagname', name);
  // },
  // onattribute: (name, value) => {
  //   console.log(333, 'onattribute', name, value);
  // },
  ontext: (text) => {
    if (!text.trim()) return;
    const content = text.replace(/\s+/g, ' ');
    console.log(444, 'ontext', content);
  },
  onclosetag: (name) => {
    console.log(5555, 'onclosetag', name);
  },
  // onprocessinginstruction( name, data);
  // oncomment( data);
  // oncommentend();
  // oncdatastart();
  // oncdataend();
  // onerror( error);
  // onreset();
  // onend(),
});

const a  = (`
<div nv-on:click="aaa()">
  <p>
    <span>1111</span>
  </p>
  <input nv-model="ada" />
</div>
`);
parser.parseChunk(a);
parser.done();
// console.log(3231312312, parse(a));

export function parseStringToVnode(parseString: string): any {
  // const vnode: any = {};
  // // const childNodes: Vnode[] = [];
  // const openTag = parseString.match(/(\<[^\<,\>,\/]+\>|\<[^\<,\>]+\/\>)/g);
  // const closeTag = parseString.match(/\<\/[^\<,\>]+\>/g);
  // // const selfCloseTag = parseString.match(/\<[^\<,\>]+\/\>/g);
  // console.log(99888777, openTag, closeTag);
  // openTag.forEach((open, index) => {
  //   if (index === 0) {
  //     vnode.tag = closeTag.;
  //   }
  // });
}
//
// const dada  = parseStringToVnode(a);
