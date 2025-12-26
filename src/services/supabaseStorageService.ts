import { supabase } from '../lib/supabase';

export interface StorageFile {
  name: string;
  id?: string;
  created_at?: string;
  updated_at?: string;
  last_accessed_at?: string;
  size?: number;
  etag?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * 视频预处理和验证
 * @param file 原始视频文件
 * @param maxSize 最大文件大小（字节）
 * @returns 处理结果
 */
const preprocessVideoFile = async (file: File, maxSize: number = 100 * 1024 * 1024): Promise<{ 
  valid: boolean; 
  file?: File; 
  message?: string; 
  originalSize: number; 
  suggestedSize: number;
}> => {
  const originalSize = file.size;
  const suggestedSize = Math.min(maxSize, 50 * 1024 * 1024); // 建议不超过50MB
  
  console.log('🎬 视频预处理开始:', {
    原始大小: `${(originalSize / 1024 / 1024).toFixed(2)}MB`,
    最大限制: `${(maxSize / 1024 / 1024).toFixed(2)}MB`,
    建议大小: `${(suggestedSize / 1024 / 1024).toFixed(2)}MB`
  });
  
  // 验证视频格式
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  if (!allowedVideoTypes.includes(file.type)) {
    return {
      valid: false,
      message: `不支持的视频格式: ${file.type}，请使用 MP4、WebM、OGG 或 MOV 格式`,
      originalSize,
      suggestedSize
    };
  }
  
  // 检查文件大小 - 使用更严格的检查
  if (file.size > maxSize) {
    const overSize = (file.size - maxSize) / 1024 / 1024;
    const compressionRatio = ((file.size - maxSize) / file.size * 100).toFixed(1);
    
    return {
      valid: false,
      message: `视频文件过大: ${(file.size / 1024 / 1024).toFixed(2)}MB (限制: ${(maxSize / 1024 / 1024).toFixed(2)}MB)。需要压缩: ${overSize.toFixed(2)}MB。建议压缩比例: ${compressionRatio}%。

🎯 推荐压缩工具:
• HandBrake (免费, 跨平台) - 推荐使用
• 格式工厂 (Windows)
• 在线压缩: tinywow.com/video-compressor
• iMovie/Mac 自带剪辑软件

📱 压缩设置建议:
• 分辨率: 1280x720 (720p) 或更低
• 码率: 2-5 Mbps
• 帧率: 24-30 fps
• 格式: H.264 MP4

⚡ 快速压缩:
如果工具使用困难，建议将视频分割为多个片段或选择更小的原文件。`,
      originalSize,
      suggestedSize
    };
  }
  
  // 对于较大的文件（>50MB），显示警告但仍允许上传
  if (file.size > suggestedSize) {
    console.warn(`⚠️ 视频文件较大: ${(file.size / 1024 / 1024).toFixed(2)}MB，建议压缩到${(suggestedSize / 1024 / 1024).toFixed(2)}MB以下以提高上传成功率`);
  }
  
  console.log('✅ 视频预处理完成:', {
    最终大小: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    格式: file.type,
    状态: file.size > suggestedSize ? '较大，建议压缩' : '合适'
  });
  
  return {
    valid: true,
    file,
    originalSize,
    suggestedSize
  };
};

// =====================================
// new-images 存储桶相关功能
// =====================================

/**
 * 创建new-images存储桶
 */
export const createNewImagesBucket = async (): Promise<boolean> => {
  try {
    // 检查桶是否已存在
    const { data: buckets } = await supabase.storage.listBuckets();
    const newImagesBucket = buckets?.find(bucket => bucket.name === 'new-images');
    
    if (newImagesBucket) {
      console.log('new-images存储桶已存在');
      return true;
    }

    // 创建新桶
    const { error } = await supabase.storage.createBucket('new-images', {
      public: true, // 设置为公开访问
      allowedMimeTypes: ['image/*'], // 只允许上传图片
      fileSizeLimit: 5 * 1024 * 1024, // 限制文件大小为5MB
    });

    if (error) {
      console.error('创建new-images存储桶失败:', error);
      return false;
    }

    console.log('new-images存储桶创建成功');
    return true;
  } catch (error) {
    console.error('创建存储桶时发生错误:', error);
    return false;
  }
};

/**
 * 上传图片到new-images桶
 * @param file 要上传的文件
 * @param fileName 文件名（可选，默认使用时间戳+原文件名）
 * @returns 上传结果对象
 */
export const uploadToNewImagesBucket = async (file: File, fileName?: string): Promise<UploadResult> => {
  try {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return { success: false, error: '只能上传图片文件' };
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: '图片大小不能超过5MB' };
    }

