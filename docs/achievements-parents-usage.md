# achievements_parents 表使用说明

## 表结构说明

`achievements_parents` 表用于存储成果与协作者的多对多关系：

| 字段名 | 类型 | 说明 | 示例 |
|---------|------|------|--------|
| id | BIGSERIAL | 自增主键，从1开始 | 1, 2, 3... |
| achievement_id | UUID | 成果ID，关联achievements表的id | 成果A的UUID |
| parent_id | UUID | 协作者用户ID，关联users表的id | 用户1的UUID |
| created_at | TIMESTAMPTZ | 创建时间，自动生成 | 2024-01-01 12:00:00 |

## 数据流程

### 1. 创建成果时添加协作者

```typescript
// 前端传递的数据
const achievementData = {
  title: "项目标题",
  description: "项目描述",
  publisher_id: "student-uuid",
  instructor_id: "teacher-uuid",
  parents_ids: [  // 多个协作者ID数组
    "collaborator-1-uuid",
    "collaborator-2-uuid", 
    "collaborator-3-uuid"
  ]
};

// 系统处理过程：
// 1. 在achievements表中创建一条记录，生成achievement.uuid
// 2. 将parents_ids数组拆分为多行，在achievements_parents表中创建多条记录
// 3. 每行记录包含：
//    - achievement_id: achievement.uuid
//    - parent_id: parents_ids数组中的每个元素
//    - id: 自动生成 1, 2, 3...
//    - created_at: NOW()
```

### 2. achievements_parents 表示例

```sql
-- 如果有3个协作者，会在achievements_parents表中创建3行记录：
INSERT INTO achievements_parents (achievement_id, parent_id) VALUES
('achievement-uuid-123', 'collaborator-1-uuid'),  -- id: 1
('achievement-uuid-123', 'collaborator-2-uuid'),  -- id: 2  
('achievement-uuid-123', 'collaborator-3-uuid');  -- id: 3
```

## API 使用方法

### 创建成果并添加协作者

```typescript
import { AchievementService } from './lib/achievementService';

const result = await AchievementService.createAchievement({
  title: "多协作者项目",
  description: "项目描述",
  type_id: "type-uuid",
  publisher_id: "student-uuid", 
  instructor_id: "teacher-uuid",
  parents_ids: [
    "user-uuid-1",
    "user-uuid-2",
    "user-uuid-3"
  ]
});
```

### 获取成果协作者

```typescript
const parentsResult = await AchievementService.getAchievementParents(achievementId);
if (parentsResult.success) {
  console.log('协作者列表:', parentsResult.data);
  // 输出示例：
  // [
  //   {
  //     id: 1,
  //     achievement_id: "achievement-uuid",
  //     parent_id: "user-uuid-1", 
  //     created_at: "2024-01-01T12:00:00Z"
  //   },
  //   {
  //     id: 2,
  //     achievement_id: "achievement-uuid",
  //     parent_id: "user-uuid-2",
  //     created_at: "2024-01-01T12:00:00Z"
  //   }
  // ]
}
```

### 更新协作者

```typescript
// 替换所有协作者
const updateResult = await AchievementService.updateAchievementParents(achievementId, [
  "new-user-uuid-1",
  "new-user-uuid-2"
]);
```

## 数据库查询示例

### 查询成果的所有协作者

```sql
SELECT 
    ap.id as parent_relation_id,
    ap.achievement_id,
    ap.parent_id,
    u.username,
    u.full_name,
    u.email,
    ap.created_at
FROM achievements_parents ap
JOIN users u ON ap.parent_id = u.id
WHERE ap.achievement_id = 'your-achievement-uuid'
ORDER BY ap.id;
```

### 查询用户参与的所有成果

```sql
SELECT 
    a.id as achievement_id,
    a.title,
    a.created_at,
    ap.parent_relation_id,
    ap.created_at as joined_at
FROM achievements a
JOIN achievements_parents ap ON a.id = ap.achievement_id
WHERE ap.parent_id = 'user-uuid'
ORDER BY a.created_at DESC;
```

## 功能特点

✅ **自动ID生成**: achievements_parents.id 使用 BIGSERIAL，从1开始自增  
✅ **UUID关联**: achievement_id 和 parent_id 都使用UUID类型  
✅ **时间戳**: created_at 自动生成，精确到毫秒  
✅ **唯一约束**: 防止同一成果重复添加相同协作者  
✅ **级联删除**: 删除成果时自动删除相关协作者关系  
✅ **性能优化**: 包含必要的索引  

## 注意事项

1. **外键约束**: achievement_id 必须存在于 achievements 表中
2. **外键约束**: parent_id 必须存在于 users 表中  
3. **唯一约束**: 同一成果不能重复添加相同协作者
4. **级联删除**: 删除成果时自动清理相关协作者关系
5. **RLS策略**: 只有成果发布者可以管理协作者关系