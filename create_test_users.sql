-- 创建测试用户数据
-- 注意：实际使用时应该使用密码哈希，这里为了演示使用明文

-- 管理员用户 (role=3)
INSERT INTO users (id, username, full_name, email, password_hash, role, created_at, updated_at) VALUES
(gen_random_uuid(), 'admin1', '系统管理员', 'admin@example.com', 'hashed_password_1', 3, NOW(), NOW()),
(gen_random_uuid(), 'admin2', '副院长', 'dean@example.com', 'hashed_password_2', 3, NOW(), NOW());

-- 教师用户 (role=2)
INSERT INTO users (id, username, full_name, email, password_hash, role, created_at, updated_at) VALUES
(gen_random_uuid(), 'teacher1', '张教授', 'zhang@example.com', 'hashed_password_3', 2, NOW(), NOW()),
(gen_random_uuid(), 'teacher2', '李讲师', 'li@example.com', 'hashed_password_4', 2, NOW(), NOW()),
(gen_random_uuid(), 'teacher3', '王副教授', 'wang@example.com', 'hashed_password_5', 2, NOW(), NOW()),
(gen_random_uuid(), 'teacher4', '陈助教', 'chen@example.com', 'hashed_password_6', 2, NOW(), NOW());

-- 学生用户 (role=1) - 为每个班级创建一些学生
-- 2022级学生
INSERT INTO users (id, username, full_name, email, password_hash, role, class_id, created_at, updated_at) 
SELECT 
  gen_random_uuid(), 
  'student_' || (ROW_NUMBER() OVER (ORDER BY random())),
  '学生' || (ROW_NUMBER() OVER (ORDER BY random())),
  'student2022_' || (ROW_NUMBER() OVER (ORDER BY random())) || '@example.com',
  'hashed_password_' || (ROW_NUMBER() OVER (ORDER BY random()) + 10),
  1,
  c.id,
  NOW(),
  NOW()
FROM classes c 
WHERE c.grade_id = 'ed4befb4-538e-409d-a66b-0d2a9cb04796'  -- 2022级
CROSS JOIN generate_series(1, 5)  -- 每班5个学生
LIMIT 40;

-- 2023级学生
INSERT INTO users (id, username, full_name, email, password_hash, role, class_id, created_at, updated_at) 
SELECT 
  gen_random_uuid(), 
  'student_' || (ROW_NUMBER() OVER (ORDER BY random())),
  '学生' || (ROW_NUMBER() OVER (ORDER BY random())),
  'student2023_' || (ROW_NUMBER() OVER (ORDER BY random())) || '@example.com',
  'hashed_password_' || (ROW_NUMBER() OVER (ORDER BY random()) + 50),
  1,
  c.id,
  NOW(),
  NOW()
FROM classes c 
WHERE c.grade_id = 'd1723fe7-b654-4a9f-932f-02b7a31d30b0'  -- 2023级
CROSS JOIN generate_series(1, 6)  -- 每班6个学生
LIMIT 48;

-- 2024级学生
INSERT INTO users (id, username, full_name, email, password_hash, role, class_id, created_at, updated_at) 
SELECT 
  gen_random_uuid(), 
  'student_' || (ROW_NUMBER() OVER (ORDER BY random())),
  '学生' || (ROW_NUMBER() OVER (ORDER BY random())),
  'student2024_' || (ROW_NUMBER() OVER (ORDER BY random())) || '@example.com',
  'hashed_password_' || (ROW_NUMBER() OVER (ORDER BY random()) + 100),
  1,
  c.id,
  NOW(),
  NOW()
FROM classes c 
WHERE c.grade_id = '8b5a2258-6335-4faa-b005-fe121bfbb7fd'  -- 2024级
CROSS JOIN generate_series(1, 7)  -- 每班7个学生
LIMIT 56;

-- 2025级学生
INSERT INTO users (id, username, full_name, email, password_hash, role, class_id, created_at, updated_at) 
SELECT 
  gen_random_uuid(), 
  'student_' || (ROW_NUMBER() OVER (ORDER BY random())),
  '学生' || (ROW_NUMBER() OVER (ORDER BY random())),
  'student2025_' || (ROW_NUMBER() OVER (ORDER BY random())) || '@example.com',
  'hashed_password_' || (ROW_NUMBER() OVER (ORDER BY random()) + 150),
  1,
  c.id,
  NOW(),
  NOW()
FROM classes c 
WHERE c.grade_id = '854dc7b2-7e7c-4f7a-bf70-6bc45f371408'  -- 2025级
CROSS JOIN generate_series(1, 8)  -- 每班8个学生
LIMIT 64;

-- 验证创建结果
SELECT 
  '管理员' as user_type,
  COUNT(*) as count,
  STRING_AGG(full_name, ', ' ORDER BY full_name) as names
FROM users WHERE role = 3

UNION ALL

SELECT 
  '教师' as user_type,
  COUNT(*) as count,
  STRING_AGG(full_name, ', ' ORDER BY full_name) as names
FROM users WHERE role = 2

UNION ALL

SELECT 
  '学生' as user_type,
  COUNT(*) as count,
  '共' || COUNT(*) || '名学生' as names
FROM users WHERE role = 1

UNION ALL

SELECT 
  g.name as user_type,
  COUNT(u.id) as count,
  '该年级共有' || COUNT(u.id) || '名学生' as names
FROM grades g
LEFT JOIN classes c ON g.id = c.grade_id
LEFT JOIN users u ON c.id = u.class_id AND u.role = 1
GROUP BY g.id, g.name
ORDER BY g.name DESC;