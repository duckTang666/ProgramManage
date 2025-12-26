const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('缺少 Supabase 配置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStudentNames() {
  try {
    console.log('🔍 测试学生姓名显示...\n');
    
    // 1. 获取所有学生用户
    console.log('📋 获取学生用户信息:');
    const { data: students, error: studentsError } = await supabase
      .from('users')
      .select('id, username, email, full_name, role')
      .eq('role', 1);
    
    if (studentsError) {
      console.error('❌ 获取学生用户失败:', studentsError);
      return;
    }
    
    console.log(`✅ 找到 ${students?.length} 个学生:`);
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.full_name || student.username} (${student.email})`);
    });
    
    // 2. 获取学生成果数据
    console.log('\n📊 获取学生成果数据:');
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select(`
        id,
        title,
        publisher_id,
        publisher:users!publisher_id (username, email, full_name)
      `)
      .in('publisher_id', students?.map(s => s.id) || [])
      .limit(5);
    
    if (achievementsError) {
      console.error('❌ 获取成果数据失败:', achievementsError);
      return;
    }
    
    console.log(`✅ 找到 ${achievements?.length} 个学生成果:`);
    achievements.forEach((achievement, index) => {
      const publisher = achievement.publisher;
      const displayName = publisher?.full_name || publisher?.username || '未知学生';
      console.log(`${index + 1}. "${achievement.title}" - 发布者: ${displayName} (${publisher?.email})`);
    });
    
    // 3. 测试搜索功能
    console.log('\n🔍 测试学生姓名搜索功能:');
    if (students && students.length > 0) {
      const testStudent = students[0];
      const searchName = testStudent.full_name || testStudent.username;
      
      console.log(`搜索学生: "${searchName}"`);
      
      const { data: searchResults, error: searchError } = await supabase
        .from('achievements')
        .select(`
          id,
          title,
          publisher:users!publisher_id (username, email, full_name)
        `)
        .eq('publisher_id', testStudent.id);
      
      if (searchError) {
        console.error('❌ 搜索失败:', searchError);
      } else {
        console.log(`✅ 找到 ${searchResults?.length} 个匹配的成果:`);
        searchResults?.forEach((result, index) => {
          const publisher = result.publisher;
          const displayName = publisher?.full_name || publisher?.username || '未知学生';
          console.log(`  ${index + 1}. "${result.title}" - ${displayName}`);
        });
      }
    }
    
    console.log('\n🎉 测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

testStudentNames();