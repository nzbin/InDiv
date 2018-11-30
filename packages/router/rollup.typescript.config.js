import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json'

export default {
  input: 'packages/router/index.ts',
  output: [{
    file: 'build/router/bundle.js',
    format: 'cjs',
  }, ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
      rollupCommonJSResolveHack: true,
      tsconfig: "packages/router/tsconfig.json",
    }),
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
  ],
}
