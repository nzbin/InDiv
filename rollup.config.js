import typescript from 'rollup-plugin-typescript2';
import { uglify } from "rollup-plugin-uglify";
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [{
    file: pkg.main,
    format: 'cjs',
  }, ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
    uglify(),
  ],
}
