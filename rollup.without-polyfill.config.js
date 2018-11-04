import { uglify } from "rollup-plugin-uglify";
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

import pkg from './package.json'

export default {
  input: 'build/bundle.js',
  output: [{
    file: 'build/without-polyfill/index.js',
    format: 'cjs',
    exports: 'named',
  }, ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
  ],
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
    babel({
      presets: [
        '@babel/preset-env',
      ],
      ignore: [
        /core-js/,
        /@babel\/runtime/
      ],
    }),
    uglify(),
  ],
}