    // 确保桶存在
    const bucketExists = await createNewImagesBucket();
    if (!bucketExists) {
      return { success: false, error: '无法创建或访问new-images存储桶' };
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const finalFileName = fileName || `${timestamp}_${randomString}_${file.name}`;
    
    // 上传文件
    const { error } = await supabase.storage
      .from('new-images')
      .upload(finalFileName, file, {
        cacheControl: '3600',
        upsert: false, // 不允许覆盖，避免文件名冲突
      });

    if (error) {
      console.error('上传到new-images桶失败:', error);
      
      if (error.message.includes('duplicate')) {
        return { success: false, error: '文件名已存在，请重试' };
      }
      
      return { success: false, error: `上传失败: ${error.message}` };
    }

    // 获取公共URL - 使用新的存储桶URL格式
    const publicUrl = `https://onest.selfroom.top/project/default/storage/files/public/${finalFileName}`;

    console.log('图片上传到new-images桶成功:', publicUrl);
    
    return { 
      success: true, 
      url: publicUrl,
      error: undefined
    };
  } catch (error) {
    console.error('上传到new-images桶时发生错误:', error);
    return { success: false, error: '上传过程中发生未知错误' };
  }
};

/**
 * 删除new-images桶中的图片
 * @param fileName 文件名或URL
 */
export const deleteFromNewImagesBucket = async (fileName: string): Promise<boolean> => {
  try {
    // 如果传入的是完整URL，提取文件名
    const extractedFileName = fileName.split('/').pop() || fileName;
    
    const { error } = await supabase.storage
      .from('new-images')
      .remove([extractedFileName]);

    if (error) {
      console.error('从new-images桶删除图片失败:', error);
      return false;
    }

    console.log('从new-images桶删除图片成功');
    return true;
  } catch (error) {
    console.error('从new-images桶删除图片时发生错误:', error);
    return false;
  }
};

/**
 * 列出new-images桶中的所有文件
 */
export const listNewImages = async (): Promise<StorageFile[]> => {
  try {
    const { data, error } = await supabase.storage
      .from('new-images')
      .list();

    if (error) {
      console.error('列出new-images桶图片失败:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('列出new-images桶图片时发生错误:', error);
    return [];
  }
};

/**
 * 获取new-images桶的公共URL
 * @param fileName 文件名
 * @returns 公共URL
 */
export const getNewImagesUrl = (fileName: string): string => {
  // 使用新的存储桶URL格式
  return `https://onest.selfroom.top/project/default/storage/files/public/${fileName}`;
};

/**
 * 检查new-images桶是否存在
 */
export const checkNewImagesBucket = async (): Promise<boolean> => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    return buckets?.some(bucket => bucket.name === 'new-images') || false;
  } catch (error) {
    console.error('检查new-images存储桶时发生错误:', error);
    return false;
  }
};

// =====================================
// 兼容性：保留原有的news-images功能
// =====================================



/**
 * 上传图片（保留兼容性，默认使用new-images）
 */
export const uploadNewsImage = uploadToNewImagesBucket;

/**
 * 删除图片（保留兼容性）
 */
export const deleteNewsImage = deleteFromNewImagesBucket;





// =====================================
// news-images 存储桶相关功能（用于新闻管理）
// =====================================

