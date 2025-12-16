// 诊断脚本：测试用户登录和数据库连接
import { supabase } from './src/lib/supabase.js';

console.log('=== Supabase 诊断测试 ===');
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

async function testConnection() {
  try {
    console.log('\n1. 测试基本连接...');
    
    // 测试查询用户表
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      console.error('❌ 查询用户表失败:', usersError);
    } else {
      console.log('✅ 用户表连接正常，用户数量:', users[0]?.count || 0);
    }

    // 测试具体用户登录（使用刚导入的学生账号）
    const testEmail = '2023015559@hbsd.com'; // 替换为实际导入的学生邮箱
    const testPassword = '123456';
    
    console.log(`\n2. 测试学生登录: ${testEmail}`);
    
    const { data: userData, error: loginError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();
    
    if (loginError) {
      console.error('❌ 查询用户失败:', loginError);
      if (loginError.code === 'PGRST116') {
        console.log('🔍 用户不存在，可能需要先导入学生');
      }
    } else {
      console.log('✅ 找到用户:', {
        id: userData.id,
        username: userData.username,
        student_id: userData.student_id,
        email: userData.email,
        role: userData.role
      });
      
      if (userData.password_hash === testPassword) {
        console.log('✅ 密码验证通过');
      } else {
        console.log('❌ 密码不匹配');
        console.log('存储的密码哈希:', userData.password_hash);
        console.log('输入的密码:', testPassword);
      }
    }

    // 测试网络请求头
    console.log('\n3. 测试网络请求...');
    const response = await fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/users?select=count', {
      method: 'GET',
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('HTTP状态码:', response.status);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 直接HTTP请求成功:', data);
    } else {
      console.log('❌ 直接HTTP请求失败:', response.statusText);
      console.log('响应文本:', await response.text());
    }

  } catch (error) {
    console.error('❌ 诊断过程中发生错误:', error);
  }
}

testConnection();