/**
 * compile class decorator and find Component and Directive
 *
 * @export
 * @param {string} rootPath
 * @param {*} body
 * @param {{ components: string[], directives: string[] }} parseVnodeOptions
 * @param {Map<string, { templateString: string; classBody: any; }>} componentMap
 */
export declare function classDecoratorCompiler(rootPath: string, body: any, parseVnodeOptions: {
    components: string[];
    directives: string[];
}, componentMap: Map<string, {
    templateString: string;
    classBody: any;
}>): void;
