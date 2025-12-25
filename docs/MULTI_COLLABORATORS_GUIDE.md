# 多协作者功能使用指南

## 🎯 功能概述

学生端成果发布现在支持添加多个学生协作者，允许多个学生共同参与一个成果项目。

## 🚀 功能特性

- **多选协作者**: 可以从学生列表中选择多个学生作为协作者
- **可视化显示**: 选中的协作者会以标签形式展示
- **数据存储**: 多个协作者ID以逗号分隔的形式存储在数据库中
- **兼容性**: 保持与现有外部合作伙伴功能的兼容性

## 📋 数据库结构更新

### 执行数据库更新脚本

在Supabase控制台的SQL编辑器中运行以下脚本：

```sql
-- 文件位置: docs/database/update-achievements-multi-collaborators.sql
-- 该脚本将：
-- 1. 将parents_id字段从UUID类型改为TEXT类型
-- 2. 移除外键约束
-- 3. 添加性能索引
-- 4. 添加字段注释
```

执行步骤：
1. 打开Supabase控制台 → SQL编辑器
2. 复制 `update-achievements-multi-collaborators.sql` 文件内容
3. 粘贴并执行

## 🎨 界面使用说明

### 在成果发布页面

1. **找到"学生协作者"部分**
   - 位置：基本信息 → 参与人员 → 学生协作者
   
2. **添加协作者**
   - 点击搜索按钮（🔍）
   - 在弹出的模态框中勾选多个学生
   - 可以看到已选择人数的实时统计
   
3. **查看选中结果**
   - 选中的协作者会以蓝色标签形式显示
   - 格式：`学生姓名（学生协作者）`
   
4. **清空选择**
   - 在模态框中点击"清空选择"按钮

## 💾 数据存储格式

### 数据库存储
- `parents_id` 字段格式：`"user1,user2,user3"`
- 多个用户ID用英文逗号分隔
- 空值或null表示没有学生协作者

### 前端处理
- 前端接收：`string[]` 数组格式
- 保存时：自动转换为逗号分隔的字符串
- 读取时：自动解析为数组格式

## 🔧 技术实现

### 核心文件修改

1. **类型定义** (`src/types/achievement.ts`)
   - 扩展接口支持多协作者
   - 添加 `parents_ids` 字段

2. **服务层** (`src/lib/achievementService.ts`)
   - 新增解析和序列化方法
   - 更新查询逻辑支持多协作者

3. **UI组件** (`src/pages/p-achievement_publish/index.tsx`)
   - 新增多选模态框组件
   - 更新表单处理逻辑
   - 优化预览显示

### 新增方法

```typescript
// 解析多协作者ID字符串为数组
static parseParentsIds(parentsId?: string): string[]

// 将协作者ID数组转换为字符串
static serializeParentsIds(parentsIds: string[]): string
```

## 🎨 UI组件

### MultiUserSelectModal 组件特性
- 支持多选checkbox
- 实时显示选择数量
- 一键清空选择功能
- 响应式设计

### 协作者标签显示
- 蓝色背景区分学生协作者
- 灰色背景区分外部合作伙伴
- 清晰的角色标识

## ✅ 测试验证

### 功能测试点
- [ ] 可以打开学生协作者选择模态框
- [ ] 可以同时选择多个学生
- [ ] 选中状态正确显示
- [ ] 可以取消选择
- [ ] 发布成果时正确保存多协作者
- [ ] 成果详情页面正确显示协作者信息
- [ ] 数据库字段格式正确

### 数据验证
```sql
-- 查询多协作者成果
SELECT id, title, parents_id 
FROM achievements 
WHERE parents_id IS NOT NULL 
  AND parents_id != '';

-- 验证存储格式
SELECT 
  id, 
  title,
  parents_id,
  string_to_array(parents_id, ',') as parsed_ids
FROM achievements 
WHERE parents_id LIKE '%,%';
```

## 🔄 向后兼容性

- 现有单协作者数据继续正常工作
- 空值处理保持一致
- API接口保持兼容

## 🐛 常见问题

### Q: 为什么选择的学生没有显示在列表中？
A: 确保学生用户role=1且不包含当前用户

### Q: 数据库更新失败怎么办？
A: 检查Supabase权限，确保有ALTER TABLE权限

### Q: 协作者数量有限制吗？
A: 目前没有硬性限制，但建议不超过10个以保证性能

## 📈 未来扩展

- 支持协作者权限设置
- 协作者协作历史记录
- 批量导入协作者
- 协作者推荐算法