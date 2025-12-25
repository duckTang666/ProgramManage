// 测试协作者选择流程的脚本
// 在浏览器控制台中运行此脚本来测试新的选择流程

console.log('🧪 测试协作者选择流程...');

// 测试步骤说明
console.log('\n📋 新的选择流程:');
console.log('1. 点击学生协作者的搜索按钮');
console.log('2. 在弹出的模态框中勾选想要的学生');
console.log('3. 点击右边的加号按钮（确认添加）');
console.log('4. 模态框关闭，选中的协作者显示在界面上');
console.log('5. 提交成果后，根据协作者数量选择存储方式');

// 模拟测试数据
const testCollaborators = [
  { id: 'user-1', name: '张三', email: 'zhangsan@example.com' },
  { id: 'user-2', name: '李四', email: 'lisi@example.com' },
  { id: 'user-3', name: '王五', email: 'wangwu@example.com' }
];

console.log('\n👥 测试数据:', testCollaborators);

// 测试场景
console.log('\n🎯 测试场景:');
console.log('✅ 场景1: 选择1个协作者 → 点击加号 → 保存到achievements.parents_id');
console.log('✅ 场景2: 选择2+个协作者 → 点击加号 → 保存到achievements_parents表');
console.log('❌ 场景3: 选择协作者但点击取消 → 不保存任何选择');

// 预期的UI行为
console.log('\n🎨 预期的UI行为:');
console.log('• 勾选框只标记临时选择');
console.log('• 点击加号按钮才真正确认选择');
console.log('• 点击取消按钮放弃当前选择');
console.log('• 显示已选择人数的实时计数');

// 创建一个测试辅助函数
window.testCollaboratorSelection = function() {
  console.log('\n🔍 查找协作者选择按钮...');
  
  // 查找搜索按钮
  const searchButton = document.querySelector('button[title*="协作者"], button:has(.fa-search)');
  if (searchButton) {
    console.log('✅ 找到协作者搜索按钮:', searchButton);
    
    // 模拟点击
    searchButton.click();
    setTimeout(() => {
      console.log('🚀 已点击搜索按钮，等待模态框出现...');
      
      // 查找模态框
      setTimeout(() => {
        const modal = document.querySelector('.fixed.inset-0');
        if (modal) {
          console.log('✅ 找到模态框:', modal);
          console.log('💡 请手动测试选择协作者并点击加号按钮');
        } else {
          console.log('❌ 未找到模态框');
        }
      }, 500);
    }, 100);
  } else {
    console.log('❌ 未找到协作者搜索按钮');
  }
};

// 监听选择变化
let selectedCount = 0;
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      const countElement = document.querySelector('span:contains("位协作者")');
      if (countElement && countElement.textContent !== selectedCount) {
        selectedCount = countElement.textContent;
        console.log('📊 当前选择数量:', selectedCount);
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('\n🎮 测试辅助函数已加载');
console.log('💡 在控制台中运行: testCollaboratorSelection()');
console.log('🎯 或直接在页面上手动测试协作者选择功能');