/**
 * 检查news-images存储桶是否存在
 */
export const checkNewsImagesBucket = async (): Promise<boolean> => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    return buckets?.some(bucket => bucket.name === 'news-images') || false;
  } catch (error) {
    console.error('检查news-images存储桶时发生错误:', error);
    return false;
  }
};

/**
 * 压缩图片（优化上传速度）
 * @param file 原始文件
 * @param maxWidth 最大宽度
 * @param quality 压缩质量 0-1
 * @returns 压缩后的文件
 */
const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 计算压缩后的尺寸
      let { width, height } = img;
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      
      // 设置canvas尺寸
      canvas.width = width;
      canvas.height = height;
      
      // 绘制压缩后的图片
      ctx?.drawImage(img, 0, 0, width, height);
      
      // 转换为Blob
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          resolve(file); // 压缩失败返回原文件
        }
      }, file.type, quality);
    };
    
    img.onerror = () => resolve(file); // 加载失败返回原文件
    img.src = URL.createObjectURL(file);
  });
};

/**
 * 上传图片到news-images桶（用于新闻管理）- 优化版本
 * @param file 要上传的文件
 * @param fileName 文件名（可选，默认使用时间戳+原文件名）
 * @returns 上传结果对象
 */
export const uploadToNewsImagesBucket = async (file: File, fileName?: string): Promise<UploadResult> => {
  try {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return { success: false, error: '只能上传图片文件' };
    }

    // 验证文件大小（10MB，但会自动压缩）
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: '图片大小不能超过10MB' };
    }

    console.log('开始处理图片:', file.name, `原始大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    // 自动压缩大图片
    let fileToUpload = file;
    if (file.size > 1024 * 1024) { // 大于1MB的图片进行压缩
      console.log('正在压缩图片...');
      fileToUpload = await compressImage(file, 1200, 0.8);
      console.log(`压缩完成，新大小: ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const finalFileName = fileName || `${timestamp}_${randomString}_${fileToUpload.name}`;
    
    console.log('开始上传到news-images桶:', finalFileName);
    
    // 上传文件到news-images桶
    const startTime = Date.now();
    const { error } = await supabase.storage
      .from('news-images')
      .upload(finalFileName, fileToUpload, {
        cacheControl: '3600',
        upsert: false, // 不允许覆盖，避免文件名冲突
      });

    const uploadTime = Date.now() - startTime;
    console.log(`上传耗时: ${uploadTime}ms`);

    if (error) {
      console.error('上传到news-images桶失败:', error);
      
      if (error.message.includes('duplicate')) {
        return { success: false, error: '文件名已存在，请重试' };
      }
      
      return { success: false, error: `上传失败: ${error.message}` };
    }

    // 获取公共URL - 使用新的存储桶URL格式
    const publicUrl = `https://onest.selfroom.top/project/default/storage/files/public/${finalFileName}`;

    console.log('图片上传到news-images桶成功:', publicUrl);
    console.log(`总处理时间: ${Date.now() - startTime}ms`);
    
    return { 
      success: true, 
      url: publicUrl,
      error: undefined
    };
  } catch (error) {
    console.error('上传到news-images桶时发生错误:', error);
    return { success: false, error: '上传过程中发生未知错误' };
  }
};

/**
 * 删除news-images桶中的图片
 * @param fileName 文件名或URL
 */
export const deleteFromNewsImagesBucket = async (fileName: string): Promise<boolean> => {
  try {
    // 如果传入的是完整URL，提取文件名
    const extractedFileName = fileName.split('/').pop() || fileName;
    
    console.log('从news-images桶删除图片:', extractedFileName);
    
    const { error } = await supabase.storage
      .from('news-images')
      .remove([extractedFileName]);

    if (error) {
      console.error('从news-images桶删除图片失败:', error);
      return false;
    }

    console.log('从news-images桶删除图片成功');
    return true;
  } catch (error) {
    console.error('从news-images桶删除图片时发生错误:', error);
    return false;
  }
};

