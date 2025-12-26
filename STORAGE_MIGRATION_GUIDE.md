# 新 Supabase 存储桶迁移指南

## 🎯 迁移目标
将所有文件（视频、封面图、附件）迁移到新的 Supabase 数据库存储桶。

## 📍 新存储信息
- **数据库URL**: `https://onest.selfroom.top/`
- **存储桶URL**: `https://onest.selfroom.top/project/default/storage/files`
- **公共访问URL**: `https://onest.selfroom.top/project/default/storage/files/public`

## 📋 存储桶配置

| 存储桶 | 用途 | 大小限制 | 支持格式 |
|---------|------|----------|----------|
| `new-images` | 新闻图片 | 5MB | JPG, PNG, GIF, WebP |
| `news-images` | 新闻管理图片 | 5MB | JPG, PNG, GIF, WebP |
| `achievement-images` | 成果封面图片 | 10MB | JPG, PNG, GIF, WebP |
| `achievement-videos` | 成果演示视频 | 50MB | MP4, WebM, OGG, QuickTime |
| `achievement_attachments` | 成果附件 | 50MB | PDF, DOC, DOCX |
| `banners` | 轮播图 | 5MB | JPG, PNG, GIF, WebP |

## 🚀 迁移步骤

### 步骤1: 设置新的存储桶

#### 方法A: 执行SQL脚本（推荐）
1. 打开 [Supabase SQL Editor](https://supabase.com/dashboard/project/vntvrdkjtfdcnvwgrubo/sql)
2. 复制并执行 `setup-new-storage-buckets.sql` 中的所有SQL代码
3. 等待执行完成（约1-2分钟）

#### 方法B: 手动创建
1. 访问 [Supabase 存储控制台](https://supabase.com/dashboard/project/vntvrdkjtfdcnvwgrubo/storage)
2. 逐个创建上述6个存储桶
3. 设置每个存储桶为公开访问
4. 配置正确的大小限制和MIME类型

### 步骤2: 验证配置
1. 打开 `test-new-storage-configuration.html`
2. 点击 "🔍 测试存储桶配置"
3. 确认所有存储桶都显示 "✅ 存在" 和 "✅ 公开"
4. 点击 "🎯 测试所有存储桶" 进行上传测试

### 步骤3: 更新代码配置
代码已更新为使用新的存储桶URL：

#### 主要更新:
- **Supabase客户端配置**: 添加自定义存储桶URL
- **上传逻辑**: 使用新的存储桶URL格式
- **公共URL生成**: 统一使用新的公共URL格式
- **文件验证**: 集中化存储桶配置管理

#### 新增配置文件:
- `src/config/storage.ts`: 统一管理所有存储配置
- 所有上传服务都引用此配置

## 🔧 配置文件说明

### 环境变量 (.env)
```
VITE_SUPABASE_URL=https://onest.selfroom.top/
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 存储配置 (src/config/storage.ts)
```typescript
export const STORAGE_BASE_URL = 'https://onest.selfroom.top/project/default/storage/files';
export const STORAGE_PUBLIC_URL = 'https://onest.selfroom.top/project/default/storage/files/public';

export const BUCKET_CONFIGS = {
  'achievement-videos': {
    name: 'achievement-videos',
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  },
  // ... 其他存储桶配置
};
```

## 📱 上传功能更新

### 成果发布页面 (p-achievement_publish)
- ✅ 封面图上传到 `achievement-images` 桶
- ✅ 视频上传到 `achievement-videos` 桶 (50MB限制)
- ✅ 附件上传到 `achievement_attachments` 桶 (50MB限制)

### 成果管理页面 (p-business_process)
- ✅ 显示所有类型文件的预览
- ✅ 支持新的URL格式访问

### 项目介绍页面 (p-project_intro)
- ✅ 使用新的存储桶配置
- ✅ 改进的视频上传错误处理

## 🧪 测试验证

### 功能测试清单
- [ ] 封面图片上传 (≤10MB)
- [ ] 视频上传 (≤50MB)
- [ ] 附件上传 (≤50MB)
- [ ] 轮播图上传 (≤5MB)
- [ ] 新闻图片上传 (≤5MB)

### URL访问测试
所有上传的文件应该能够通过以下格式访问：
```
https://onest.selfroom.top/project/default/storage/files/public/{bucket_name}/{file_path}
```

### 示例URL
- 封面图: `https://onest.selfroom.top/project/default/storage/files/public/achievement-images/user123/cover_123456.jpg`
- 视频: `https://onest.selfroom.top/project/default/storage/files/public/achievement-videos/user123/video_123456.mp4`
- 附件: `https://onest.selfroom.top/project/default/storage/files/public/achievement_attachments/user123/doc_123456.pdf`

## ⚠️ 注意事项

### 1. 文件大小限制
- 视频: 50MB (不是之前的200MB)
- 封面图: 10MB
- 附件: 50MB
- 其他图片: 5MB

### 2. URL格式变化
旧的URL格式:
```
https://onest.selfroom.top/storage/v1/object/public/bucket_name/file_path
```

新的URL格式:
```
https://onest.selfroom.top/project/default/storage/files/public/bucket_name/file_path
```

### 3. 兼容性考虑
- 新配置与现有代码完全兼容
- 旧的存储桶可以继续使用（如果需要）
- 建议统一迁移到新的存储桶

## 🆘 故障排除

### 常见问题

#### 问题1: 存储桶不存在
**症状**: 上传时出现 "Bucket not found" 错误
**解决**: 执行 `setup-new-storage-buckets.sql` 或手动创建存储桶

#### 问题2: 权限不足
**症状**: 上传时出现 "permission denied" 错误
**解决**: 检查存储桶是否设置为公开访问，确认RLS策略正确

#### 问题3: URL访问404
**症状**: 上传成功但无法访问文件
**解决**: 确认存储桶为公开访问，检查URL格式是否正确

#### 问题4: 文件过大
**症状**: 上传时出现 "file too large" 错误
**解决**: 压缩文件到存储桶大小限制以内

### 调试工具
1. **存储桶配置测试**: 打开 `test-new-storage-configuration.html`
2. **上传诊断**: 打开 `test-video-upload-debug.html`
3. **浏览器控制台**: 查看详细错误信息

## ✅ 迁移完成验证

迁移成功后，你应该能够：
- ✅ 在成果发布页面成功上传封面图、视频和附件
- ✅ 在成果管理页面查看所有上传的文件
- ✅ 通过新的URL格式访问所有文件
- ✅ 文件大小限制正确生效
- ✅ 所有文件类型验证正常工作

## 📞 技术支持

如果迁移过程中遇到问题：
1. 检查浏览器控制台错误信息
2. 使用测试工具验证配置
3. 确认SQL脚本执行成功
4. 验证存储桶权限设置

---

**🎉 迁移完成后，所有文件将存储在新的高性能存储桶中，提供更好的性能和可靠性！**