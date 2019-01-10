import flow from 'rollup-plugin-flow';
import babel from 'rollup-plugin-babel';

const plugins = [
  flow({
    pretty: true,
  }),
  babel({
    exclude: 'node_modules/**',
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
