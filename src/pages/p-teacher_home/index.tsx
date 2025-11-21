

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

// 声明Chart.js的全局类型
declare global {
  interface Window {
    Chart: any;
  }
}

const TeacherHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [activeViewType, setActiveViewType] = useState('monthly');
  const [currentDate, setCurrentDate] = useState('');
  const [isRefreshingTypes, setIsRefreshingTypes] = useState(false);
  
  const publicationChartRef = useRef<any>(null);
  const resultTypesChartRef = useRef<any>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '软院项目通 - 教师首页';
    return () => { 
      document.title = originalTitle; 
    };
  }, []);

  // 设置当前日期
  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const formattedDate = now.toLocaleDateString('zh-CN', options) + '，' + weekdays[now.getDay()];
    setCurrentDate(formattedDate);
  }, []);

  // 初始化图表
  useEffect(() => {
    if (typeof window.Chart === 'undefined') {
      // 如果Chart.js未加载，可能需要动态加载
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        initializeCharts();
      };
      document.head.appendChild(script);
      
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } else {
      initializeCharts();
    }

    return () => {
      // 清理图表实例
      if (publicationChartRef.current) {
        publicationChartRef.current.destroy();
        publicationChartRef.current = null;
      }
      if (resultTypesChartRef.current) {
        resultTypesChartRef.current.destroy();
        resultTypesChartRef.current = null;
      }
    };
  }, []);

  const initializeCharts = () => {
    // 成果发布量统计图表
    const publicationCtx = document.getElementById('publication-chart') as HTMLCanvasElement;
    if (publicationCtx && !publicationChartRef.current) {
      const ctx = publicationCtx.getContext('2d');
      if (ctx) {
        publicationChartRef.current = new window.Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
            datasets: [{
              label: '已发布',
              data: [12, 19, 15, 22, 18, 25],
              backgroundColor: '#1E88E5',
              borderRadius: 6
            }, {
              label: '待审批',
              data: [5, 8, 10, 7, 12, 15],
              backgroundColor: '#FFC107',
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: true,
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
    }

    // 成果类型分布图表
    const resultTypesCtx = document.getElementById('result-types-chart') as HTMLCanvasElement;
    if (resultTypesCtx && !resultTypesChartRef.current) {
      const ctx = resultTypesCtx.getContext('2d');
      if (ctx) {
        resultTypesChartRef.current = new window.Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['项目报告', '论文', '软件作品', '实验报告', '其他'],
            datasets: [{
              data: [35, 25, 20, 15, 5],
              backgroundColor: [
                '#1E88E5',
                '#43A047',
                '#FB8C00',
                '#8E24AA',
                '#757575'
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
              }
            },
            cutout: '70%'
          }
        });
      }
    }
  };

  const handleNavItemClick = (itemId: string, pageTitle: string) => {
    setActiveNavItem(itemId);
  };

  const handleViewTypeChange = (viewType: string) => {
    setActiveViewType(viewType);
    // 这里可以根据选择的视图更新图表数据
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNotificationClick = () => {
    alert('通知功能开发中...');
  };

  const handleRefreshTypes = () => {
    setIsRefreshingTypes(true);
    setTimeout(() => {
      setIsRefreshingTypes(false);
      // 这里可以添加刷新图表数据的逻辑
    }, 1000);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧导航栏 */}
        <aside 
          className={`w-64 bg-white shadow-sidebar flex-shrink-0 ${
            isMobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden md:block'
          }`}
        >
          {/* 学院Logo */}
          <div className="p-6 border-b border-border-light">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-lg font-bold text-text-primary">河北师范大学</h1>
                <p className="text-xs text-text-muted">软件学院</p>
              </div>
            </div>
          </div>
          
          {/* 导航菜单 */}
          <nav className="py-4">
            <ul>
              <li>
                <Link 
                  to="/teacher-home" 
                  className={`flex items-center px-6 py-3 ${
                    activeNavItem === 'dashboard' 
                      ? `text-secondary ${styles.sidebarItemActive}` 
                      : `text-text-secondary ${styles.sidebarItemHover}`
                  }`}
                  onClick={() => handleNavItemClick('dashboard', '数据看板')}
                >
                  <i className="fas fa-chart-line w-6 text-center"></i>
                  <span className="ml-3 font-medium">数据看板</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/achievement-approval" 
                  className={`flex items-center px-6 py-3 ${
                    activeNavItem === 'approval' 
                      ? `text-secondary ${styles.sidebarItemActive}` 
                      : `text-text-secondary ${styles.sidebarItemHover}`
                  }`}
                  onClick={() => handleNavItemClick('approval', '成果审批')}
                >
                  <i className="fas fa-tasks w-6 text-center"></i>
                  <span className="ml-3">成果审批</span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">12</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/achievement-publish" 
                  className={`flex items-center px-6 py-3 ${
                    activeNavItem === 'publish' 
                      ? `text-secondary ${styles.sidebarItemActive}` 
                      : `text-text-secondary ${styles.sidebarItemHover}`
                  }`}
                  onClick={() => handleNavItemClick('publish', '成果发布')}
                >
                  <i className="fas fa-paper-plane w-6 text-center"></i>
                  <span className="ml-3">成果发布</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/achievement-management" 
                  className={`flex items-center px-6 py-3 ${
                    activeNavItem === 'management' 
                      ? `text-secondary ${styles.sidebarItemActive}` 
                      : `text-text-secondary ${styles.sidebarItemHover}`
                  }`}
                  onClick={() => handleNavItemClick('management', '成果管理')}
                >
                  <i className="fas fa-cog w-6 text-center"></i>
                  <span className="ml-3">成果管理</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/achievement-view" 
                  className={`flex items-center px-6 py-3 ${
                    activeNavItem === 'view' 
                      ? `text-secondary ${styles.sidebarItemActive}` 
                      : `text-text-secondary ${styles.sidebarItemHover}`
                  }`}
                  onClick={() => handleNavItemClick('view', '成果查看')}
                >
                  <i className="fas fa-eye w-6 text-center"></i>
                  <span className="ml-3">成果查看</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* 底部导航 */}
          <div className="mt-auto p-4 border-t border-border-light">
            <ul>
              <li>
                <button 
                  className={`flex items-center px-6 py-3 text-text-secondary ${styles.sidebarItemHover} w-full text-left`}
                >
                  <i className="fas fa-user-cog w-6 text-center"></i>
                  <span className="ml-3">设置</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className={`flex items-center px-6 py-3 text-text-secondary ${styles.sidebarItemHover} w-full text-left`}
                >
                  <i className="fas fa-sign-out-alt w-6 text-center"></i>
                  <span className="ml-3">退出登录</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>
        
        {/* 主内容区域 */}
        <main className="flex-1 overflow-y-auto bg-bg-gray">
          {/* 顶部导航栏 */}
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 py-4">
              {/* 移动端菜单按钮 */}
              <button 
                onClick={handleMobileMenuToggle}
                className="md:hidden text-text-primary"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
              
              {/* 页面标题 */}
              <h2 className="text-xl font-semibold text-text-primary hidden md:block">数据看板</h2>
              
              {/* 用户信息 */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button 
                    onClick={handleNotificationClick}
                    className="text-text-secondary hover:text-secondary"
                  >
                    <i className="fas fa-bell text-xl"></i>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <img 
                    src="https://s.coze.cn/image/uf-pHaNc3bk/" 
                    alt="教师头像" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-secondary"
                  />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-text-primary">张教授</p>
                    <p className="text-xs text-text-muted">计算机科学与技术系</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          {/* 内容区域 */}
          <div className="p-6">
            {/* 欢迎信息 */}
            <div className={`mb-8 ${styles.fadeIn}`}>
              <h1 className="text-2xl font-bold text-text-primary">您好，张教授</h1>
              <p className="text-text-secondary mt-1">今天是 <span>{currentDate}</span></p>
            </div>
            
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* 待审批成果 */}
              <div className={`bg-white rounded-xl shadow-card p-6 transition-all duration-300 ${styles.cardHover} ${styles.fadeIn}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-muted text-sm">待审批成果</p>
                    <h3 className="text-3xl font-bold text-text-primary mt-2">12</h3>
                    <p className="text-green-500 text-xs mt-1 flex items-center">
                      <i className="fas fa-arrow-up mr-1"></i> 较上周增长 20%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-secondary">
                    <i className="fas fa-hourglass-half text-xl"></i>
                  </div>
                </div>
              </div>
              
              {/* 已发布成果 */}
              <div className={`bg-white rounded-xl shadow-card p-6 transition-all duration-300 ${styles.cardHover} ${styles.fadeIn}`} style={{animationDelay: '0.1s'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-muted text-sm">已发布成果</p>
                    <h3 className="text-3xl font-bold text-text-primary mt-2">86</h3>
                    <p className="text-green-500 text-xs mt-1 flex items-center">
                      <i className="fas fa-arrow-up mr-1"></i> 较上月增长 15%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                    <i className="fas fa-check-circle text-xl"></i>
                  </div>
                </div>
              </div>
              
              {/* 学生数量 */}
              <div className={`bg-white rounded-xl shadow-card p-6 transition-all duration-300 ${styles.cardHover} ${styles.fadeIn}`} style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-muted text-sm">指导学生</p>
                    <h3 className="text-3xl font-bold text-text-primary mt-2">45</h3>
                    <p className="text-text-muted text-xs mt-1">本学期</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                    <i className="fas fa-users text-xl"></i>
                  </div>
                </div>
              </div>
              
              {/* 项目数量 */}
              <div className={`bg-white rounded-xl shadow-card p-6 transition-all duration-300 ${styles.cardHover} ${styles.fadeIn}`} style={{animationDelay: '0.3s'}}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-muted text-sm">负责项目</p>
                    <h3 className="text-3xl font-bold text-text-primary mt-2">8</h3>
                    <p className="text-text-muted text-xs mt-1">当前进行中</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                    <i className="fas fa-project-diagram text-xl"></i>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* 成果发布量统计 */}
              <div className={`bg-white rounded-xl shadow-card p-6 ${styles.fadeIn}`} style={{animationDelay: '0.4s'}}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">成果发布量统计</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewTypeChange('monthly')}
                      className={`px-3 py-1 text-xs rounded-full ${
                        activeViewType === 'monthly' 
                          ? 'bg-secondary text-white' 
                          : 'bg-bg-gray text-text-secondary'
                      }`}
                    >
                      月度
                    </button>
                    <button 
                      onClick={() => handleViewTypeChange('quarterly')}
                      className={`px-3 py-1 text-xs rounded-full ${
                        activeViewType === 'quarterly' 
                          ? 'bg-secondary text-white' 
                          : 'bg-bg-gray text-text-secondary'
                      }`}
                    >
                      季度
                    </button>
                    <button 
                      onClick={() => handleViewTypeChange('yearly')}
                      className={`px-3 py-1 text-xs rounded-full ${
                        activeViewType === 'yearly' 
                          ? 'bg-secondary text-white' 
                          : 'bg-bg-gray text-text-secondary'
                      }`}
                    >
                      年度
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  <canvas id="publication-chart"></canvas>
                </div>
              </div>
              
              {/* 成果类型分布 */}
              <div className={`bg-white rounded-xl shadow-card p-6 ${styles.fadeIn}`} style={{animationDelay: '0.5s'}}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">成果类型分布</h3>
                  <button 
                    onClick={handleRefreshTypes}
                    className="text-secondary hover:text-accent"
                  >
                    <i className={`fas fa-sync-alt ${isRefreshingTypes ? 'fa-spin' : ''}`}></i>
                  </button>
                </div>
                <div className="h-80 flex items-center justify-center">
                  <canvas id="result-types-chart"></canvas>
                </div>
              </div>
            </div>
            
            {/* 最近活动 */}
            <div className={`bg-white rounded-xl shadow-card p-6 ${styles.fadeIn}`} style={{animationDelay: '0.6s'}}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">最近活动</h3>
                <button className="text-secondary hover:text-accent text-sm">查看全部</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">活动类型</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">相关成果</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">学生</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">时间</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-light hover:bg-bg-gray">
                      <td className="py-3 px-4 text-sm text-text-primary">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-secondary mr-3">
                            <i className="fas fa-file-alt"></i>
                          </div>
                          提交成果
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">基于深度学习的图像识别系统</td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        <div className="flex items-center">
                          <img src="https://s.coze.cn/image/6vJnRXeJz4k/" alt="学生头像" className="w-6 h-6 rounded-full mr-2" />
                          李明
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-muted">今天 09:30</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">待审批</span>
                      </td>
                    </tr>
                    <tr className="border-b border-border-light hover:bg-bg-gray">
                      <td className="py-3 px-4 text-sm text-text-primary">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                            <i className="fas fa-check"></i>
                          </div>
                          审批通过
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">移动应用开发实践报告</td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        <div className="flex items-center">
                          <img src="https://s.coze.cn/image/nqJSKgC19w4/" alt="学生头像" className="w-6 h-6 rounded-full mr-2" />
                          王华
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-muted">昨天 14:15</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">已通过</span>
                      </td>
                    </tr>
                    <tr className="border-b border-border-light hover:bg-bg-gray">
                      <td className="py-3 px-4 text-sm text-text-primary">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500 mr-3">
                            <i className="fas fa-times"></i>
                          </div>
                          审批驳回
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">数据库设计方案</td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        <div className="flex items-center">
                          <img src="https://s.coze.cn/image/3ckcsA0j0jA/" alt="学生头像" className="w-6 h-6 rounded-full mr-2" />
                          张伟
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-muted">前天 16:45</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">已驳回</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-bg-gray">
                      <td className="py-3 px-4 text-sm text-text-primary">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3">
                            <i className="fas fa-edit"></i>
                          </div>
                          更新成果
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">Web前端开发技术总结</td>
                      <td className="py-3 px-4 text-sm text-text-primary">
                        <div className="flex items-center">
                          <img src="https://s.coze.cn/image/Smoup6bLdIs/" alt="学生头像" className="w-6 h-6 rounded-full mr-2" />
                          刘洋
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-muted">3天前</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">已更新</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherHomePage;

