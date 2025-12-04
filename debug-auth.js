// 调试 AuthContext 和用户数据
// 这个脚本用于检查用户登录状态和 localStorage 数据

console.log('🔍 调试用户认证状态...\n');

// 检查 localStorage 中的用户数据
const storedUser = localStorage.getItem('currentUser');
console.log('localStorage 中的用户数据:', storedUser);

if (storedUser) {
  try {
    const parsedUser = JSON.parse(storedUser);
    console.log('解析后的用户数据:', parsedUser);
    console.log('用户姓名:', parsedUser.full_name);
    console.log('用户角色:', parsedUser.role);
    console.log('用户邮箱:', parsedUser.email);
  } catch (error) {
    console.error('解析用户数据失败:', error);
  }
} else {
  console.log('⚠️ 没有找到用户登录信息');
}

// 检查是否有其他相关的存储
console.log('\n📦 所有 localStorage 项目:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`${key}:`, value);
}

// 提供测试函数
const testAuthContext = () => {
  console.log('\n🧪 测试 AuthContext 连接...');
  // 这个函数需要在浏览器控制台中运行
  if (typeof window !== 'undefined' && window.React) {
    console.log('React 已加载');
    // 检查是否可以访问 AuthContext
  } else {
    console.log('需要在浏览器环境中运行');
  }
};

// 导出测试函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testAuthContext };
}