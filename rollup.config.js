/* eslint-disable @typescript-eslint/no-var-requires */

const nodeResolve = require('@rollup/plugin-node-resolve').default;
const { terser } = require('rollup-plugin-terser');
const typescript = require('rollup-plugin-typescript2');

const esbuild = require('rollup-plugin-esbuild').default;
const json = require('@rollup/plugin-json').default;
const pkg = require('./package.json');

const EXTENSIONS = ['.js'];

const makeExternalPredicate = externalArr => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return id => pattern.test(id);
};

module.exports = {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    dir: 'dist',
    format: 'cjs',
    indent: false,
  },
  external: makeExternalPredicate([...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]),
  plugins: [
    terser(),
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve({
      extensions: EXTENSIONS,
    }),
    esbuild(),
    json(),
  ],
};
