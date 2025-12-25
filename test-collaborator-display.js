// 测试成果库管理页面的协作者显示功能
const { testAchievementParents } = require('./src/test-achievements-parents');

async function testCollaboratorDisplay() {
  console.log('🧪 测试协作者信息显示功能');
  console.log('='.repeat(50));
  
  try {
    // 1. 测试 achievements_parents 表的协作者获取功能
    console.log('\n📋 1. 测试协作者数据获取...');
    const result = await testAchievementParents();
    
    if (result.success) {
      console.log('✅ 协作者数据获取成功');
      console.log(`📊 获取到 ${result.data.length} 个协作者记录`);
      
      // 2. 验证每个协作者记录是否包含 full_name
      console.log('\n📋 2. 验证协作者信息完整性...');
      let validRecords = 0;
      
      for (const record of result.data) {
        console.log(`\n📝 记录 ${record.id}:`);
        console.log(`   - 成果ID: ${record.achievement_id}`);
        console.log(`   - 协作者ID: ${record.parent_id}`);
        
        if (record.parent) {
          console.log(`   - 协作者用户名: ${record.parent.username || '未设置'}`);
          console.log(`   - 协作者全名: ${record.parent.full_name || '未设置'}`);
          console.log(`   - 协作者邮箱: ${record.parent.email || '未设置'}`);
          
          if (record.parent.full_name) {
            validRecords++;
            console.log(`   ✅ 包含 full_name 字段`);
          } else {
            console.log(`   ⚠️ 缺少 full_name 字段`);
          }
        } else {
          console.log(`   ❌ 协作者信息为空`);
        }
      }
      
      console.log(`\n📊 统计结果:`);
      console.log(`   - 总记录数: ${result.data.length}`);
      console.log(`   - 有效记录数: ${validRecords}`);
      console.log(`   - 有效率: ${((validRecords / result.data.length) * 100).toFixed(1)}%`);
      
    } else {
      console.log('❌ 协作者数据获取失败:', result.message);
    }
    
    console.log('\n🎯 协作者信息显示功能测试完成');
    console.log('\n💡 在成果库管理页面点击"查看"按钮，');
    console.log('   应该能在详情页面看到协作者的 full_name 信息。');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
testCollaboratorDisplay();