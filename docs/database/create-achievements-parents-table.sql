-- 创建achievements_parents中间表
-- 用于存储成果与协作者的多对多关系

-- 创建achievements_parents表
CREATE TABLE IF NOT EXISTS achievements_parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- 确保同一成果不会重复添加同一个协作者
    UNIQUE(achievement_id, parent_id)
);

-- 添加注释
COMMENT ON TABLE achievements_parents IS '成果与协作者的多对多关系表';
COMMENT ON COLUMN achievements_parents.achievement_id IS '成果ID，关联achievements表的主键';
COMMENT ON COLUMN achievements_parents.parent_id IS '协作者用户ID，关联users表的主键';

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_achievements_parents_achievement_id 
ON achievements_parents(achievement_id);

CREATE INDEX IF NOT EXISTS idx_achievements_parents_parent_id 
ON achievements_parents(parent_id);

-- 创建复合索引用于快速查找协作者的成果
CREATE INDEX IF NOT EXISTS idx_achievements_parents_composite 
ON achievements_parents(achievement_id, parent_id);

-- 启用行级安全策略
ALTER TABLE achievements_parents ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
-- 用户可以查看自己关联的协作者关系
CREATE POLICY "Users can view own achievement parents" ON achievements_parents
FOR SELECT USING (
    achievement_id IN (
        SELECT id FROM achievements WHERE publisher_id = auth.uid()
    )
);

-- 用户可以为自己的成果添加协作者
CREATE POLICY "Users can insert own achievement parents" ON achievements_parents
FOR INSERT WITH CHECK (
    achievement_id IN (
        SELECT id FROM achievements WHERE publisher_id = auth.uid()
    )
);

-- 用户可以删除自己成果的协作者关系
CREATE POLICY "Users can delete own achievement parents" ON achievements_parents
FOR DELETE USING (
    achievement_id IN (
        SELECT id FROM achievements WHERE publisher_id = auth.uid()
    )
);

-- 授予必要的权限
GRANT SELECT, INSERT, UPDATE, DELETE ON achievements_parents TO authenticated;
GRANT SELECT ON achievements_parents TO anon;

-- 验证表结构
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'achievements_parents'
ORDER BY ordinal_position;

-- 显示创建结果
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'achievements_parents') THEN
        RAISE NOTICE '✅ achievements_parents表创建成功！';
        RAISE NOTICE '📋 表结构：';
        RAISE NOTICE '   - id: UUID (主键)';
        RAISE NOTICE '   - achievement_id: UUID (外键 → achievements.id)';
        RAISE NOTICE '   - parent_id: UUID (外键 → users.id)';
        RAISE NOTICE '   - created_at: TIMESTAMPTZ';
        RAISE NOTICE '   - UNIQUE约束: (achievement_id, parent_id)';
        RAISE NOTICE '🔒 安全策略已配置';
        RAISE NOTICE '📊 索引已创建';
    ELSE
        RAISE EXCEPTION '❌ achievements_parents表创建失败';
    END IF;
END $$;