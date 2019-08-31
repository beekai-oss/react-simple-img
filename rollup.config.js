import flow from 'rollup-plugin-flow';
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';

const plugins = [
  flow({
    pretty: true,
  }),
  babel({
    exclude: 'node_modules/**',
  }),
  copy({
    targets: [{ src: 'src/index.d.ts', dest: 'lib' }],
  }),
];

export default {
  input: 'src/index.js',
  plugins,
  external: ['react', 'react-simple-animate'],
  output: {
    file: 'lib/index.js',
    format: 'cjs',
  },
};
