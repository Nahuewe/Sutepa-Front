// import reactRefresh from "@vitejs/plugin-react-refresh";
import path from 'path'
import rollupReplace from '@rollup/plugin-replace'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        // "@": path.resolve(__dirname, "./src"),
        find: '@',
        replacement: path.resolve(__dirname, './src')
      }
    ]
  },

  plugins: [
    rollupReplace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(true),
        'process.env.NODE_ENV': JSON.stringify('development')
      }
    }),
    react()
    // reactRefresh(),
  ]
})
