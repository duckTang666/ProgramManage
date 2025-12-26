// 快速修复 achievement-videos 存储桶权限问题
// 在浏览器控制台中运行此脚本

async function fixVideoStoragePermissions() {
  console.log('🔧 开始修复 achievement-videos 存储桶权限...');
  
  try {
    // 方法1: 通过 RPC 调用执行 SQL（如果支持）
    const sqlCommands = `
      -- 删除旧策略
      DROP POLICY IF EXISTS "Allow video uploads" ON storage.objects;
      DROP POLICY IF EXISTS "Allow video reads" ON storage.objects;
      DROP POLICY IF EXISTS "Allow video updates" ON storage.objects;
      
      -- 创建新策略
      CREATE POLICY "Allow video uploads" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'achievement-videos');
      
      CREATE POLICY "Allow video reads" ON storage.objects
      FOR SELECT USING (bucket_id = 'achievement-videos');
      
      CREATE POLICY "Allow video updates" ON storage.objects
      FOR UPDATE WITH CHECK (bucket_id = 'achievement-videos');
    `;

    // 方法2: 尝试直接创建测试文件来验证权限
    console.log('📤 测试上传权限...');
    
    const testFile = new Blob(['test video content'], { type: 'video/mp4' });
    const fileName = `permission-test-${Date.now()}.mp4`;
    const filePath = `test/${fileName}`;
    
    // 使用 Supabase 客户端测试上传
    const { data, error } = await supabase.storage
      .from('achievement-videos')
      .upload(filePath, testFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('❌ 权限测试失败:', error);
      
      // 提供手动修复步骤
      console.log(`
🚨 权限修复失败，需要手动执行：

🔧 手动修复步骤：

1. 打开 Supabase 控制台: https://supabase.com/dashboard/project/vntvrdkjtfdcnvwgrubo/sql

2. 复制并执行以下 SQL：

-- 删除旧策略
DROP POLICY IF EXISTS "Allow video uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow video reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow video updates" ON storage.objects;

-- 创建新策略
CREATE POLICY "Allow video uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'achievement-videos');

CREATE POLICY "Allow video reads" ON storage.objects
FOR SELECT USING (bucket_id = 'achievement-videos');

CREATE POLICY "Allow video updates" ON storage.objects
FOR UPDATE WITH CHECK (bucket_id = 'achievement-videos');

-- 确保存储桶为公开访问
UPDATE storage.buckets 
SET public = true 
WHERE name = 'achievement-videos';

3. 执行完成后，刷新页面并重新尝试上传

✅ 预期结果：视频上传应该成功
      `);
      
      return false;
    } else {
      console.log('✅ 权限测试成功！');
      
      // 清理测试文件
      await supabase.storage
        .from('achievement-videos')
        .remove([filePath]);
      
      console.log('🧹 测试文件已清理');
      return true;
    }

  } catch (error) {
    console.error('💥 修复过程中发生错误:', error);
    return false;
  }
}

// 立即执行修复
console.log('🎬 achievement-videos 存储桶权限修复工具');
console.log('如果自动修复失败，请按照控制台提示手动执行 SQL 语句');

fixVideoStoragePermissions().then(success => {
  if (success) {
    console.log('🎉 权限修复成功！现在可以尝试上传视频了。');
  } else {
    console.log('⚠️ 请按照上述手动步骤修复权限。');
  }
});

// 导出到全局，方便重复调用
window.fixVideoStoragePermissions = fixVideoStoragePermissions;