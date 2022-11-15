import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const config = {
    input: './src/index.ts',
    plugins: [
      typescript({
        compilerOptions: {
          module: 'es6',
          target: 'es5',
          importHelpers: false
        }
      })
  ],
    external: ['@raingauge/utils'],
    output: [
      {
        file: `./dist/umd/index.js`,
        format: 'umd',
        globals: {
          '@raingauge/utils': 'raingauge.utils'
        },
        name: 'raingauge.flow',
        sourcemap: true
      }
    ]
  };

if (process.env.NODE_ENV !== 'development') {
  config.output.push({
    file: `./dist/umd/index.min.js`,
    format: 'umd',
    globals: {
      '@raingauge/utils': 'raingauge.utils'
    },
    name: 'raingauge.flow',
    plugins: [terser()],
    sourcemap: true
  });
}

export default config;
