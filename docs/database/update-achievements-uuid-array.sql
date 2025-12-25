-- 将achievements表中的parents_id改为uuid[]数组类型
-- 使用PostgreSQL的原生UUID数组类型来存储多个协作者ID

-- 检查achievements表是否存在
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'achievements') THEN
        RAISE NOTICE '开始更新achievements表的parents_id字段为uuid[]类型';
    ELSE
        RAISE EXCEPTION 'achievements表不存在，请先创建achievements表';
    END IF;
END $$;

-- 1. 首先备份现有数据（如果有）
CREATE TEMPORARY TABLE achievements_parents_backup AS 
SELECT id, parents_id FROM achievements WHERE parents_id IS NOT NULL AND parents_id != '';

RAISE NOTICE '已备份现有的parents_id数据到临时表';

-- 2. 如果parents_id字段存在且为TEXT类型，先转换现有数据
DO $$
BEGIN
    -- 检查字段是否存在
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'achievements' AND column_name = 'parents_id'
    ) THEN
        -- 获取当前数据类型
        DECLARE
            current_data_type TEXT;
        BEGIN
            SELECT data_type INTO current_data_type
            FROM information_schema.columns 
            WHERE table_name = 'achievements' AND column_name = 'parents_id';
            
            RAISE NOTICE '当前parents_id字段类型: %', current_data_type;
            
            -- 如果是TEXT或VARCHAR类型，转换现有数据
            IF current_data_type IN ('text', 'character varying', 'varchar') THEN
                -- 转换现有的逗号分隔字符串为UUID数组
                UPDATE achievements 
                SET parents_id = CASE 
                    WHEN parents_id IS NULL OR parents_id = '' THEN NULL
                    WHEN parents_id ~ '^[0-9a-fA-F-]{36}(,[0-9a-fA-F-]{36})*$' THEN 
                        string_to_array(parents_id, ',')::uuid[]
                    ELSE NULL -- 无效格式设为NULL
                END
                WHERE parents_id IS NOT NULL;
                
                RAISE NOTICE '已转换现有的parents_id数据为UUID数组格式';
            END IF;
        END;
    END IF;
END $$;

-- 4. 修改字段类型为uuid[]
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'achievements' AND column_name = 'parents_id'
    ) THEN
        -- 修改现有字段类型
        ALTER TABLE achievements ALTER COLUMN parents_id TYPE uuid[];
        RAISE NOTICE '已将parents_id字段类型修改为uuid[]';
    ELSE
        -- 如果字段不存在，添加新字段
        ALTER TABLE achievements ADD COLUMN parents_id uuid[];
        RAISE NOTICE '已添加parents_id字段，类型为uuid[]';
    END IF;
END $$;

-- 5. 添加字段注释
COMMENT ON COLUMN achievements.parents_id IS '学生协作者ID数组，使用PostgreSQL uuid[]类型存储多个协作者';

-- 6. 创建GIN索引以提高数组查询性能
CREATE INDEX IF NOT EXISTS idx_achievements_parents_id_gin 
ON achievements USING gin(parents_id);

RAISE NOTICE '已为parents_id字段创建GIN索引，支持高效的数组查询';

-- 7. 验证更新结果
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    udt_name
FROM information_schema.columns 
WHERE table_name = 'achievements' AND column_name = 'parents_id';

-- 8. 显示更新后的数据示例
RAISE NOTICE '=== 数据更新验证 ===';
DO $$
DECLARE
    record_count INTEGER;
    null_count INTEGER;
    array_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO record_count FROM achievements;
    SELECT COUNT(*) INTO null_count FROM achievements WHERE parents_id IS NULL;
    SELECT COUNT(*) INTO array_count FROM achievements WHERE parents_id IS NOT NULL;
    
    RAISE NOTICE '总记录数: %', record_count;
    RAISE NOTICE 'parents_id为NULL的记录数: %', null_count;
    RAISE NOTICE 'parents_id有数据的记录数: %', array_count;
END $$;

-- 9. 展示数组数据的查询示例
RAISE NOTICE '=== UUID数组查询示例 ===';
RAISE NOTICE '查询包含特定协作者的成果:';
RAISE NOTICE 'SELECT * FROM achievements WHERE % = ANY(parents_id);', quote_literal('your-uuid-here');

RAISE NOTICE '查询协作者数量:';
RAISE NOTICE 'SELECT id, title, array_length(parents_id, 1) as collaborator_count FROM achievements WHERE parents_id IS NOT NULL;';

RAISE NOTICE '查询所有协作者:';
RAISE NOTICE 'SELECT DISTINCT unnest(parents_id) as collaborator_id FROM achievements WHERE parents_id IS NOT NULL;';

RAISE NOTICE '=== 更新完成！parents_id字段现在是uuid[]类型 ===';