// import { getOptions } from 'loader-utils';
import { loader } from 'webpack';
import recast from 'recast';
import typescriptParser from 'recast/parsers/typescript';
import { classDecoratorCompiler, classPropertyCompiler } from './compiler';

/**
 * indiv loader for webpack
 *
 * @export
 * @param {string} source
 * @returns {string}
 */
export default function indivLoader(source: string): string {
  const that: loader.LoaderContext = this;
  const rootPath: string = that.context;
  const parseVnodeOptions: {
    components: string[],
    directives: string[],
  } = {
    components: [],
    directives: [],
  };
  const componentMap = new Map<string, { templateString: string; classBody: any }>();
  // const options = getOptions(that);

  // build templateUrl from Decorator
  let ast;
  try {
    ast = recast.parse(source, {
      parser: typescriptParser,
    });
    ast.program.body.forEach((body: any) => {
      if (body.type === 'ClassDeclaration') classDecoratorCompiler(rootPath, body, parseVnodeOptions, componentMap);
      if (body.type === 'ExportNamedDeclaration' || body.type === 'ExportDefaultDeclaration') {
        if (body.declaration) classDecoratorCompiler(rootPath, body.declaration, parseVnodeOptions, componentMap);
      }
    });
  } catch (e) {
    that.emitError(e);
    console.error('indiv-loader compile error: ', e);
  }

  // build ast with templateUrl
  componentMap.forEach((templateInfo) => {
    classPropertyCompiler(templateInfo, source);
  });

  return recast.print(ast).code;
}
