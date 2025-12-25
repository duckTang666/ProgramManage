-- 更新achievements表结构以支持多协作者
-- 将parents_id从UUID改为TEXT类型，支持存储多个用户ID（逗号分隔）

-- 首先检查是否存在achievements表
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'achievements') THEN
        -- 检查parents_id字段是否存在
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'achievements' AND column_name = 'parents_id') THEN
            -- 如果字段存在且类型为UUID，则修改为TEXT
            ALTER TABLE achievements ALTER COLUMN parents_id TYPE TEXT USING parents_id::TEXT;
            RAISE NOTICE '已将parents_id字段从UUID类型修改为TEXT类型';
        ELSE
            -- 如果字段不存在，则添加为TEXT类型
            ALTER TABLE achievements ADD COLUMN parents_id TEXT;
            RAISE NOTICE '已添加parents_id字段，类型为TEXT';
        END IF;
        
        -- 添加注释说明
        COMMENT ON COLUMN achievements.parents_id IS '多个学生协作者ID，用逗号分隔，如"user1,user2,user3"';
    ELSE
        RAISE NOTICE 'achievements表不存在，请先创建achievements表';
    END IF;
END $$;

-- 更新现有的约束（如果有外键约束）
-- 由于我们要支持多个ID，需要移除外键约束（如果存在）
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name = 'achievements' 
          AND tc.constraint_type = 'FOREIGN KEY'
          AND kcu.column_name = 'parents_id'
    ) THEN
        ALTER TABLE achievements DROP CONSTRAINT achievements_parents_id_fkey;
        RAISE NOTICE '已移除parents_id字段的外键约束';
    END IF;
END $$;

-- 验证表结构修改结果
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'achievements' AND column_name = 'parents_id'
ORDER BY ordinal_position;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_achievements_parents_id ON achievements USING gin((string_to_array(parents_id, ',')));

RAISE NOTICE '已为parents_id字段创建GIN索引，支持多值查询';
RAISE NOTICE '数据库表结构更新完成！现在parents_id字段支持存储多个学生协作者ID';