const path = require('path');

import typescript from 'rollup-plugin-typescript2';
import { uglify } from "rollup-plugin-uglify";
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

import pkg from './package.json'

export default {
  // input: 'promise.ts',
  // output: [{
  //   file: 'promise2.js',
  //   format: 'cjs',
  // }, ],
  input: 'src/index.ts',
  output: [{
    file: pkg.main,
    format: 'cjs',
  }, ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
      rollupCommonJSResolveHack: true,
      tsconfig: "tsconfig.json",
    }),
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
    babel({
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              ie: '10',
            },
          }
        ]
      ],
      sourceMap: true,
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 2,
          }
        ]
      ],
      ignore: [
        /core-js/,
        /@babel\/runtime/
      ],
      runtimeHelpers: true,
    }),
    // uglify(),
  ],
}
