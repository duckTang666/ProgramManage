-- 轮播图存储桶权限设置
-- 复制这段代码到 Supabase 控制台的 SQL 编辑器中运行

-- 首先删除所有现有策略（如果存在）
DROP POLICY IF EXISTS "Public banners are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload banner images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own banner images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own banner images" ON storage.objects;

-- 创建新的访问策略

-- 1. 公开读取策略（允许所有用户查看轮播图）
CREATE POLICY "Public banners are viewable by everyone" ON storage.objects
FOR SELECT USING (bucket_id = 'banners');

-- 2. 上传策略（允许认证用户上传轮播图）
CREATE POLICY "Users can upload banner images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'banners'
    AND auth.role() = 'authenticated'
);

-- 3. 更新策略（允许认证用户更新轮播图）
CREATE POLICY "Users can update banner images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'banners'
    AND auth.role() = 'authenticated'
);

-- 4. 删除策略（允许认证用户删除轮播图）
CREATE POLICY "Users can delete banner images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'banners'
    AND auth.role() = 'authenticated'
);

-- 确保存储桶存在且为公开状态
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'banners',
    'banners',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- 设置存储桶的RLS为启用状态
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 添加注释
COMMENT ON POLICY "Public banners are viewable by everyone" IS '允许所有用户查看轮播图图片';
COMMENT ON POLICY "Users can upload banner images" IS '允许认证用户上传轮播图图片';
COMMENT ON POLICY "Users can update banner images" IS '允许认证用户更新轮播图图片';
COMMENT ON POLICY "Users can delete banner images" IS '允许认证用户删除轮播图图片';

-- 验证策略设置
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname LIKE '%banners%'
ORDER BY policyname;