import { Vnode } from "@indiv/core";
import recast from 'recast';

export function classPropertyCompiler(body: any, vnodes: Vnode[], content: string): void {
  body.body.body.push(recast.types.builders.classProperty(
    recast.types.builders.identifier('foo'),
    recast.types.builders.identifier('Bar'),
    // toto 声明数组
    // recast.types.builders.classPropertyDefinition(),
    recast.types.builders.typeAnnotation(
      recast.types.builders.genericTypeAnnotation(recast.types.builders.identifier('Vnode[]'), null),
    )));
}
