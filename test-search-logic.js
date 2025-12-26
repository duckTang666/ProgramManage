// 测试协作者搜索逻辑
const mockStudents = [
    { id: '1', full_name: '张三', username: 'zhangsan', email: 'zhangsan@example.com' },
    { id: '2', full_name: '李四', username: 'lisi', email: 'lisi@example.com' },
    { id: '3', full_name: '王五', username: 'wangwu', email: 'wangwu@example.com' },
    { id: '4', full_name: '张小明', username: 'zhangxiaoming', email: 'zhangxiaoming@example.com' },
    { id: '5', full_name: '李华', username: 'lihua', email: 'lihua@example.com' }
];

// 模拟搜索逻辑
function filterUsers(users, searchQuery) {
    if (!searchQuery.trim()) return users;
    
    const searchLower = searchQuery.toLowerCase().trim();
    
    return users.filter(user => {
        const fullName = user.full_name || user.username || '';
        const fullNameLower = fullName.toLowerCase();
        
        return (
            fullName.includes(searchQuery) ||              // 精确匹配（支持中文字符）
            fullNameLower.includes(searchLower) ||         // 模糊匹配（转换为小写）
            (user.username && user.username.toLowerCase().includes(searchLower))
        );
    });
}

// 测试用例
const testCases = [
    { query: '张', expected: 2, description: '姓"张"的学生' },
    { query: '李', expected: 2, description: '姓"李"的学生' },
    { query: '王', expected: 1, description: '姓"王"的学生' },
    { query: '张三', expected: 1, description: '完整姓名"张三"' },
    { query: 'zhang', expected: 2, description: '用户名包含"zhang"' },
    { query: '', expected: 5, description: '空搜索条件' },
    { query: '不存在', expected: 0, description: '无匹配结果' }
];

console.log('🔍 开始测试协作者搜索功能...\n');

testCases.forEach((testCase, index) => {
    const result = filterUsers(mockStudents, testCase.query);
    const passed = result.length === testCase.expected;
    
    console.log(`${index + 1}. ${testCase.description}`);
    console.log(`   搜索词: "${testCase.query}"`);
    console.log(`   期望结果: ${testCase.expected} 个学生`);
    console.log(`   实际结果: ${result.length} 个学生`);
    console.log(`   结果: ${passed ? '✅ 通过' : '❌ 失败'}`);
    
    if (result.length > 0 && result.length <= 3) {
        console.log(`   匹配学生: ${result.map(u => u.full_name).join(', ')}`);
    }
    
    if (!passed) {
        console.log(`   详细结果: ${JSON.stringify(result, null, 2)}`);
    }
    
    console.log('');
});

console.log('🎉 搜索逻辑测试完成！');
console.log('\n📋 搜索功能特性:');
console.log('✅ 支持中文姓氏搜索（如"张"）');
console.log('✅ 支持完整姓名搜索（如"张三"）');
console.log('✅ 支持用户名搜索（如"zhang"）');
console.log('✅ 支持模糊匹配');
console.log('✅ 大小写不敏感');
console.log('✅ 空搜索返回全部结果');

// 测试特定场景
console.log('\n🔬 特定场景测试:');
console.log('\n场景1: 学生选择组件中搜索"张"');
const zhangResults = filterUsers(mockStudents, '张');
console.log(`找到 ${zhangResults.length} 个姓张的学生: ${zhangResults.map(u => u.full_name).join(', ')}`);

console.log('\n场景2: 学生选择组件中搜索"小明"');
const xiaomingResults = filterUsers(mockStudents, '小明');
console.log(`找到 ${xiaomingResults.length} 个包含"小明"的学生: ${xiaomingResults.map(u => u.full_name).join(', ')}`);

console.log('\n场景3: 学生选择组件中输入单个字符"l"');
const lResults = filterUsers(mockStudents, 'l');
console.log(`找到 ${lResults.length} 个匹配的学生: ${lResults.map(u => u.full_name).join(', ')}`);

console.log('\n✅ 所有测试场景完成！');