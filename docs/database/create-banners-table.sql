-- 创建轮播图表
-- 复制这段代码到 Supabase 控制台的 SQL 编辑器中运行

-- 创建 banners 表
CREATE TABLE IF NOT EXISTS banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,                    -- 图片URL（来自Supabase Storage）
    text_content TEXT NOT NULL,                  -- 文字内容
    link_url TEXT NOT NULL,                     -- 文字跳转链接
    display_order INTEGER NOT NULL DEFAULT 1,       -- 显示顺序（1-10，1的优先级最高）
    is_active BOOLEAN DEFAULT true,               -- 是否启用（默认为true）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_banners_display_order ON banners(display_order);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_created_at ON banners(created_at DESC);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_banners_updated_at 
    BEFORE UPDATE ON banners 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- 插入示例数据
INSERT INTO banners (image_url, text_content, link_url, display_order, is_active) VALUES
(
    'https://vntvrdkjtfdcnvwgrubo.supabase.co/storage/v1/object/public/banners/banner_1.jpg',
    '学院最新通知：2024年软件学院项目展示会顺利举行',
    'https://example.com/news1',
    1,
    true
),
(
    'https://vntvrdkjtfdcnvwgrubo.supabase.co/storage/v1/object/public/banners/banner_2.jpg',
    '校园活动：2024年春季学期社团招新活动',
    'https://example.com/activities1',
    2,
    true
),
(
    'https://vntvrdkjtfdcnvwgrubo.supabase.co/storage/v1/object/public/banners/banner_3.jpg',
    '学术讲座：人工智能前沿技术与应用',
    'https://example.com/lecture1',
    3,
    true
)
ON CONFLICT DO NOTHING;

-- 创建 Storage 存储桶（如果不存在）
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

-- 为 banners 存储桶设置策略
DROP POLICY IF EXISTS "Public banners are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload banner images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own banner images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own banner images" ON storage.objects;

CREATE POLICY "Public banners are viewable by everyone" ON storage.objects
FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Users can upload banner images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'banners'
);

CREATE POLICY "Users can update banner images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'banners'
);

CREATE POLICY "Users can delete banner images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'banners'
);

-- 添加注释
COMMENT ON TABLE banners IS '轮播图表，用于存储网站首页展示的轮播图信息';
COMMENT ON COLUMN banners.id IS '轮播图唯一标识';
COMMENT ON COLUMN banners.image_url IS '轮播图图片URL，存储在Supabase Storage中';
COMMENT ON COLUMN banners.text_content IS '轮播图显示的文字内容';
COMMENT ON COLUMN banners.link_url IS '轮播图文字的跳转链接';
COMMENT ON COLUMN banners.display_order IS '显示顺序，数字越小优先级越高（1-10）';
COMMENT ON COLUMN banners.is_active IS '是否启用，true为启用，false为禁用';
COMMENT ON COLUMN banners.created_at IS '创建时间';
COMMENT ON COLUMN banners.updated_at IS '更新时间';