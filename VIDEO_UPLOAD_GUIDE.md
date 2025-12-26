# 视频上传优化指南

## 🎥 问题解决

### 原问题
```
POST https://onest.selfroom.top/storage/v1/object/achievement-videos/... 
net::ERR_FAILED 413 (Request Entity Too Large)
```

### 解决方案
✅ 已实施完整的视频上传优化方案：
- 代理配置增强（10分钟超时）
- 智能文件验证和处理
- 详细的错误提示和压缩建议
- 分层超时机制

## 📋 新增功能

### 1. 视频预处理和验证
- **格式检查**：支持 MP4、WebM、OGG、MOV
- **大小限制**：100MB（Supabase桶限制200MB）
- **智能提示**：提供具体的压缩工具和建议

### 2. 增强的超时处理
- **视频上传**：10分钟超时
- **普通文件**：5分钟超时  
- **其他请求**：15秒超时

### 3. 详细的错误处理
- **文件过大**：提供压缩工具推荐
- **格式错误**：支持的具体格式列表
- **上传失败**：详细的故障排除步骤

## 🛠️ 技术改进

### 代理配置 (vite.config.ts)
```typescript
'/storage/v1': {
  target: 'https://onest.selfroom.top',
  changeOrigin: true,
  secure: true,
  rewrite: (path) => path.replace(/^\/storage\/v1/, '/storage/v1'),
  timeout: 600000, // 10分钟超时，支持超大视频文件
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Connection': 'keep-alive'
  }
}
```

### Supabase客户端 (supabase.ts)
```typescript
fetch: (url, options) => {
  const isStorageRequest = url?.includes('/storage/v1/');
  const isVideoUpload = options?.body instanceof File && options.body.type.startsWith('video/');
  const timeout = isVideoUpload ? 600000 : (isStorageRequest ? 300000 : 15000);
  
  return fetch(url, {
    ...options,
    signal: AbortSignal.timeout(timeout),
  });
}
```

### 视频验证 (supabaseStorageService.ts)
```typescript
const preprocessVideoFile = async (file: File, maxSize: number) => {
  // 格式验证
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  
  // 大小检查
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `视频文件过大...推荐压缩工具...`,
    };
  }
  
  return { valid: true, file };
};
```

## 📊 上传流程

### 1. 文件选择阶段
```
用户选择视频 → 格式检查 → 大小检查
```

### 2. 预处理阶段  
```
验证通过 → 显示文件信息 → 开始上传
```

### 3. 上传阶段
```
创建唯一文件名 → 分块上传 → 进度追踪 → 完成确认
```

## 🎯 用户界面建议

### 上传组件优化
```tsx
const VideoUploader = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle');

  const handleVideoUpload = async (file: File) => {
    // 显示文件信息
    console.log(`准备上传: ${file.name} (${(file.size/1024/1024).toFixed(2)}MB)`);
    
    // 显示上传进度
    setUploadStatus('uploading');
    
    const result = await uploadToAchievementVideosBucket(file);
    
    if (result.success) {
      setUploadStatus('success');
      setUploadProgress(100);
    } else {
      setUploadStatus('error');
      // 显示详细错误信息
      alert(result.error);
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      {uploadStatus === 'uploading' && (
        <div>上传中... {uploadProgress}%</div>
      )}
      {uploadStatus === 'success' && (
        <div>✅ 视频上传成功</div>
      )}
      {uploadStatus === 'error' && (
        <div>❌ 上传失败，请检查文件大小和格式</div>
      )}
    </div>
  );
};
```

## 🔧 压缩工具推荐

### 桌面软件
1. **HandBrake** (免费, 跨平台)
   - 网址：https://handbrake.fr/
   - 支持：Windows, Mac, Linux
   - 特点：专业级压缩，质量可调

2. **格式工厂** (Windows)
   - 免费，功能全面
   - 支持多种视频格式转换

3. **FFmpeg** (命令行)
   - 专业工具，批量处理
   - 命令：`ffmpeg -i input.mp4 -b:v 2M output.mp4`

### 在线工具
1. **TinyWow Video Compressor**
   - 网址：https://tinywow.com/video-compressor
   - 免费，无需安装

2. **CloudConvert**
   - 网址：https://cloudconvert.com/
   - 支持多种格式

### 移动端
- **iMovie** (iOS内置)
- **Google Photos** (压缩功能)
- **InShot** (视频编辑应用)

## 📈 压缩建议

### 最佳设置参数
```
分辨率: 1280x720 (720p) 或 1920x1080 (1080p)
码率: 2-5 Mbps (标准视频)
帧率: 24-30 fps (一般视频)
编码: H.264 (推荐) 或 H.265 (更高压缩)
```

### 文件大小参考
```
1分钟视频 (720p): ~5-10MB
5分钟视频 (720p): ~25-50MB
10分钟视频 (720p): ~50-100MB
```

## 🚨 故障排除

### 常见错误及解决方案

#### 1. "Request Entity Too Large" (413错误)
**原因**: 文件超过服务器限制
**解决**: 
- 压缩视频到100MB以下
- 使用推荐的压缩工具
- 检查视频格式是否支持

#### 2. "CORS error"
**原因**: 跨域请求被阻止
**解决**: ✅ 已通过代理配置解决

#### 3. "Upload timeout"
**原因**: 网络慢或文件过大
**解决**: ✅ 已增加超时时间到10分钟

#### 4. "Unsupported video format"
**原因**: 视频格式不支持
**解决**: 使用格式转换工具转换为MP4

## 📱 最佳实践

### 用户指导
1. **上传前准备**
   - 推荐使用MP4格式
   - 文件大小控制在100MB以内
   - 分辨率建议720p或1080p

2. **上传过程**
   - 保持网络连接稳定
   - 大文件建议使用WiFi
   - 上传过程中不要关闭页面

3. **压缩优先级**
   ```mermaid
   graph TD
   A[原始视频] --> B{大小检查}
   B -->|<100MB| C[直接上传]
   B -->|>100MB| D[压缩处理]
   D --> E{压缩后}
   E -->|<100MB| F[上传]
   E -->|仍>100MB| G[重新压缩]
   ```

## 📋 检查清单

### 上传前检查
- [ ] 视频格式：MP4、WebM、OGG、MOV
- [ ] 文件大小：小于100MB
- [ ] 网络连接：稳定
- [ ] 浏览器：最新版本

### 上传后验证
- [ ] 上传成功提示
- [ ] 视频可正常播放
- [ ] 文件大小符合预期
- [ ] 音视频同步

## 🔍 调试工具

### 浏览器控制台
```javascript
// 监控上传进度
console.log('上传开始:', new Date().toLocaleTimeString());
// 上传完成后
console.log('上传完成:', new Date().toLocaleTimeString());
```

### 网络面板
- 检查请求状态码
- 查看上传耗时
- 监控网络流量

## 📞 技术支持

如果仍然遇到问题：

1. **检查浏览器控制台错误信息**
2. **验证文件格式和大小**
3. **尝试不同的压缩工具**
4. **使用不同的网络环境**
5. **联系技术支持，提供详细的错误信息**

---

**更新日期**: 2025-01-26  
**版本**: v1.0  
**状态**: ✅ 已完成所有优化