# 成果协作者关系表更新说明

## 更新目标
1. 新成果的UUID存储到`achievements_parents.achievement_id`
2. `achievements.parents_id`存储到`achievements_parents.parent_id`
3. `achievements_parents`表的ID从1开始自增整数

## 已完成的修改

### 1. 数据库表结构更新
- **文件**: `docs/database/update-achievements-parents-serial-id.sql`
- **修改内容**:
  - 将`id`字段从UUID改为BIGSERIAL（自增整数）
  - 设置序列从1开始
  - 重新创建所有索引和RLS策略

### 2. 类型定义更新
- **文件**: `src/types/achievement.ts`
- **修改内容**:
  ```typescript
  export interface AchievementParent {
    id: number;              // 改为自增整数ID
    achievement_id: string;   // 成果UUID
    parent_id: string;       // 协作者用户UUID
    created_at: string;
  }
  ```

### 3. 服务层代码更新
- **文件**: `src/lib/achievementService.ts`
- **修改内容**:
  - `addAchievementParents`方法：添加详细日志，确保数据正确插入
  - `saveDraft`方法：新增协作者关系处理逻辑
  - `createAchievement`方法：协作者关系处理已存在且正确

## 数据流程
```
1. 用户创建成果，选择协作者
2. 前端传递parents_ids数组到后端
3. 创建成果记录到achievements表（生成achievement UUID）
4. 调用addAchievementParents(achievement.id, parents_ids)
5. 批量插入achievements_parents表：
   - id: 自增整数（1, 2, 3...）
   - achievement_id: 新创建的成果UUID
   - parent_id: 协作者用户UUID
```

## 执行步骤

### 第一步：执行数据库更新
```sql
-- 在Supabase SQL编辑器中执行
-- 文件：docs/database/update-achievements-parents-serial-id.sql
```

### 第二步：重启应用
```bash
npm run dev
```

### 第三步：测试功能
1. 学生登录系统
2. 创建新成果
3. 选择多个协作者
4. 发布成果
5. 检查数据库achievements_parents表数据

## 预期结果
- achievements_parents表的id从1开始自增
- achievement_id正确存储新成果的UUID
- parent_id正确存储协作者的用户UUID
- 每个协作者对应一行记录

## 验证SQL
```sql
-- 查看achievements_parents表结构
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'achievements_parents' ORDER BY ordinal_position;

-- 查看插入的数据
SELECT * FROM achievements_parents ORDER BY id;
```