/**
 * 列出news-images桶中的所有文件
 */
export const listNewsImages = async (): Promise<StorageFile[]> => {
  try {
    const { data, error } = await supabase.storage
      .from('news-images')
      .list();

    if (error) {
      console.error('列出news-images桶图片失败:', error);
      return [];
    }

    console.log('news-images桶中的文件:', data);
    return data || [];
  } catch (error) {
    console.error('列出news-images桶图片时发生错误:', error);
    return [];
  }
};

/**
 * 获取news-images桶的公共URL
 * @param fileName 文件名
 * @returns 公共URL
 */
export const getNewsImageUrl = (fileName: string): string => {
  // 使用新的存储桶URL格式
  return `https://onest.selfroom.top/project/default/storage/files/public/${fileName}`;
};

/**
 * 创建news-images存储桶（保留兼容性）
 */
export const createNewsImagesBucket = async (): Promise<boolean> => {
  try {
    // 检查桶是否已存在
    const { data: buckets } = await supabase.storage.listBuckets();
    const newsImagesBucket = buckets?.find(bucket => bucket.name === 'news-images');
    
    if (newsImagesBucket) {
      console.log('news-images存储桶已存在');
      return true;
    }

    // 创建新桶
    const { error } = await supabase.storage.createBucket('news-images', {
      public: true, // 设置为公开访问
      allowedMimeTypes: ['image/*'], // 只允许上传图片
      fileSizeLimit: 5 * 1024 * 1024, // 限制文件大小为5MB
    });

    if (error) {
      console.error('创建news-images存储桶失败:', error);
      return false;
    }

    console.log('news-images存储桶创建成功');
    return true;
  } catch (error) {
    console.error('创建存储桶时发生错误:', error);
    return false;
  }
};

// =====================================
// achievement-images 存储桶相关功能（项目封面图片）
// =====================================

/**
 * 检查achievement-images存储桶是否存在
 */
export const checkAchievementImagesBucket = async (): Promise<boolean> => {
  try {
    console.log('🔍 开始检查achievement-images存储桶...');
    
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ 获取存储桶列表时发生错误:', error);
      return false;
    }
    
    console.log('✅ 成功获取存储桶列表:', buckets?.map(b => ({ name: b.name, id: b.id })));
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'achievement-images') || false;
    console.log('📦 achievement-images存储桶检查结果:', bucketExists ? '✅ 存在' : '❌ 不存在');
    
    if (!bucketExists) {
      console.error('❌ 存储桶不存在！当前可用存储桶:');
      buckets?.forEach((bucket, index) => {
        console.error(`  ${index + 1}. ${bucket.name} (ID: ${bucket.id})`);
      });
    }
    
    return bucketExists;
  } catch (error) {
    console.error('💥 检查achievement-images存储桶时发生错误:', error);
    return false;
  }
};

// 强制检查存储桶（无论结果如何都返回true）
export const forceCheckBucket = (): boolean => {
  console.log('🚀 强制跳过存储桶检查 - 假设存储桶已存在');
  return true;
};

/**
 * 创建achievement-images存储桶
 */
/**
 * 创建achievement-images存储桶的RLS策略
 */
