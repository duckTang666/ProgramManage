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
    },
    proxy: {
      // 代理本地API请求
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      // 代理Supabase REST API请求
      '/rest/v1': {
        target: 'https://onest.selfroom.top',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/rest\/v1/, '/rest/v1'),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
        }
      },
      // 代理Supabase认证请求
      '/auth/v1': {
        target: 'https://onest.selfroom.top',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/auth\/v1/, '/auth/v1'),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
        }
      },
      // 代理Supabase存储请求 - 增强配置以支持大视频文件上传
      '/storage/v1': {
        target: 'https://onest.selfroom.top',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/storage\/v1/, '/storage/v1'),
        timeout: 600000, // 10分钟超时，支持超大视频文件上传
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With, x-uploaded-on',
          'Connection': 'keep-alive'
        }
      }
    }
  },
  // 配置为 Hash 路由模式提供支持
  base: mode === 'production' ? './' : '/'
}));
