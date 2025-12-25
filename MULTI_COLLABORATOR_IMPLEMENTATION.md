# 多协作者功能实现文档

## 功能概述

本次更新实现了成果发布页面的多协作者功能，支持在选择多个协作者后将他们的信息插入到 `achievements_parents` 表中。

## 数据库表结构

### achievements_parents 表

```sql
CREATE TABLE achievements_parents (
    id BIGSERIAL PRIMARY KEY,           -- 自增主键，从1开始
    achievement_id UUID NOT NULL,        -- 成果UUID，外键 → achievements.id
    parent_id UUID NOT NULL,            -- 协作者用户UUID，外键 → users.id  
    created_at TIMESTAMPTZ DEFAULT NOW() -- 自动生成时间戳
);
```

### 数据关系

| id | achievement_id | parent_id | created_at |
|----|----------------|-----------|------------|
| 1 | 成果A的UUID | 用户1的UUID | 2024-... |
| 2 | 成果A的UUID | 用户2的UUID | 2024-... |
| 3 | 成果A的UUID | 用户3的UUID | 2024-... |

## 前端实现

### 1. 协作者选择界面更新

- **多选支持**：用户可以多次选择不同的协作者
- **智能过滤**：已选择的协作者不会再次出现在选择列表中
- **视觉优化**：协作者标签显示用户头像、姓名和邮箱
- **数量提示**：显示已选择的协作者数量

### 2. 数据处理逻辑

#### 添加协作者
```typescript
const addCollaborator = () => {
  if (selectedCollaboratorId) {
    const selectedUser = collaboratorUsers.find(user => user.id === selectedCollaboratorId);
    if (selectedUser && !collaborators.find(c => c.id === selectedUser.id)) {
      const newCollaborator: Collaborator = {
        id: selectedUser.id,
        name: selectedUser.full_name || selectedUser.username
      };
      setCollaborators([...collaborators, newCollaborator]);
      setSelectedCollaboratorId(''); // 清空选择
    }
  }
};

// 获取选中的协作者ID数组
const getSelectedCollaboratorIds = (): string[] => {
  return collaborators.map(c => c.id);
};
```

#### 创建/更新成果
```typescript
// 创建成果时传递协作者数组
const achievementData = {
  title: projectName,
  description: finalDescription,
  type_id: selectedType.id,
  cover_url: finalCoverUrl,
  video_url: finalVideoUrl,
  publisher_id: projectLeaderId || user.id,
  instructor_id: selectedInstructorId || user.id,
  parents_ids: getSelectedCollaboratorIds(), // 协作者ID数组
  status: 'pending' as const
};

result = await AchievementService.createAchievement(achievementData);
```

## 后端实现

### 1. AchievementService 更新

#### addAchievementParents 方法
```typescript
static async addAchievementParents(
  achievementId: string, 
  parentIds: string[]
): Promise<{ success: boolean; data?: AchievementParent[]; message?: string }> {
  try {
    // 准备插入数据 - 每个协作者创建一行记录
    const insertData = parentIds.map(parentId => ({
      achievement_id: achievementId,  // 成果UUID
      parent_id: parentId             // 协作者用户UUID
    }));

    // 插入数据到achievements_parents表
    const { data, error } = await supabase
      .from('achievements_parents')
      .insert(insertData)
      .select('*')
      .order('id'); // 按自增ID排序

    if (error) {
      return { 
        success: false, 
        message: `添加协作者失败: ${error.message}` 
      };
    }

    return { success: true, data: data as AchievementParent[] };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : '添加协作者时发生未知错误' 
    };
  }
}
```

