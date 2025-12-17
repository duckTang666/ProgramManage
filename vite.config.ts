// @ts-nocheck

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [],
  server: {
    allowedHosts: true,
    hmr: {
      path: '/ws',
    }
  },
  // 配置为 Hash 路由模式提供支持
  base: mode === 'production' ? './' : '/'
}));
