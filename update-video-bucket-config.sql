-- 更新 achievement-videos 存储桶配置为50MB限制
-- 在 Supabase SQL Editor 中执行

-- 1. 更新存储桶配置
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 52428800, -- 50MB in bytes (52,428,800)
  allowed_mime_types = '{video/mp4,video/webm,video/ogg,video/quicktime}'
WHERE name = 'achievement-videos';

-- 2. 验证更新结果
SELECT 
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE name = 'achievement-videos';

-- 3. 检查相关权限策略
SELECT 
  policyname,
  roles,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND (
  policyname LIKE '%video%' OR 
  policyname LIKE '%achievement%'
);

-- 预期结果：
-- 1. 更新成功消息
-- 2. 存储桶配置显示 file_size_limit = 52428800
-- 3. 公共访问 public = true
-- 4. 正确的 MIME 类型列表