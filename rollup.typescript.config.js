const path = require('path');

import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [{
    file: 'build/bundle.js',
    format: 'cjs',
    // exports: 'named',
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
  ],
}
