# 轮播图管理功能使用指南

## 🎯 功能概述

轮播图管理功能允许管理员管理网站首页展示的轮播图内容，包括：
- 📸 轮播图图片管理（上传到Supabase Storage）
- 📝 文字内容编辑
- 🔗 跳转链接设置
- 🔄 显示顺序调整（1-10优先级）
- ✅ 启用/禁用状态控制
- 🔍 搜索和筛选功能

## 📁 数据库结构

### banners表字段说明

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|--------|
| id | UUID | 轮播图唯一标识 | `550e8400-e29b-41d4-a716-446655440000` |
| image_url | TEXT | 图片URL（从Supabase Storage获取） | `https://.../banner_image.jpg` |
| text_content | TEXT | 文字内容 | `学院最新通知：2024年项目展示会` |
| link_url | TEXT | 文字跳转链接 | `https://example.com/news` |
| display_order | INTEGER | 显示顺序（1-10，1优先级最高） | `1` |
| is_active | BOOLEAN | 是否启用（默认为true） | `true` |
| created_at | TIMESTAMP | 创建时间 | `2024-11-29T10:00:00Z` |
| updated_at | TIMESTAMP | 更新时间 | `2024-11-29T10:00:00Z` |

## 🛠️ 部署步骤

### 1. 创建数据库表
在Supabase控制台的SQL编辑器中运行：
```sql
-- 复制 docs/database/create-banners-table.sql 的内容并执行
```

### 2. 创建Storage存储桶
确保已创建 `banners` 存储桶：
- 访问 Supabase 控制台 → Storage
- 创建存储桶 `banners`
- 设置为公开访问
- 设置正确的权限策略

### 3. 验证环境变量
确认 `.env.local` 文件包含正确的Supabase配置：
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📋 功能操作说明

### 📸 图片上传
- **支持格式**: JPG, JPEG, PNG, GIF, WebP
- **文件大小**: 最大 10MB
- **存储位置**: Supabase Storage `banners` 桶
- **命名规则**: `banner_${timestamp}.${extension}`

### 📝 文字内容
- **必填字段**: 轮播图显示的文字说明
- **用途**: 在轮播图下方或悬浮时显示
- **长度建议**: 简洁明了，不超过50字

### 🔗 跳转链接
- **必填字段**: 点击轮播图时跳转的URL
- **格式**: 完整的HTTP/HTTPS链接
- **示例**: `https://example.com/news/detail`

### 🔄 显示顺序
- **范围**: 1-10
- **规则**: 数字越小，优先级越高
- **建议**: 重要轮播图使用较小数字

### ✅ 状态控制
- **启用**: 轮播图在网站显示
- **禁用**: 轮播图隐藏但不删除
- **切换**: 点击状态标签可快速切换

## 🎮 使用界面

### 主要区域

1. **搜索栏**: 按文字内容或链接搜索轮播图
2. **状态筛选**: 按启用/禁用状态筛选
3. **轮播图列表**: 显示所有轮播图及其详细信息
4. **添加按钮**: 打开新增轮播图模态框

### 列表操作

- **编辑**: 点击编辑图标修改轮播图信息
- **删除**: 点击删除图标移除轮播图（会同时删除Storage中的图片）
- **状态**: 点击状态标签切换启用/禁用状态

### 添加/编辑表单

1. **图片上传**: 点击上传区域选择图片文件
2. **文字内容**: 输入轮播图显示的文字
3. **跳转链接**: 输入点击后的跳转地址
4. **显示顺序**: 设置1-10的优先级数字
5. **状态**: 选择启用或禁用

## 🔧 API接口

### BannerService 方法

| 方法名 | 功能 | 参数 | 返回 |
|--------|------|------|------|
| getBanners() | 获取轮播图列表 | filters对象 | BannerListResponse |
| getBannerById() | 获取单个轮播图 | id字符串 | Banner对象 |
| createBanner() | 创建轮播图 | BannerRequest | BannerOperationResult |
| updateBanner() | 更新轮播图 | id, BannerRequest | BannerOperationResult |
| deleteBanner() | 删除轮播图 | id字符串 | BannerOperationResult |
| updateBannerStatus() | 更新状态 | id, boolean | BannerOperationResult |
| uploadBannerImage() | 上传图片 | File对象 | {success, url, message} |
| getActiveBanners() | 获取启用的轮播图 | 无 | Banner数组 |

## 🚨 注意事项

### 安全考虑
- 所有图片上传都经过类型和大小验证
- 删除轮播图时会同时删除Storage中的文件
- SQL注入防护通过Supabase ORM实现

### 性能优化
- 轮播图列表支持分页显示
- 使用索引优化数据库查询
- 图片使用懒加载和错误处理

### 用户体验
- 加载状态提示
- 详细的错误信息反馈
- 响应式设计适配移动端

## 🐛 常见问题

### Q1: 图片上传失败
**A**: 检查以下项目：
- 存储桶 `banners` 是否已创建
- 文件格式是否支持
- 文件大小是否超过10MB
- Storage权限是否正确设置

### Q2: 轮播图不显示
**A**: 确认：
- `is_active` 字段是否为 `true`
- `display_order` 是否正确设置
- 图片URL是否有效

### Q3: 删除失败
**A**: 可能原因：
- 轮播图不存在
- 权限不足
- Storage文件删除失败（不影响数据库删除）

## 📞 技术支持

如遇问题，请提供：
1. 错误信息截图
2. 操作步骤详细描述
3. 浏览器控制台日志
4. Supabase配置信息

---

**文档版本**: v1.0  
**最后更新**: 2025-11-29  
**维护团队**: 河北师范大学软件学院