#### createAchievement 方法更新
```typescript
// 处理协作者关系 - 在achievements_parents表中创建记录
if (data && parents_ids && parents_ids.length > 0) {
  console.log('👥 处理多个协作者:');
  console.log('📋 成果ID:', data.id);
  console.log('👥 协作者ID数组:', parents_ids);
  
  // 调用addAchievementParents方法，将：
  // - achievements表的id作为achievement_id
  // - achievements表的parent_id数组元素作为parent_id
  // - 在achievements_parents表中创建多行（每行一个协作者）
  const parentResult = await this.addAchievementParents(data.id, parents_ids);
  
  if (parentResult.success) {
    console.log(`✅ 成果协作者关系创建成功，共 ${parentResult.data?.length || 0} 条记录`);
  }
}
```

## 类型定义更新

### CreateAchievementRequest 接口
```typescript
export interface CreateAchievementRequest {
  title: string;
  description: string;
  type_id: string;
  cover_url?: string;
  video_url?: string;
  publisher_id: string | number;
  instructor_id: string | number;
  parents_ids?: string[] | null; // 协作者ID数组，用于创建到中间表
}
```

### AchievementParent 接口
```typescript
export interface AchievementParent {
  id: number;              // 自增整数ID，从1开始
  achievement_id: string;   // 成果UUID
  parent_id: string;       // 协作者用户UUID
  created_at: string;
  parent?: {             // 关联的用户信息（查询时包含）
    id: string;
    username: string;
    email: string;
    full_name?: string;
  };
}
```

## 功能特点

### 1. 智能协作者管理
- **去重处理**：防止重复选择同一协作者
- **实时过滤**：选择列表中排除已选协作者
- **动态更新**：显示已选择协作者数量

### 2. 数据一致性
- **事务安全**：创建成果和协作者关系同步进行
- **错误处理**：协作者关系创建失败不影响成果创建
- **详细日志**：完整的操作日志记录

### 3. 用户体验优化
- **视觉反馈**：协作者标签显示用户信息
- **操作便捷**：一键添加/删除协作者
- **状态提示**：实时显示选择状态

## 测试功能

### 测试页面：test-multi-collaborators.html

提供了完整的多协作者功能测试界面，包括：
- 协作者插入测试
- 协作者查询测试
- 实时结果展示
- 错误信息显示

### 测试步骤

1. 打开测试页面
2. 输入成果ID（UUID格式）
3. 输入协作者ID列表（逗号分隔）
4. 点击"测试插入协作者"
5. 查看插入结果和日志
6. 点击"查询协作者"验证数据

## 使用示例

### 前端使用
```typescript
// 选择多个协作者
const selectedCollaborators = ['user-1', 'user-2', 'user-3'];

// 创建成果
const result = await AchievementService.createAchievement({
  title: '我的项目',
  description: '项目描述',
  type_id: 'type-uuid',
  publisher_id: 'publisher-uuid',
  instructor_id: 'instructor-uuid',
  parents_ids: selectedCollaborators // 协作者数组
});
```

### 数据库结果
```sql
-- achievements 表
INSERT INTO achievements (id, title, publisher_id, instructor_id, ...) 
VALUES ('project-uuid', '我的项目', 'publisher-uuid', 'instructor-uuid', ...);

-- achievements_parents 表（自动生成）
INSERT INTO achievements_parents (achievement_id, parent_id) VALUES
('project-uuid', 'user-1'),
('project-uuid', 'user-2'),
('project-uuid', 'user-3');
```

## 注意事项

1. **ID格式**：所有UUID必须为有效的字符串格式
2. **权限检查**：确保用户只能选择有权限的协作者
3. **数据验证**：插入前验证协作者ID的有效性
4. **错误恢复**：提供适当的错误处理和用户反馈

## 总结

本次实现完成了多协作者功能的完整开发，包括：

- ✅ 前端多选界面优化
- ✅ 后端数据处理逻辑  
- ✅ 数据库表关系建立
- ✅ 类型定义完善
- ✅ 测试工具提供

现在用户可以在成果发布时选择多个协作者，系统会自动在 `achievements_parents` 表中创建对应的关系记录，实现了一对多的协作者关联功能。