import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
export default {
    input: './src/index.js',
    output: [
      {
        file: './dist/lib-umd.js',
        format: 'umd',
        name: 'myLib',
      },
      {
        file: './dist/lib-es.js',
        format: 'es',
        sourcemap:true,
        
      },
      {
        file: './dist/lib-cjs.js',
        format: 'cjs',
      },
      {
        file: './dist/lib-system.js',
        format: 'system',
      },
      {
        file: './dist/lib-iife.js',
        format: 'iife',
      },
      {
        file: './dist/lib-amd.js',
        format: 'amd',
      },
    ],
    // 插件配置在这里
    plugin:[
      babel({
          exclude: 'node_modules/**' // 排除node_modules所有文件
      }),
      resolve()
    ]
  };
  
  