export const createAchievementImagesBucketPolicies = async (): Promise<boolean> => {
  try {
    console.log('正在创建achievement-images存储桶的RLS策略...');
    
    // 创建允许公开读取的策略
    const { error: publicReadError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Allow public uploads" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'achievement-images');
        
        CREATE POLICY "Allow public reads" ON storage.objects
        FOR SELECT USING (bucket_id = 'achievement-images');
        
        CREATE POLICY "Allow public updates" ON storage.objects
        FOR UPDATE WITH CHECK (bucket_id = 'achievement-images');
      `
    });

    if (publicReadError) {
      console.warn('创建RLS策略时出错:', publicReadError);
      return false;
    }

    console.log('✅ RLS策略创建成功');
    return true;
  } catch (error) {
    console.error('创建RLS策略时发生错误:', error);
    return false;
  }
};

export const createAchievementImagesBucket = async (): Promise<boolean> => {
  try {
    // 检查桶是否已存在
    const { data: buckets } = await supabase.storage.listBuckets();
    const achievementImagesBucket = buckets?.find(bucket => bucket.name === 'achievement-images');
    
    if (achievementImagesBucket) {
      console.log('achievement-images存储桶已存在');
      return true;
    }

    // 创建新桶
    const { error } = await supabase.storage.createBucket('achievement-images', {
      public: true, // 设置为公开访问
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], // 允许常见图片格式
      fileSizeLimit: 10 * 1024 * 1024, // 限制文件大小为10MB
    });

    if (error) {
      console.error('创建achievement-images存储桶失败:', error);
      
      // 提供详细的解决方案
      if (error.message.includes('row-level security policy')) {
        console.error(`
❌ RLS策略阻止了存储桶的创建！

🔧 解决方案：
1. 打开 Supabase 控制台: https://supabase.com/dashboard
2. 选择项目 → Storage 页面
3. 手动创建存储桶 "achievement-images"
4. 设置为公开访问 (Public)
5. 设置文件大小限制: 10MB
6. 允许的MIME类型: image/jpeg, image/png, image/gif, image/webp

💻 或者使用 SQL 执行：
CREATE STORAGE BUCKET achievement-images
WITH (
  public = true,
  allowed_mime_types = {'image/jpeg', 'image/png', 'image/gif', 'image/webp'},
  file_size_limit = 10485760
);

✅ 创建完成后，上传功能将正常工作
        `);
      }
      
      return false;
    }

    console.log('achievement-images存储桶创建成功');
    return true;
  } catch (error) {
    console.error('创建achievement-images存储桶时发生错误:', error);
    return false;
  }
};

/**
 * 上传图片到achievement-images桶
 * @param file 要上传的文件
 * @param fileName 文件名（可选，默认使用时间戳+原文件名）
 * @param filePath 文件路径（可选，例如：achievements/userId/fileName）
 * @returns 上传结果对象
 */
export const uploadToAchievementImagesBucket = async (file: File, fileName?: string, filePath?: string, skipCheck?: boolean): Promise<UploadResult> => {
  try {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return { success: false, error: '只能上传图片文件' };
    }

    // 验证文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: '图片大小不能超过10MB' };
    }

    // 检查桶是否存在，如果不存在则尝试创建（除非跳过检查）
    if (!skipCheck) {
      console.log('🔍 执行存储桶检查...');
      const bucketExists = await checkAchievementImagesBucket();
      if (!bucketExists) {
      console.log('achievement-images存储桶不存在，尝试自动创建...');
      const created = await createAchievementImagesBucket();
      if (!created) {
        console.error(`
🚨 achievement-images存储桶创建失败！

🔧 请手动创建存储桶：

方法1 - 使用 Supabase 控制台：
1. 打开 https://supabase.com/dashboard/project/vntvrdkjtfdcnvwgrubo/storage
2. 点击 "New bucket"
3. 桶名: achievement-images
4. Public bucket: ✅
5. File size limit: 10MB (10485760 bytes)
6. Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
7. 点击 "Save"

方法2 - 使用 SQL Editor：
CREATE STORAGE BUCKET achievement-images
WITH (
  public = true,
  allowed_mime_types = {'image/jpeg', 'image/png', 'image/gif', 'image/webp'},
  file_size_limit = 10485760
);

✅ 创建完成后刷新页面重试
        `);
        
        return { 
          success: false, 
          error: 'achievement-images存储桶需要手动创建，请查看控制台的详细说明' 
        };
      }
      console.log('achievement-images存储桶创建成功');
      }
    }

    // 生成唯一文件名和路径
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const finalFileName = fileName || `${timestamp}_${randomString}_${file.name}`;
    const finalFilePath = filePath || `achievements/${finalFileName}`;
    
    console.log('开始上传到achievement-images桶:', finalFilePath);
    
    // 上传文件
    const startTime = Date.now();
    console.log(`开始上传文件到achievement-images桶:`);
    console.log(`- 文件名: ${finalFileName}`);
    console.log(`- 文件路径: ${finalFilePath}`);
    console.log(`- 文件大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    console.log(`- 文件类型: ${file.type}`);
    
    const { error, data } = await supabase.storage
      .from('achievement-images')
      .upload(finalFilePath, file, {
        cacheControl: '3600',
        upsert: true, // 允许覆盖，支持更新封面图
      });

    const uploadTime = Date.now() - startTime;
    console.log(`上传耗时: ${uploadTime}ms`);
    console.log('上传结果:', { error, data });

    if (error) {
      console.error('上传到achievement-images桶失败:', error);
      console.error('错误详情:', {
        message: error.message,
        statusCode: error.statusCode,
        error: error.error
      });
      
      // 提供更详细的错误信息
      let errorMessage = `上传失败: ${error.message}`;
      if (error.message.includes('Bucket not found') || error.message.includes('bucket does not exist')) {
        errorMessage = 'achievement-images存储桶不存在，请检查Supabase控制台';
      } else if (error.message.includes('permission') || error.message.includes('PGRST301')) {
        errorMessage = '权限不足，请检查存储桶的RLS策略';
      } else if (error.message.includes('file too large')) {
        errorMessage = '文件过大，请选择小于10MB的图片';
      }
      
      return { success: false, error: errorMessage };
    }

    // 获取公共URL - 使用新的存储桶URL格式
    const publicUrl = `https://onest.selfroom.top/project/default/storage/files/public/${finalFilePath}`;

    console.log('图片上传到achievement-images桶成功:', publicUrl);
    
    return { 
      success: true, 
      url: publicUrl,
      error: undefined
    };
  } catch (error) {
    console.error('上传到achievement-images桶时发生错误:', error);
    return { success: false, error: '上传过程中发生未知错误' };
  }
};

/**
 * 删除achievement-images桶中的图片
 * @param filePath 文件路径或完整URL
 */
export const deleteFromAchievementImagesBucket = async (filePath: string): Promise<boolean> => {
  try {
    // 如果传入的是完整URL，提取文件路径
    const extractedFilePath = filePath.includes('achievement-images/') 
      ? filePath.split('achievement-images/')[1] 
      : filePath;
    
    console.log('从achievement-images桶删除图片:', extractedFilePath);
    
    const { error } = await supabase.storage
      .from('achievement-images')
      .remove([extractedFilePath]);

    if (error) {
      console.error('从achievement-images桶删除图片失败:', error);
      return false;
    }

    console.log('从achievement-images桶删除图片成功');
    return true;
  } catch (error) {
    console.error('从achievement-images桶删除图片时发生错误:', error);
    return false;
  }
};

// =====================================
// achievement-videos 存储桶相关功能（项目演示视频）
// =====================================



/**
 * 上传视频到achievement-videos桶
 * @param file 要上传的文件
 * @param fileName 文件名（可选，默认使用时间戳+原文件名）
 * @param filePath 文件路径（可选，例如：achievements/userId/fileName）
 * @returns 上传结果对象
 */
/**
 * 检查achievement-videos存储桶是否存在
 */
export const checkAchievementVideosBucket = async (): Promise<boolean> => {
  try {
    console.log('🔍 开始检查achievement-videos存储桶...');
    
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ 获取存储桶列表时发生错误:', error);
      return false;
    }
    
    console.log('✅ 成功获取存储桶列表:', buckets?.map(b => ({ name: b.name, id: b.id })));
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'achievement-videos') || false;
    console.log('📦 achievement-videos存储桶检查结果:', bucketExists ? '✅ 存在' : '❌ 不存在');
    
    return bucketExists;
  } catch (error) {
    console.error('💥 检查achievement-videos存储桶时发生错误:', error);
    return false;
  }
};

