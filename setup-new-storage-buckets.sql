-- 设置新的 Supabase 存储桶配置
-- 适用于新的存储桶 URL: https://onest.selfroom.top/project/default/storage/files

-- ========================================
-- 1. 创建所有必要的存储桶
-- ========================================

-- 创建 new-images 存储桶（新闻图片）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at)
VALUES (
  gen_random_uuid(), 
  'new-images', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- 创建 news-images 存储桶（新闻管理图片）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at)
VALUES (
  gen_random_uuid(), 
  'news-images', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- 创建 achievement-images 存储桶（成果封面图片）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at)
VALUES (
  gen_random_uuid(), 
  'achievement-images', 
  true, 
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- 创建 achievement-videos 存储桶（成果演示视频）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at)
VALUES (
  gen_random_uuid(), 
  'achievement-videos', 
  true, 
  52428800, -- 50MB
  ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

-- 创建 achievement_attachments 存储桶（成果附件）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at)
VALUES (
  gen_random_uuid(), 
  'achievement_attachments', 
  true, 
  52428800, -- 50MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

-- 创建 banners 存储桶（轮播图）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at)
VALUES (
  gen_random_uuid(), 
  'banners', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- ========================================
-- 2. 设置存储桶访问策略
-- ========================================

-- 删除旧策略
DROP POLICY IF EXISTS "Allow new-images uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow new-images reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow new-images updates" ON storage.objects;

DROP POLICY IF EXISTS "Allow news-images uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow news-images reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow news-images updates" ON storage.objects;

DROP POLICY IF EXISTS "Allow achievement-images uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow achievement-images reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow achievement-images updates" ON storage.objects;

DROP POLICY IF EXISTS "Allow achievement-videos uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow achievement-videos reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow achievement-videos updates" ON storage.objects;

DROP POLICY IF EXISTS "Allow achievement_attachments uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow achievement_attachments reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow achievement_attachments updates" ON storage.objects;

DROP POLICY IF EXISTS "Allow banners uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow banners reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow banners updates" ON storage.objects;

-- 创建 new-images 存储桶策略
CREATE POLICY "Allow new-images uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'new-images' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow new-images reads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'new-images' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow new-images updates" ON storage.objects
FOR UPDATE WITH CHECK (
  bucket_id = 'new-images' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- 创建 news-images 存储桶策略
CREATE POLICY "Allow news-images uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'news-images' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow news-images reads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'news-images' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow news-images updates" ON storage.objects
FOR UPDATE WITH CHECK (
  bucket_id = 'news-images' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- 创建 achievement-images 存储桶策略
CREATE POLICY "Allow achievement-images uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'achievement-images' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow achievement-images reads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'achievement-images' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow achievement-images updates" ON storage.objects
FOR UPDATE WITH CHECK (
  bucket_id = 'achievement-images' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- 创建 achievement-videos 存储桶策略
CREATE POLICY "Allow achievement-videos uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'achievement-videos' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow achievement-videos reads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'achievement-videos' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow achievement-videos updates" ON storage.objects
FOR UPDATE WITH CHECK (
  bucket_id = 'achievement-videos' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- 创建 achievement_attachments 存储桶策略
CREATE POLICY "Allow achievement_attachments uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'achievement_attachments' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow achievement_attachments reads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'achievement_attachments' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow achievement_attachments updates" ON storage.objects
FOR UPDATE WITH CHECK (
  bucket_id = 'achievement_attachments' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- 创建 banners 存储桶策略
CREATE POLICY "Allow banners uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'banners' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow banners reads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'banners' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow banners updates" ON storage.objects
FOR UPDATE WITH CHECK (
  bucket_id = 'banners' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- ========================================
-- 3. 验证设置
-- ========================================

-- 查看所有存储桶
SELECT 
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE name IN (
  'new-images', 
  'news-images', 
  'achievement-images', 
  'achievement-videos', 
  'achievement_attachments', 
  'banners'
)
ORDER BY name;

-- 查看所有策略
SELECT 
  policyname,
  tablename,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- ========================================
-- 执行完成提示
-- ========================================

/*
执行完成后，你应该看到：
1. 所有存储桶都已创建并设置为公开访问
2. 每个存储桶都有正确的文件大小限制
3. 每个存储桶都有允许的上传/读取/更新策略
4. 所有存储桶都支持匿名用户和认证用户访问

预期配置：
- new-images: 5MB, 图片格式
- news-images: 5MB, 图片格式  
- achievement-images: 10MB, 图片格式
- achievement-videos: 50MB, 视频格式
- achievement_attachments: 50MB, 文档格式
- banners: 5MB, 图片格式
*/