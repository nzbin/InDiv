import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: {
    name: 'index',
    file: 'test.js',
    format: 'cjs'
  },
  plugins: [
    typescript({module: 'commonjs'}),
    commonjs({extensions: ['.js', '.ts']}),
  ]
};
