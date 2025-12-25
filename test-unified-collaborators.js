// 测试统一协作者存储功能的脚本
// 所有协作者（不管单个还是多个）都保存在achievements_parents表中

console.log('🧪 测试统一协作者存储功能...');

// 测试场景说明
console.log('\n📋 统一存储策略:');
console.log('✅ 1个协作者 → 保存到achievements_parents表（1行记录）');
console.log('✅ 2+个协作者 → 保存到achievements_parents表（N行记录）');
console.log('❌ achievements表的parents_id字段不再使用');

// 模拟测试数据
const testCases = [
  {
    name: '单个协作者测试',
    parents_ids: ['user-single-id'],
    expectedRecords: 1,
    storageTable: 'achievements_parents'
  },
  {
    name: '多个协作者测试', 
    parents_ids: ['user-multi-1-id', 'user-multi-2-id', 'user-multi-3-id'],
    expectedRecords: 3,
    storageTable: 'achievements_parents'
  }
];

console.log('\n📊 测试用例:');
testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.name}`);
  console.log(`   协作者ID: ${testCase.parents_ids.join(', ')}`);
  console.log(`   预期记录数: ${testCase.expectedRecords}`);
  console.log(`   存储表: ${testCase.storageTable}`);
});

// 数据库结构说明
console.log('\n🏗️ 数据库存储结构:');
console.log('achievements 表:');
console.log('├── id (UUID PK)');
console.log('├── title (TEXT)');
console.log('├── ...其他字段...');
console.log('└── ❌ 不再使用parents_id字段');

console.log('\nachievements_parents 表 (关联表):');
console.log('├── id (UUID PK)');
console.log('├── achievement_id (UUID → achievements.id)');
console.log('├── parent_id (UUID → users.id)');
console.log('└── created_at (TIMESTAMPTZ)');

// 测试辅助函数
window.testUnifiedCollaborators = function() {
  console.log('\n🎮 开始测试统一协作者存储...');
  
  // 查找成果发布页面的元素
  const searchButton = document.querySelector('button[title*="协作者"], button:has(.fa-search)');
  
  if (searchButton) {
    console.log('✅ 找到协作者搜索按钮');
    
    // 模拟点击打开模态框
    searchButton.click();
    
    setTimeout(() => {
      const modal = document.querySelector('.fixed.inset-0');
      if (modal) {
        console.log('✅ 协作者选择模态框已打开');
        console.log('💡 请进行以下测试:');
        console.log('   1. 选择1个协作者，点击加号确认');
        console.log('   2. 重新打开，选择2+个协作者，点击加号确认');
        console.log('   3. 提交成果并检查数据库achievements_parents表');
        console.log('\n🎯 预期结果: 所有协作者都应该保存在achievements_parents表中');
      } else {
        console.log('❌ 未找到协作者选择模态框');
      }
    }, 500);
  } else {
    console.log('❌ 未找到协作者搜索按钮');
  }
};

// 数据验证辅助函数
window.validateCollaboratorStorage = async function(achievementId) {
  console.log('\n🔍 验证协作者存储...');
  
  try {
    // 检查achievements_parents表中的记录
    const { data: parentRecords, error: parentError } = await supabase
      .from('achievements_parents')
      .select('*')
      .eq('achievement_id', achievementId);
    
    if (parentError) {
      console.error('❌ 查询achievements_parents失败:', parentError);
      return false;
    }
    
    console.log(`✅ achievements_parents表中有 ${parentRecords.length} 条记录`);
    parentRecords.forEach((record, index) => {
      console.log(`   ${index + 1}. parent_id: ${record.parent_id}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ 验证过程中出错:', error);
    return false;
  }
};

console.log('\n🎮 测试函数已加载:');
console.log('• testUnifiedCollaborators() - 测试协作者选择流程');
console.log('• validateCollaboratorStorage(achievementId) - 验证数据库存储');
console.log('\n💡 访问 http://localhost:5173/#/achievement-publish 进行测试');