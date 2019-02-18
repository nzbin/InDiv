import { getOptions } from 'loader-utils';
import { loader } from 'webpack';

export default function loader(source: loader.LoaderContext): loader.LoaderContext {
  const options = getOptions(this);

  // source = source.replace(/\[name\]/g, options.name);

  // return `export default ${ JSON.stringify(source) }`;
  // console.log(999999999111111, source);
  console.log(222222222, this);
  return source;
}