/**
 * 创建achievement-videos存储桶
 */
export const createAchievementVideosBucket = async (): Promise<boolean> => {
  try {
    // 检查桶是否已存在
    const { data: buckets } = await supabase.storage.listBuckets();
    const achievementVideosBucket = buckets?.find(bucket => bucket.name === 'achievement-videos');
    
    if (achievementVideosBucket) {
      console.log('achievement-videos存储桶已存在');
      return true;
    }

    // 创建新桶
    const { error } = await supabase.storage.createBucket('achievement-videos', {
      public: true, // 设置为公开访问
      allowedMimeTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'], // 允许常见视频格式
      fileSizeLimit: 50 * 1024 * 1024, // 限制文件大小为50MB
    });

    if (error) {
      console.error('创建achievement-videos存储桶失败:', error);
      return false;
    }

    console.log('achievement-videos存储桶创建成功');
    return true;
  } catch (error) {
    console.error('创建achievement-videos存储桶时发生错误:', error);
    return false;
  }
};

export const uploadToAchievementVideosBucket = async (file: File, fileName?: string, filePath?: string, skipCheck?: boolean): Promise<UploadResult> => {
  try {
    console.log('🎥 开始视频上传处理:', {
      文件名: file.name,
      文件类型: file.type,
      文件大小: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    });

    // 视频预处理和验证
    const videoValidation = await preprocessVideoFile(file, 50 * 1024 * 1024);
    
    if (!videoValidation.valid) {
      console.error('❌ 视频验证失败:', videoValidation.message);
      return { success: false, error: videoValidation.message };
    }

    const processedFile = videoValidation.file!;
    
    console.log('✅ 视频验证通过:', {
      原始大小: `${(videoValidation.originalSize / 1024 / 1024).toFixed(2)}MB`,
      处理后大小: `${(processedFile.size / 1024 / 1024).toFixed(2)}MB`,
      文件类型: processedFile.type
    });

    // 检查桶是否存在（除非跳过检查）
    // 注意：achievement-videos存储桶已存在，可以跳过检查以提高性能
    if (!skipCheck) {
      console.log('🔍 执行achievement-videos存储桶检查...');
      const bucketExists = await checkAchievementVideosBucket();
      if (!bucketExists) {
        console.log('achievement-videos存储桶不存在，尝试自动创建...');
        const created = await createAchievementVideosBucket();
        if (!created) {
          console.error(`
🚨 achievement-videos存储桶创建失败！

🔧 请手动创建存储桶：

方法1 - 使用 Supabase 控制台：
1. 打开 https://supabase.com/dashboard/project/vntvrdkjtfdcnvwgrubo/storage
2. 点击 "New bucket"
3. 桶名: achievement-videos
4. Public bucket: ✅
5. File size limit: 200MB (209715200 bytes)
6. Allowed MIME types: video/mp4, video/webm, video/ogg, video/quicktime
7. 点击 "Save"

方法2 - 使用 SQL Editor：
CREATE STORAGE BUCKET achievement-videos
WITH (
  public = true,
  allowed_mime_types = {'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'},
  file_size_limit = 209715200
);

✅ 创建完成后刷新页面重试
          `);
          
          return { 
            success: false, 
            error: 'achievement-videos存储桶需要手动创建，请查看控制台的详细说明' 
          };
        }
        console.log('achievement-videos存储桶创建成功');
      }
    }

    // 生成唯一文件名和路径
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = processedFile.name.split('.').pop() || 'mp4';
    const baseFileName = fileName ? fileName.replace(/\.[^/.]+$/, '') : processedFile.name.replace(/\.[^/.]+$/, '');
    const finalFileName = `${baseFileName}_${timestamp}_${randomString}.${fileExtension}`;
    const finalFilePath = filePath || `achievements/${finalFileName}`;
    
    console.log('🚀 开始上传到achievement-videos桶:', {
      文件路径: finalFilePath,
      文件大小: `${(processedFile.size / 1024 / 1024).toFixed(2)}MB`,
      预计耗时: `${Math.round(processedFile.size / 1024 / 1024 * 10)}秒`
    });
    
    // 上传文件 - 增加超时处理和重试机制
    const startTime = Date.now();
    let retryCount = 0;
    const maxRetries = 3;
    let error = null;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`📤 尝试上传 (${retryCount + 1}/${maxRetries})...`);
        
        // 设置超时控制器
        const uploadPromise = supabase.storage
          .from('achievement-videos')
          .upload(finalFilePath, processedFile, {
            cacheControl: '3600',
            upsert: true, // 允许覆盖，支持更新视频
          });

        // 添加超时处理（大文件上传需要更长时间）
        const timeoutMs = Math.max(300000, processedFile.size / 1024 * 2); // 至少5分钟，或每KB 2ms
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('上传超时，请检查网络连接或尝试更小的视频文件')), timeoutMs)
        );

        const result = await Promise.race([uploadPromise, timeoutPromise]);
        
        if (result.error) {
          throw result.error;
        }

        // 上传成功，跳出重试循环
        error = null;
        break;
        
      } catch (err) {
        error = err;
        retryCount++;
        
        if (retryCount < maxRetries) {
          const waitTime = retryCount * 2000; // 递增等待时间
          console.log(`❌ 上传失败，${waitTime}ms后重试...`, err);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    const uploadTime = Date.now() - startTime;
    console.log(`上传总耗时: ${uploadTime}ms`);

    if (error) {
      console.error('上传到achievement-videos桶失败:', error);
      
      // 提供更详细的错误诊断
      let errorMessage = `上传失败: ${error.message}`;
      if (error.message.includes('Failed to fetch')) {
        errorMessage = `网络连接失败，请检查网络连接或尝试更小的视频文件。错误详情: ${error.message}`;
      } else if (error.message.includes('timeout')) {
        errorMessage = `上传超时，请尝试更小的视频文件或检查网络连接。建议视频大小小于50MB。`;
      } else if (error.message.includes('Bucket not found') || error.message.includes('bucket does not exist')) {
        errorMessage = 'achievement-videos存储桶不存在，请检查Supabase控制台';
      } else if (error.message.includes('permission') || error.message.includes('PGRST301')) {
        errorMessage = '权限不足，请检查存储桶的RLS策略';
      } else if (error.message.includes('file too large')) {
        errorMessage = '文件过大，请选择小于100MB的视频';
      }
      
      return { success: false, error: errorMessage };
    }

    // 获取公共URL - 使用新的存储桶URL格式
    const publicUrl = `https://onest.selfroom.top/project/default/storage/files/public/${finalFilePath}`;

    console.log('视频上传到achievement-videos桶成功:', publicUrl);
    
    return { 
      success: true, 
      url: publicUrl,
      error: undefined
    };
  } catch (error) {
    console.error('上传到achievement-videos桶时发生错误:', error);
    return { success: false, error: `上传过程中发生未知错误: ${error.message}` };
  }
};

/**
 * 删除achievement-videos桶中的视频
 * @param filePath 文件路径或完整URL
 */
export const deleteFromAchievementVideosBucket = async (filePath: string): Promise<boolean> => {
  try {
    // 如果传入的是完整URL，提取文件路径
    const extractedFilePath = filePath.includes('achievement-videos/') 
      ? filePath.split('achievement-videos/')[1] 
      : filePath;
    
    console.log('从achievement-videos桶删除视频:', extractedFilePath);
    
    const { error } = await supabase.storage
      .from('achievement-videos')
      .remove([extractedFilePath]);

    if (error) {
      console.error('从achievement-videos桶删除视频失败:', error);
      return false;
    }

    console.log('从achievement-videos桶删除视频成功');
    return true;
  } catch (error) {
    console.error('从achievement-videos桶删除视频时发生错误:', error);
    return false;
  }
};