import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required. Please check your .env.local file.');
}

// 创建带有额外配置的Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'Accept': 'application/json',
    },
  },
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  // 添加请求重试配置
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        // 添加超时配置
        signal: AbortSignal.timeout(15000), // 15秒超时
      });
    },
  },
});

// 新闻分类表接口
export interface NewsCategory {
  id: string;
  name: string;
  created_at: string;
}

// 新闻表接口
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category_id: string;
  is_top: boolean;
  is_pinned: boolean;
  published_at: string;
  image_url: string;
}

// 新闻表单数据接口
export interface NewsFormData {
  title: string;
  content: string;
  category_id: string;
  image_url?: string;
  is_top?: boolean;
  is_pinned?: boolean;
}

console.log('Supabase client initialized:', supabaseUrl);