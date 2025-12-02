-- 为grades表创建32个班级（4个年级，每个年级8个班：软件工程1-8班）
-- grades表中的ID作为外键关联到classes表的grade_id字段

-- 2022级（ed4befb4-538e-409d-a66b-0d2a9cb04796）- 软件工程1-8班
INSERT INTO classes (id, name, grade_id, instructor_id, created_at) VALUES
(gen_random_uuid(), '软件工程1班', 'ed4befb4-538e-409d-a66b-0d2a9cb04796', NULL, NOW()),
(gen_random_uuid(), '软件工程2班', 'ed4befb4-538e-409d-a66b-0d2a9cb04796', NULL, NOW()),
(gen_random_uuid(), '软件工程3班', 'ed4befb4-538e-409d-a66b-0d2a9cb04796', NULL, NOW()),
(gen_random_uuid(), '软件工程4班', 'ed4befb4-538e-409d-a66b-0d2a9cb04796', NULL, NOW()),
(gen_random_uuid(), '软件工程5班', 'ed4befb4-538e-409d-a66b-0d2a9cb04796', NULL, NOW()),
(gen_random_uuid(), '软件工程6班', 'ed4befb4-538e-409d-a66b-0d2a9cb04796', NULL, NOW()),
(gen_random_uuid(), '软件工程7班', 'ed4befb4-538e-409d-a66b-0d2a9cb04796', NULL, NOW()),
(gen_random_uuid(), '软件工程8班', 'ed4befb4-538e-409d-a66b-0d2a9cb04796', NULL, NOW());

-- 2023级（d1723fe7-b654-4a9f-932f-02b7a31d30b0）- 软件工程1-8班
INSERT INTO classes (id, name, grade_id, instructor_id, created_at) VALUES
(gen_random_uuid(), '软件工程1班', 'd1723fe7-b654-4a9f-932f-02b7a31d30b0', NULL, NOW()),
(gen_random_uuid(), '软件工程2班', 'd1723fe7-b654-4a9f-932f-02b7a31d30b0', NULL, NOW()),
(gen_random_uuid(), '软件工程3班', 'd1723fe7-b654-4a9f-932f-02b7a31d30b0', NULL, NOW()),
(gen_random_uuid(), '软件工程4班', 'd1723fe7-b654-4a9f-932f-02b7a31d30b0', NULL, NOW()),
(gen_random_uuid(), '软件工程5班', 'd1723fe7-b654-4a9f-932f-02b7a31d30b0', NULL, NOW()),
(gen_random_uuid(), '软件工程6班', 'd1723fe7-b654-4a9f-932f-02b7a31d30b0', NULL, NOW()),
(gen_random_uuid(), '软件工程7班', 'd1723fe7-b654-4a9f-932f-02b7a31d30b0', NULL, NOW()),
(gen_random_uuid(), '软件工程8班', 'd1723fe7-b654-4a9f-932f-02b7a31d30b0', NULL, NOW());

-- 2024级（8b5a2258-6335-4faa-b005-fe121bfbb7fd）- 软件工程1-8班
INSERT INTO classes (id, name, grade_id, instructor_id, created_at) VALUES
(gen_random_uuid(), '软件工程1班', '8b5a2258-6335-4faa-b005-fe121bfbb7fd', NULL, NOW()),
(gen_random_uuid(), '软件工程2班', '8b5a2258-6335-4faa-b005-fe121bfbb7fd', NULL, NOW()),
(gen_random_uuid(), '软件工程3班', '8b5a2258-6335-4faa-b005-fe121bfbb7fd', NULL, NOW()),
(gen_random_uuid(), '软件工程4班', '8b5a2258-6335-4faa-b005-fe121bfbb7fd', NULL, NOW()),
(gen_random_uuid(), '软件工程5班', '8b5a2258-6335-4faa-b005-fe121bfbb7fd', NULL, NOW()),
(gen_random_uuid(), '软件工程6班', '8b5a2258-6335-4faa-b005-fe121bfbb7fd', NULL, NOW()),
(gen_random_uuid(), '软件工程7班', '8b5a2258-6335-4faa-b005-fe121bfbb7fd', NULL, NOW()),
(gen_random_uuid(), '软件工程8班', '8b5a2258-6335-4faa-b005-fe121bfbb7fd', NULL, NOW());

-- 2025级（854dc7b2-7e7c-4f7a-bf70-6bc45f371408）- 软件工程1-8班
INSERT INTO classes (id, name, grade_id, instructor_id, created_at) VALUES
(gen_random_uuid(), '软件工程1班', '854dc7b2-7e7c-4f7a-bf70-6bc45f371408', NULL, NOW()),
(gen_random_uuid(), '软件工程2班', '854dc7b2-7e7c-4f7a-bf70-6bc45f371408', NULL, NOW()),
(gen_random_uuid(), '软件工程3班', '854dc7b2-7e7c-4f7a-bf70-6bc45f371408', NULL, NOW()),
(gen_random_uuid(), '软件工程4班', '854dc7b2-7e7c-4f7a-bf70-6bc45f371408', NULL, NOW()),
(gen_random_uuid(), '软件工程5班', '854dc7b2-7e7c-4f7a-bf70-6bc45f371408', NULL, NOW()),
(gen_random_uuid(), '软件工程6班', '854dc7b2-7e7c-4f7a-bf70-6bc45f371408', NULL, NOW()),
(gen_random_uuid(), '软件工程7班', '854dc7b2-7e7c-4f7a-bf70-6bc45f371408', NULL, NOW()),
(gen_random_uuid(), '软件工程8班', '854dc7b2-7e7c-4f7a-bf70-6bc45f371408', NULL, NOW());

