import recast from 'recast';

/**
 * add template in class
 *
 * @export
 * @param {{ templateString: string; classBody: any }} templateInfo
 * @param {string} content
 */
export function classPropertyCompiler(templateInfo: { templateString: string; classBody: any }, content: string): void {
  templateInfo.classBody.body.body.push(recast.types.builders.classProperty(
    recast.types.builders.identifier('template'),
    recast.types.builders.identifier(`\`${templateInfo.templateString}\``),
    recast.types.builders.typeAnnotation(
      recast.types.builders.genericTypeAnnotation(recast.types.builders.identifier('string'), null),
    )));
}
