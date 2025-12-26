// 测试代理配置是否正确工作
async function testProxy() {
  console.log('🧪 测试代理配置...');
  
  // 测试存储API代理
  try {
    const storageResponse = await fetch('/storage/v1/object', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: true })
    });
    console.log('📦 存储代理测试:', storageResponse.status);
  } catch (error) {
    console.error('❌ 存储代理失败:', error.message);
  }
  
  // 测试API代理
  try {
    const apiResponse = await fetch('/api/test');
    console.log('🔌 API代理测试:', apiResponse.status);
  } catch (error) {
    console.error('❌ API代理失败:', error.message);
  }
  
  // 测试直接访问Supabase（应该失败，显示需要代理）
  try {
    const directResponse = await fetch('https://onest.selfroom.top/storage/v1/object', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: true })
    });
    console.log('🌐 直接访问测试:', directResponse.status);
  } catch (error) {
    console.log('✅ 直接访问被阻止（预期行为）:', error.message);
  }
}

// 在浏览器控制台中运行此函数
window.testProxy = testProxy;
console.log('🚀 测试函数已加载，在控制台中运行 testProxy() 来测试代理配置');