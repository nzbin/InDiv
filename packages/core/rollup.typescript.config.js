import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json'

export default {
  input: 'packages/core/index.ts',
  output: [{
    file: 'build/core/bundle.js',
    format: 'cjs',
  }, ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
      rollupCommonJSResolveHack: true,
      tsconfig: "packages/core/tsconfig.json",
    }),
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
  ],
}
