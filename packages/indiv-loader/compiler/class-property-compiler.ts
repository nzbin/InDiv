import recast from 'recast';

/**
 * add template in class
 *
 * @export
 * @param {{ templateString: string; classBody: any }} templateInfo
 * @param {boolean} useTypeScript
 */
export function classPropertyCompiler(templateInfo: { templateString: string; classBody: any }, useTypeScript: boolean): void {
  const typeAnnotation = useTypeScript ? recast.types.builders.typeAnnotation(
    recast.types.builders.genericTypeAnnotation(recast.types.builders.identifier('string'), null),
  ) : null;
  templateInfo.classBody.body.body.push(recast.types.builders.classProperty(
    recast.types.builders.identifier('template'),
    recast.types.builders.identifier(`\`${templateInfo.templateString}\``),
    typeAnnotation,
  ));
}
