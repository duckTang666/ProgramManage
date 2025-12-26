/**
 * 存储配置
 * 统一管理所有存储桶相关的配置
 */

// 新的 Supabase 存储桶基础 URL
export const STORAGE_BASE_URL = 'https://onest.selfroom.top/project/default/storage/files';
export const STORAGE_PUBLIC_URL = 'https://onest.selfroom.top/project/default/storage/files/public';

// Supabase 数据库 URL
export const SUPABASE_URL = 'https://onest.selfroom.top/';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

// 存储桶配置
export const BUCKET_CONFIGS = {
  // 图片存储桶
  'new-images': {
    name: 'new-images',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  'news-images': {
    name: 'news-images',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  'achievement-images': {
    name: 'achievement-images',
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  // 视频存储桶
  'achievement-videos': {
    name: 'achievement-videos',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  },
  // 文档存储桶
  'achievement_attachments': {
    name: 'achievement_attachments',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  // 轮播图存储桶
  'banners': {
    name: 'banners',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
} as const;

// 类型定义
export type BucketName = keyof typeof BUCKET_CONFIGS;

/**
 * 获取存储桶配置
 * @param bucketName 存储桶名称
 * @returns 存储桶配置
 */
export const getBucketConfig = (bucketName: BucketName) => {
  return BUCKET_CONFIGS[bucketName];
};

/**
 * 获取文件上传URL
 * @param filePath 文件路径
 * @returns 上传URL
 */
export const getUploadUrl = (filePath: string) => {
  return `${STORAGE_BASE_URL}/${filePath}`;
};

/**
 * 获取文件公共访问URL
 * @param filePath 文件路径
 * @returns 公共访问URL
 */
export const getPublicUrl = (filePath: string) => {
  return `${STORAGE_PUBLIC_URL}/${filePath}`;
};

/**
 * 验证文件是否符合存储桶要求
 * @param file 文件对象
 * @param bucketName 存储桶名称
 * @returns 验证结果
 */
export const validateFileForBucket = (file: File, bucketName: BucketName) => {
  const config = getBucketConfig(bucketName);
  
  if (!config) {
    return {
      valid: false,
      error: `未知的存储桶: ${bucketName}`
    };
  }

  // 检查文件大小
  if (file.size > config.maxSize) {
    const maxSizeMB = config.maxSize / (1024 * 1024);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `文件过大: ${fileSizeMB}MB，最大允许: ${maxSizeMB}MB`
    };
  }

  // 检查文件类型
  if (!config.allowedTypes.includes(file.type as any)) {
    return {
      valid: false,
      error: `不支持的文件类型: ${file.type}，支持的类型: ${config.allowedTypes.join(', ')}`
    };
  }

  return {
    valid: true,
    error: null
  };
};

// 导出所有配置
export default {
  STORAGE_BASE_URL,
  STORAGE_PUBLIC_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  BUCKET_CONFIGS,
  getBucketConfig,
  getUploadUrl,
  getPublicUrl,
  validateFileForBucket,
};