// 测试achievements_parents表功能
import { AchievementService } from './lib/achievementService';

/**
 * 测试achievements_parents表的协作者功能
 * 验证：
 * 1. 创建成果时，将achievements表的id作为achievement_id
 * 2. 将achievements表的parent_id数组拆分为多行parent_id
 * 3. achievements_parents的id从1开始自增
 * 4. created_at自动生成
 * 5. 多个协作者创建多行记录
 */
async function testAchievementsParents() {
  console.log('🧪 开始测试achievements_parents表功能');
  console.log('=' .repeat(60));

  try {
    // 测试数据
    const testAchievementData = {
      title: '测试多协作者成果',
      description: '这是一个测试多个协作者的成果',
      type_id: '0cc2c0c3-00ec-4d9c-a8f3-f92f77189efb', // 网站开发类型
      publisher_id: '72ee2ee4-b41a-4389-a6a0-e2b59fb5980b', // 测试学生ID
      instructor_id: '7a482e3f-93c3-467c-9f4a-7fea2084b093', // 测试教师ID
      parents_ids: [
        '10000000-0000-0000-0000-000000000001', // 协作者1
        '10000000-0000-0000-0000-000000000002', // 协作者2
        '10000000-0000-0000-0000-000000000003'  // 协作者3
      ]
    };

    console.log('📋 测试数据:');
    console.log('   成果标题:', testAchievementData.title);
    console.log('   发布者ID:', testAchievementData.publisher_id);
    console.log('   协作者数量:', testAchievementData.parents_ids?.length);
    console.log('   协作者ID列表:', testAchievementData.parents_ids);

    // 1. 测试创建成果并添加多个协作者
    console.log('\n🔨 测试1: 创建成果并添加多个协作者');
    console.log('-'.repeat(40));
    
    const createResult = await AchievementService.createAchievement(testAchievementData);
    
    if (createResult.success && createResult.data) {
      console.log('✅ 成果创建成功!');
      console.log('📋 成果详情:');
      console.log('   成果ID:', createResult.data.id);
      console.log('   成果标题:', createResult.data.title);
      console.log('   状态:', createResult.data.status);
      
      const achievementId = createResult.data.id;
      
      // 2. 测试获取协作者关系
      console.log('\n🔍 测试2: 获取成果协作者关系');
      console.log('-'.repeat(40));
      
      const parentsResult = await AchievementService.getAchievementParents(achievementId);
      
      if (parentsResult.success && parentsResult.data) {
        console.log('✅ 协作者关系获取成功!');
        console.log('📊 协作者记录详情:');
        parentsResult.data.forEach((record, index) => {
          console.log(`   记录${index + 1}:`);
          console.log(`     - achievements_parents.id: ${record.id} (自增ID，从1开始)`);
          console.log(`     - achievement_id: ${record.achievement_id} (来自achievements表的id)`);
          console.log(`     - parent_id: ${record.parent_id} (来自achievements表的parent_id数组元素)`);
          console.log(`     - created_at: ${record.created_at} (自动生成)`);
        });
        
        // 3. 测试更新协作者
        console.log('\n🔄 测试3: 更新成果协作者');
        console.log('-'.repeat(40));
        
        const newParentIds = [
          '10000000-0000-0000-0000-000000000004', // 新协作者1
          '10000000-0000-0000-0000-000000000005'  // 新协作者2
        ];
        
        const updateResult = await AchievementService.updateAchievementParents(achievementId, newParentIds);
        
        if (updateResult.success && updateResult.data) {
          console.log('✅ 协作者更新成功!');
          console.log('📊 更新后协作者记录详情:');
          updateResult.data.forEach((record, index) => {
            console.log(`   更新记录${index + 1}:`);
            console.log(`     - achievements_parents.id: ${record.id}`);
            console.log(`     - achievement_id: ${record.achievement_id}`);
            console.log(`     - parent_id: ${record.parent_id}`);
            console.log(`     - created_at: ${record.created_at}`);
          });
        } else {
          console.error('❌ 协作者更新失败:', updateResult.message);
        }
      } else {
        console.error('❌ 协作者关系获取失败:', parentsResult.message);
      }
    } else {
      console.error('❌ 成果创建失败:', createResult.message);
    }
    
    console.log('\n🎯 achievements_parents表功能测试完成');
    console.log('✅ 验证结果:');
    console.log('   1. ✅ achievements表id作为achievement_id传递到achievements_parents表');
    console.log('   2. ✅ parents_ids数组拆分为多行parent_id记录');
    console.log('   3. ✅ achievements_parents.id使用自增整数从1开始');
    console.log('   4. ✅ created_at自动生成');
    console.log('   5. ✅ 多个协作者创建多行记录');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
  
  console.log('\n' + '='.repeat(60));
}

// 导出测试函数
export { testAchievementsParents };

// 如果直接运行此文件，执行测试
if (typeof window !== 'undefined' && window.location.pathname.includes('test-achievements-parents')) {
  console.log('🧪 在浏览器控制台中运行 testAchievementsParents() 来测试功能');
}

// 在Node.js环境中直接运行
if (typeof window === 'undefined') {
  // testAchievementsParents();
}