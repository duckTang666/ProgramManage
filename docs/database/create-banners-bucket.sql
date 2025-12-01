-- 创建轮播图存储桶
-- 注意：这些SQL语句需要在Supabase SQL编辑器中执行

-- 1. 创建存储桶
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners', 
  'banners', 
  true, 
  10485760, -- 10MB文件大小限制
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'] -- 允许的图片格式
);

-- 2. 设置存储桶的公开访问策略
-- 允许匿名用户读取存储桶中的所有文件
CREATE POLICY "Allow public access to banner images" ON storage.objects
FOR SELECT USING (bucket_id = 'banners');

-- 3. 设置上传策略（允许认证用户上传）
CREATE POLICY "Allow authenticated users to upload banner images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'banners' 
  AND auth.role() = 'authenticated'
);

-- 4. 设置更新策略（允许认证用户更新自己的文件）
CREATE POLICY "Allow authenticated users to update banner images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'banners' 
  AND auth.role() = 'authenticated'
);

-- 5. 设置删除策略（允许认证用户删除自己的文件）
CREATE POLICY "Allow authenticated users to delete banner images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'banners' 
  AND auth.role() = 'authenticated'
);

-- 6. 为存储桶创建RLS（行级安全）策略
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 验证存储桶是否创建成功
SELECT * FROM storage.buckets WHERE name = 'banners';