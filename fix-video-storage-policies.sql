-- 修复 achievement-videos 存储桶权限问题
-- 在 Supabase SQL Editor 中执行以下 SQL 语句

-- 1. 首先禁用 RLS（如果之前有问题的话）
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 2. 重新启用 RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. 删除可能存在的旧策略（避免冲突）
DROP POLICY IF EXISTS "Allow video uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow video reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow video updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates" ON storage.objects;

-- 4. 创建 achievement-videos 存储桶的访问策略
-- 允许公开上传视频文件
CREATE POLICY "Allow video uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'achievement-videos' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- 允许公开读取视频文件
CREATE POLICY "Allow video reads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'achievement-videos' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- 允许公开更新视频文件
CREATE POLICY "Allow video updates" ON storage.objects
FOR UPDATE WITH CHECK (
  bucket_id = 'achievement-videos' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- 5. 为存储桶本身创建策略（如果需要）
-- 确保存储桶可以被公开访问
UPDATE storage.buckets 
SET public = true 
WHERE name = 'achievement-videos';

-- 6. 验证策略是否创建成功
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check,
  check_expression
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%video%';

-- 7. 更新存储桶配置（确保为50MB限制）
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 52428800, -- 50MB in bytes
  allowed_mime_types = '{video/mp4,video/webm,video/ogg,video/quicktime}'
WHERE name = 'achievement-videos';

-- 8. 测试存储桶权限
-- 这个查询应该返回 achievement-videos 存储桶的信息
SELECT * FROM storage.buckets WHERE name = 'achievement-videos';

-- 执行完成后，应该会看到：
-- - "CREATE POLICY" 成功消息
-- - 存储桶信息查询结果
-- - 策略列表显示新创建的策略