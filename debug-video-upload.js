// 视频上传调试脚本
// 用于诊断视频上传失败的具体原因

import { supabase } from '../src/lib/supabase.js';

async function debugVideoUpload() {
  console.log('🔍 开始视频上传调试...');
  
  try {
    // 1. 检查Supabase连接
    console.log('📡 检查Supabase连接...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ 获取存储桶列表失败:', listError);
      return;
    }
    
    console.log('✅ Supabase连接正常');
    console.log('📦 当前存储桶:', buckets.map(b => ({ name: b.name, id: b.id })));
    
    // 2. 检查achievement-videos存储桶
    const videoBucket = buckets.find(b => b.name === 'achievement-videos');
    console.log('🎬 achievement-videos存储桶:', videoBucket ? '✅ 存在' : '❌ 不存在');
    
    if (!videoBucket) {
      console.error('❌ achievement-videos存储桶不存在！');
      console.log(`
🔧 解决方案：
1. 登录 https://supabase.com/dashboard/project/vntvrdkjtfdcnvwgrubo/storage
2. 点击 "New bucket"
3. 输入桶名: achievement-videos
4. 设置 Public bucket: ✅
5. File size limit: 209715200 (200MB)
6. Allowed MIME types: video/mp4,video/webm,video/ogg,video/quicktime
7. 点击 "Save"
      `);
      return;
    }
    
    // 3. 测试权限 - 尝试列出文件
    console.log('🔐 测试存储桶权限...');
    const { data: files, error: listFilesError } = await supabase.storage
      .from('achievement-videos')
      .list();
    
    if (listFilesError) {
      console.error('❌ 列出文件失败 (权限问题):', listFilesError);
      
      if (listFilesError.message.includes('row-level security policy')) {
        console.log(`
🚨 RLS策略问题！需要配置访问权限：

在Supabase SQL Editor中执行：
-- 允许公开访问
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'achievement-videos');

CREATE POLICY "Allow public reads" ON storage.objects  
FOR SELECT USING (bucket_id = 'achievement-videos');

CREATE POLICY "Allow public updates" ON storage.objects
FOR UPDATE WITH CHECK (bucket_id = 'achievement-videos');
        `);
      }
    } else {
      console.log('✅ 存储桶权限正常');
      console.log(`📁 当前文件数量: ${files?.length || 0}`);
    }
    
    // 4. 测试小文件上传
    console.log('📤 测试小文件上传...');
    const testContent = 'test video content';
    const testBlob = new Blob([testContent], { type: 'video/mp4' });
    const testFile = new File([testBlob], 'test-upload.mp4', { type: 'video/mp4' });
    
    const testFileName = `debug-test-${Date.now()}.mp4`;
    const { error: uploadError } = await supabase.storage
      .from('achievement-videos')
      .upload(testFileName, testFile, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error('❌ 测试上传失败:', uploadError);
      
      if (uploadError.message.includes('Failed to fetch')) {
        console.log(`
🌐 网络问题诊断：
1. 检查网络连接是否稳定
2. 尝试使用其他网络或VPN
3. 检查防火墙/代理设置
4. 尝试在浏览器开发者工具中查看网络请求
5. 检查CORS设置是否正确
        `);
      }
    } else {
      console.log('✅ 测试上传成功');
      
      // 清理测试文件
      await supabase.storage
        .from('achievement-videos')
        .remove([testFileName]);
      console.log('🧹 已清理测试文件');
    }
    
    // 5. 检查网络状况
    console.log('🌐 检查网络状况...');
    const startTime = Date.now();
    try {
      const response = await fetch('https://api.supabase.io/health');
      const endTime = Date.now();
      console.log(`✅ Supabase API响应时间: ${endTime - startTime}ms`);
    } catch (networkError) {
      console.error('❌ 网络连接测试失败:', networkError);
    }
    
    console.log('🎯 调试完成！');
    
  } catch (error) {
    console.error('💥 调试过程中发生错误:', error);
  }
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
  module.exports = debugVideoUpload;
}

// 如果在浏览器控制台中运行
if (typeof window !== 'undefined') {
  window.debugVideoUpload = debugVideoUpload;
  console.log('🔧 调试函数已加载，在控制台中运行: debugVideoUpload()');
}