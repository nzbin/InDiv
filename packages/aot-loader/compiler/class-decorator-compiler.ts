export function classDecoratorCompiler(content: string, body: any, parseVnodeOptions: { components: string[], directives: string[] }, componentMap: Map<string, { templateString: string; classBody: any; }>): void {
  if (body.decorators) {
    body.decorators.forEach((decorator: any) => {
      if (decorator.expression && decorator.expression.callee && decorator.expression.callee.name === 'Component') {
        if (decorator.expression.arguments) {
          decorator.expression.arguments.forEach((argument: any) => {
            const selectorProperty: any = argument.properties.find((property: any) => property.key.name === 'selector');
            const templateProperty: any = argument.properties.find((property: any) => property.key.name === 'template');
            let selector: string;
            let templateString: string;
            // build selector
            if (selectorProperty && selectorProperty.value && selectorProperty.value.value) {
              selector = selectorProperty.value.value;
              parseVnodeOptions.components.push(selector);
            }
            // build template
            if (templateProperty && templateProperty.value && selector) {
              templateString = content.slice(templateProperty.value.start, templateProperty.value.end);
              componentMap.set(selector, {
                templateString,
                classBody: body,
              });
            }
          });
        }
      }
      if (decorator.expression && decorator.expression.callee && decorator.expression.callee.name === 'Directive') {
        if (decorator.expression.arguments) {
          decorator.expression.arguments.forEach((argument: any) => {
            argument.properties.forEach((property: any) => {
              if (property.key.name === 'selector') parseVnodeOptions.directives.push(property.value.value);
            });
          });
        }
      }
    });
  }
}
