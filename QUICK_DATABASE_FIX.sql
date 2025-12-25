-- 快速修复achievements_parents表
-- 复制此脚本到Supabase SQL编辑器执行

-- 删除旧表
DROP TABLE IF EXISTS achievements_parents CASCADE;

-- 重新创建表（自增ID）
CREATE TABLE achievements_parents (
    id BIGSERIAL PRIMARY KEY,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(achievement_id, parent_id)
);

-- 创建索引
CREATE INDEX idx_achievements_parents_achievement_id ON achievements_parents(achievement_id);
CREATE INDEX idx_achievements_parents_parent_id ON achievements_parents(parent_id);

-- 启用RLS
ALTER TABLE achievements_parents ENABLE ROW LEVEL SECURITY;

-- 创建策略
CREATE POLICY "Users can view own achievement parents" ON achievements_parents
FOR SELECT USING (
    achievement_id IN (
        SELECT id FROM achievements WHERE publisher_id = auth.uid()
    )
);

CREATE POLICY "Users can insert own achievement parents" ON achievements_parents
FOR INSERT WITH CHECK (
    achievement_id IN (
        SELECT id FROM achievements WHERE publisher_id = auth.uid()
    )
);

-- 授权
GRANT SELECT, INSERT, UPDATE, DELETE ON achievements_parents TO authenticated;

-- 重置序列从1开始
ALTER SEQUENCE achievements_parents_id_seq RESTART WITH 1;

-- 验证表结构
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'achievements_parents' 
ORDER BY ordinal_position;

-- 显示完成信息
SELECT '✅ achievements_parents表修复完成！ID从1开始自增' as status;