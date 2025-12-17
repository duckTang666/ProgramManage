// 网络连接诊断工具
export class NetworkDiagnostics {
  private static results: Array<{ test: string; status: string; details?: string }> = [];

  // 测试网络连接
  static async testNetworkConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      this.results.push({
        test: '基本网络连接',
        status: response.ok ? '✅ 通过' : '❌ 失败',
        details: `状态码: ${response.status}`
      });
      return response.ok;
    } catch (error: any) {
      this.results.push({
        test: '基本网络连接',
        status: '❌ 失败',
        details: error.message
      });
      return false;
    }
  }

  // 测试Supabase连接
  static async testSupabaseConnection(): Promise<boolean> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        this.results.push({
          test: 'Supabase配置',
          status: '❌ 失败',
          details: 'VITE_SUPABASE_URL 未设置'
        });
        return false;
      }

      // 测试Supabase REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      
      this.results.push({
        test: 'Supabase连接',
        status: response.ok ? '✅ 通过' : '❌ 失败',
        details: `URL: ${supabaseUrl}, 状态码: ${response.status}`
      });
      return response.ok;
    } catch (error: any) {
      this.results.push({
        test: 'Supabase连接',
        status: '❌ 失败',
        details: error.message
      });
      return false;
    }
  }

  // 检查CORS
  static async testCORS(): Promise<boolean> {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'OPTIONS',
        mode: 'cors',
        signal: AbortSignal.timeout(5000)
      });
      
      this.results.push({
        test: 'CORS配置',
        status: response.ok ? '✅ 通过' : '❌ 失败',
        details: `状态码: ${response.status}`
      });
      return response.ok;
    } catch (error: any) {
      this.results.push({
        test: 'CORS配置',
        status: '❌ 失败',
        details: error.message.includes('CORS') ? 'CORS阻止了请求' : error.message
      });
      return false;
    }
  }

  // 检查环境变量
  static checkEnvironmentVariables(): boolean {
    let allGood = true;
    
    if (!import.meta.env.VITE_SUPABASE_URL) {
      this.results.push({
        test: '环境变量 VITE_SUPABASE_URL',
        status: '❌ 失败',
        details: '未设置'
      });
      allGood = false;
    } else {
      this.results.push({
        test: '环境变量 VITE_SUPABASE_URL',
        status: '✅ 通过',
        details: import.meta.env.VITE_SUPABASE_URL
      });
    }

    if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
      this.results.push({
        test: '环境变量 VITE_SUPABASE_ANON_KEY',
        status: '❌ 失败',
        details: '未设置'
      });
      allGood = false;
    } else {
      this.results.push({
        test: '环境变量 VITE_SUPABASE_ANON_KEY',
        status: '✅ 通过',
        details: '已设置'
      });
    }

    return allGood;
  }

  // 运行完整诊断
  static async runFullDiagnostics(): Promise<Array<{ test: string; status: string; details?: string }>> {
    this.results = [];
    
    console.log('🔍 开始网络诊断...');
    
    // 检查基本条件
    this.checkEnvironmentVariables();
    
    // 网络测试
    await this.testNetworkConnection();
    await this.testSupabaseConnection();
    await this.testCORS();
    
    // 输出结果
    console.log('\n=== 网络诊断报告 ===');
    this.results.forEach(result => {
      console.log(`${result.status} ${result.test}`);
      if (result.details) {
        console.log(`   ${result.details}`);
      }
    });
    
    const failedTests = this.results.filter(r => r.status.includes('❌'));
    if (failedTests.length === 0) {
      console.log('\n🎉 所有测试通过！网络连接正常。');
    } else {
      console.log(`\n⚠️ 发现 ${failedTests.length} 个问题，请查看上方详情。`);
    }
    
    return this.results;
  }

  // 获取诊断建议
  static getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const failedTests = this.results.filter(r => r.status.includes('❌'));
    
    failedTests.forEach(test => {
      switch (test.test) {
        case '基本网络连接':
          recommendations.push('🌐 检查网络连接，确保可以访问互联网');
          recommendations.push('🔧 检查防火墙和代理设置');
          break;
        case 'Supabase连接':
          recommendations.push('🔗 检查Supabase URL是否正确');
          recommendations.push('🌐 确认Supabase项目是否正常运行');
          break;
        case 'CORS配置':
          recommendations.push('🔧 在Supabase Dashboard中配置CORS设置');
          recommendations.push('📋 添加你的域名到允许列表中');
          break;
        case '环境变量 VITE_SUPABASE_URL':
          recommendations.push('⚙️ 检查.env文件中的VITE_SUPABASE_URL配置');
          break;
        case '环境变量 VITE_SUPABASE_ANON_KEY':
          recommendations.push('⚙️ 检查.env文件中的VITE_SUPABASE_ANON_KEY配置');
          break;
      }
    });
    
    // 去重
    return [...new Set(recommendations)];
  }
}

export default NetworkDiagnostics;