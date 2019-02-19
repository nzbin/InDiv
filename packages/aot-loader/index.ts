import { getOptions } from 'loader-utils';
import { loader } from 'webpack';
import recast from 'recast';
import typescriptParser from 'recast/parsers/typescript';
import { templateCompiler } from './compiler/template-compiler';
import { classDecoratorCompiler } from './compiler/class-decorator-compiler';
import { classPropertyCompiler } from './compiler/class-property-compiler';

export default function loader(source: string): string {
  const that: loader.LoaderContext = this;
  const content = source.replace(/\n/g, ' ');
  const parseVnodeOptions: {
    components: string[],
    directives: string[],
  } = {
    components: [],
    directives: [],
  };
  const componentMap = new Map<string, { templateString: string; classBody: any }>();
  const options = getOptions(that);
  let ast;
  try {
    ast = recast.parse(content, {
      parser: typescriptParser,
    });
    ast.program.body.forEach((body: any, index: number) => {
      if (body.type === 'ClassDeclaration') classDecoratorCompiler(content, body, parseVnodeOptions, componentMap);
    });
  } catch (e) {
    console.error(1111111111, e);
  }
  componentMap.forEach((templateInfo, selector) => {
    const vnodes = templateCompiler(templateInfo.templateString, parseVnodeOptions);
    classPropertyCompiler(templateInfo.classBody, vnodes, content);
  });
  console.log(8888888888, recast.print(ast).code);
  return content;
}
