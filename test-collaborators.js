// 测试协作者保存功能的脚本
// 在浏览器控制台中运行此脚本来测试功能

async function testCollaboratorSaving() {
  console.log('🧪 开始测试协作者保存功能...');
  
  // 模拟单个协作者的情况
  console.log('\n📝 测试1: 单个协作者保存');
  const singleCollaboratorData = {
    title: '测试单个协作者',
    description: '这是一个测试单个协作者的成果',
    type_id: '3582cb28-b452-4495-bd5c-85ea0a2a575f',
    cover_url: 'https://example.com/cover.jpg',
    video_url: '',
    publisher_id: 'test-user-id',
    instructor_id: 'test-instructor-id',
    parents_ids: ['single-collaborator-id'] // 单个协作者
  };
  
  console.log('📤 发送单个协作者数据:', singleCollaboratorData);
  
  // 模拟多个协作者的情况
  console.log('\n📝 测试2: 多个协作者保存');
  const multipleCollaboratorsData = {
    title: '测试多个协作者',
    description: '这是一个测试多个协作者的成果',
    type_id: '3582cb28-b452-4495-bd5c-85ea0a2a575f',
    cover_url: 'https://example.com/cover.jpg',
    video_url: '',
    publisher_id: 'test-user-id',
    instructor_id: 'test-instructor-id',
    parents_ids: ['collaborator-1-id', 'collaborator-2-id'] // 多个协作者
  };
  
  console.log('📤 发送多个协作者数据:', multipleCollaboratorsData);
  
  console.log('\n🎯 预期结果:');
  console.log('1. 单个协作者应该保存在 achievements.parents_id 字段中');
  console.log('2. 多个协作者应该保存在 achievements_parents 表中，每个协作者一行');
  console.log('3. 成果ID相同，但协作者ID不同');
  
  return {
    singleTest: '单个协作者测试准备完成',
    multipleTest: '多个协作者测试准备完成'
  };
}

// 导出测试函数
window.testCollaboratorSaving = testCollaboratorSaving;

console.log('✅ 测试脚本已加载');
console.log('💡 在浏览器控制台中运行: testCollaboratorSaving()');