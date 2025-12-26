# achievement-videos 存储桶权限修复指南

## 🚨 问题确认
- ✅ achievement-videos 存储桶已存在
- ❌ 存储桶权限不足，导致视频上传失败

## 🔧 解决方案

### 方案1: 快速 SQL 修复（推荐）

#### 步骤 1: 打开 SQL 编辑器
1. 访问 [Supabase 控制台](https://supabase.com/dashboard/project/vntvrdkjtfdcnvwgrubo/sql)
2. 进入 SQL Editor 页面

#### 步骤 2: 执行修复 SQL
复制以下 SQL 代码并执行：

```sql
-- 删除可能冲突的旧策略
DROP POLICY IF EXISTS "Allow video uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow video reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow video updates" ON storage.objects;

-- 创建 achievement-videos 存储桶的访问策略
CREATE POLICY "Allow video uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'achievement-videos' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow video reads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'achievement-videos' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

CREATE POLICY "Allow video updates" ON storage.objects
FOR UPDATE WITH CHECK (
  bucket_id = 'achievement-videos' AND
  (auth.role() = 'anon' OR auth.role() = 'authenticated')
);

-- 确保存储桶为公开访问并设置正确的大小限制
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 52428800, -- 50MB in bytes
  allowed_mime_types = '{video/mp4,video/webm,video/ogg,video/quicktime}'
WHERE name = 'achievement-videos';
```

#### 步骤 3: 验证修复结果
执行以下查询验证：

```sql
-- 查看存储桶状态
SELECT * FROM storage.buckets WHERE name = 'achievement-videos';

-- 查看相关策略
SELECT policyname, roles, cmd FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%video%';
```

### 方案2: 控制台界面修复

#### 步骤 1: 检查存储桶设置
1. 访问 [Supabase 存储控制台](https://supabase.com/dashboard/project/vntvrdkjtfdcnvwgrubo/storage)
2. 找到 `achievement-videos` 存储桶
3. 确认设置为 **Public** (公开访问)

#### 步骤 2: 检查存储桶配置
- **Bucket name**: `achievement-videos`
- **Public bucket**: ✅ 勾选
- **File size limit**: 52428800 (50MB)
- **Allowed MIME types**: `video/mp4,video/webm,video/ogg,video/quicktime`

### 方案3: 使用自动化修复脚本

#### 浏览器控制台修复
1. 在项目中打开浏览器开发者工具 (F12)
2. 在控制台中粘贴并运行以下代码：

```javascript
// 加载修复脚本
import('./quick-fix-video-permissions.js').then(() => {
  // 执行修复
  window.fixVideoStoragePermissions();
});
```

## 🧪 验证修复

### 方法1: 使用调试页面
1. 打开 `test-video-upload-debug.html`
2. 点击 "📦 检查存储桶"
3. 选择小视频文件测试上传
4. 确认上传成功

### 方法2: 手动测试
```javascript
// 在浏览器控制台运行 - 注意文件大小限制50MB
const testFile = new Blob(['test video content'], { type: 'video/mp4' });
const { data, error } = await supabase.storage
  .from('achievement-videos')
  .upload(`test-${Date.now()}.mp4`, testFile);

console.log('测试结果:', { data, error });
```

## 🔍 故障排除

### 如果仍然失败，检查以下项目：

#### 1. RLS 策略状态
```sql
-- 确认 RLS 已启用
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' AND tablename = 'objects';
```

#### 2. 存储桶权限
```sql
-- 确认存储桶为公开
SELECT name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE name = 'achievement-videos';
```

#### 3. 用户角色
```sql
-- 确认匿名用户有权限
SELECT rolname FROM pg_roles WHERE rolname = 'anon';
```

## 📞 如果问题持续

1. **收集错误信息**：
   - 浏览器控制台的完整错误日志
   - 网络请求的响应状态
   - Supabase SQL 执行结果

2. **检查网络配置**：
   - CORS 设置是否正确
   - 防火墙是否阻止请求
   - API 密钥是否有效

3. **联系支持**：
   - 提供 Supabase 项目 ID
   - 提供错误截图
   - 提供执行的 SQL 语句

## ✅ 修复确认

修复成功后，你应该能够：
- ✅ 上传视频文件到 achievement-videos 存储桶
- ✅ 通过公共 URL 访问上传的视频
- ✅ 在成果发布页面成功上传演示视频

## 📋 常见错误信息

| 错误信息 | 原因 | 解决方案 |
|---------|------|----------|
| `Bucket not found` | 存储桶不存在 | 创建存储桶 |
| `permission denied` | RLS 策略阻止 | 执行 SQL 修复 |
| `Failed to fetch` | 网络或权限问题 | 检查 CORS 和权限 |
| `413 Payload Too Large` | 文件过大（>50MB） | 压缩视频文件到50MB以内 |
| `file too large` | 文件超过50MB限制 | 压缩或分割视频 |

---

**⚡ 快速修复提示**: 执行 SQL 方案1 通常能在 2-3 分钟内解决权限问题！