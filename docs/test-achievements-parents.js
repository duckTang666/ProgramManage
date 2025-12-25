// 测试achievements_parents表功能的SQL脚本
// 在Supabase SQL编辑器中运行这些命令

console.log(`
========================================================
             测试 achievements_parents 表功能
========================================================

1. 首先验证表结构：
`);

const checkTableStructure = `
-- 检查achievements_parents表结构
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'achievements_parents'
ORDER BY ordinal_position;
`;

console.log(checkTableStructure);

console.log(`
2. 插入测试数据（模拟创建成果并添加多个协作者）：
`);

const insertTestData = `
-- 插入测试数据
-- 模拟场景：创建成果A，添加3个协作者

-- 先创建一个测试成果（如果不存在）
INSERT INTO achievements (id, title, description, publisher_id, instructor_id, status)
VALUES (
    'test-achievement-001', 
    '测试多协作者成果', 
    '这是用于测试achievements_parents表的成果',
    'test-publisher-001',
    'test-instructor-001',
    1
) ON CONFLICT (id) DO NOTHING;

-- 为成果添加多个协作者到achievements_parents表
-- 每个协作者一行，id自动生成（1, 2, 3...）
INSERT INTO achievements_parents (achievement_id, parent_id) VALUES
    ('test-achievement-001', 'test-parent-001'),  -- 期望 id: 1
    ('test-achievement-001', 'test-parent-002'),  -- 期望 id: 2
    ('test-achievement-001', 'test-parent-003')   -- 期望 id: 3
ON CONFLICT (achievement_id, parent_id) DO NOTHING;
`;

console.log(insertTestData);

console.log(`
3. 查询插入结果：
`);

const queryResults = `
-- 查询插入的achievements_parents数据
-- 验证：
-- - id 是否从1开始自增
-- - achievement_id 是否正确来自achievements表的id
-- - parent_id 是否对应协作者UUID
-- - created_at 是否自动生成
SELECT 
    ap.id as "自增ID",
    ap.achievement_id as "成果ID",
    ap.parent_id as "协作者ID", 
    ap.created_at as "创建时间",
    u.username as "协作者用户名"
FROM achievements_parents ap
LEFT JOIN users u ON ap.parent_id = u.id
WHERE ap.achievement_id = 'test-achievement-001'
ORDER BY ap.id;
`;

console.log(queryResults);

console.log(`
4. 测试多协作者场景：
`);

const testMultipleCollaborators = `
-- 测试场景：为同一个成果添加更多协作者
INSERT INTO achievements_parents (achievement_id, parent_id) VALUES
    ('test-achievement-001', 'test-parent-004'),  -- 期望 id: 4
    ('test-achievement-001', 'test-parent-005'),  -- 期望 id: 5
    ('test-achievement-001', 'test-parent-006')   -- 期望 id: 6
ON CONFLICT (achievement_id, parent_id) DO NOTHING;

-- 查询结果
SELECT 
    COUNT(*) as "协作者总数",
    MIN(id) as "最小ID",
    MAX(id) as "最大ID"
FROM achievements_parents 
WHERE achievement_id = 'test-achievement-001';
`;

console.log(testMultipleCollaborators);

console.log(`
5. 测试级联删除：
`);

const testCascadeDelete = `
-- 测试删除成果时级联删除协作者关系
-- 首先查看删除前的数据
SELECT '删除前' as "操作", COUNT(*) as "协作者数量" 
FROM achievements_parents 
WHERE achievement_id = 'test-achievement-001';

-- 删除成果（应该级联删除相关的achievements_parents记录）
DELETE FROM achievements WHERE id = 'test-achievement-001';

-- 验证级联删除效果
SELECT '删除后' as "操作", COUNT(*) as "协作者数量" 
FROM achievements_parents 
WHERE achievement_id = 'test-achievement-001';
`;

console.log(testCascadeDelete);

console.log(`
6. 清理测试数据：
`);

const cleanup = `
-- 清理测试数据
DELETE FROM achievements_parents WHERE achievement_id LIKE 'test-%';
DELETE FROM achievements WHERE id LIKE 'test-%';
`;

console.log(cleanup);

console.log(`
========================================================
              测试完成，请查看结果验证
========================================================

预期结果：
✅ achievements_parents.id 应该是从1开始的连续自增整数
✅ achievement_id 应该对应achievements表的id字段
✅ parent_id 应该对应协作者的用户UUID
✅ created_at 应该是自动生成的时间戳
✅ 多个协作者应该创建多行记录
✅ 删除成果时应该级联删除相关协作者记录
========================================================
`);