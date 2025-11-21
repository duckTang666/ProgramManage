

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface CarouselItem {
  id: string;
  imageUrl: string;
  imageAlt: string;
  imageCategory: string;
  displayUrl: string;
  textContent: string;
  linkUrl: string;
}

const CarouselManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('carousel');
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 轮播图数据
  const [carouselItems] = useState<CarouselItem[]>([
    {
      id: '1',
      imageUrl: 'https://s.coze.cn/image/TuAdm4H8xkQ/',
      imageAlt: '学院最新通知轮播图',
      imageCategory: '建筑城市',
      displayUrl: 'https://s.coze.cn/image/tIRP7R9iGC4/',
      textContent: '学院最新通知：2024年软件学院项目展示会顺利举行',
      linkUrl: 'https://s.coze.cn/image/RrXht-GemeM/'
    },
    {
      id: '2',
      imageUrl: 'https://s.coze.cn/image/XxIy42IIkfI/',
      imageAlt: '校园活动轮播图',
      imageCategory: '建筑城市',
      displayUrl: 'https://s.coze.cn/image/iTgyyFXDX9g/',
      textContent: '校园活动：2024年春季学期社团招新活动',
      linkUrl: 'https://s.coze.cn/image/nxbo5dNJE6Q/'
    },
    {
      id: '3',
      imageUrl: 'https://s.coze.cn/image/hAJh5j3GC_s/',
      imageAlt: '学术讲座轮播图',
      imageCategory: '建筑城市',
      displayUrl: 'https://s.coze.cn/image/RQVNOE1KnW4/',
      textContent: '学术讲座：人工智能前沿技术与应用',
      linkUrl: 'https://s.coze.cn/image/GVwA0vBwEco/'
    },
    {
      id: '4',
      imageUrl: 'https://s.coze.cn/image/DKwOJsN6fM8/',
      imageAlt: '招生信息轮播图',
      imageCategory: '建筑城市',
      displayUrl: 'https://s.coze.cn/image/6Fie3SkF8Lc/',
      textContent: '招生信息：2024年软件学院招生简章',
      linkUrl: 'https://s.coze.cn/image/PRoqmBQz-bk/'
    },
    {
      id: '5',
      imageUrl: 'https://s.coze.cn/image/139tQxdxB3o/',
      imageAlt: '校企合作轮播图',
      imageCategory: '建筑城市',
      displayUrl: 'https://s.coze.cn/image/vAFEx-c7MqQ/',
      textContent: '校企合作：我院与多家知名企业签署合作协议',
      linkUrl: 'https://s.coze.cn/image/N4XnEjKdvns/'
    }
  ]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '软院项目通 - 轮播图管理';
    return () => { 
      document.title = originalTitle; 
    };
  }, []);

  // 移动端菜单切换
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 导航项点击处理
  const handleNavItemClick = (itemId: string, href?: string) => {
    setActiveNavItem(itemId);
    if (href && href !== '#') {
      // 对于需要导航的链接，使用Link组件处理
      // 这里的事件处理主要是为了设置active状态
    }
  };

  // 添加轮播图
  const handleAddCarousel = () => {
    console.log('打开添加轮播图表单');
    // 在实际应用中，这里会打开添加轮播图的模态框或页面
  };

  // 编辑轮播图
  const handleEditCarousel = (id: string) => {
    console.log('编辑轮播图 ID:', id);
    // 在实际应用中，这里会打开编辑轮播图的模态框或页面
  };

  // 删除轮播图
  const handleDeleteCarousel = (id: string) => {
    if (confirm('确定要删除这个轮播图吗？')) {
      console.log('删除轮播图 ID:', id);
      // 在实际应用中，这里会发送删除请求并更新列表
    }
  };

  // 分页处理
  const handlePageChange = (page: number | string) => {
    if (page === 'prev') {
      if (activePage > 1) {
        setActivePage(activePage - 1);
      }
    } else if (page === 'next') {
      setActivePage(activePage + 1);
    } else if (typeof page === 'number') {
      setActivePage(page);
    }
    console.log('跳转到第', page, '页');
  };

  // 用户信息点击
  const handleUserProfileClick = () => {
    console.log('打开用户菜单');
    // 在实际应用中，这里会显示用户菜单
  };

  // 通知图标点击
  const handleNotificationClick = () => {
    console.log('打开通知面板');
    // 在实际应用中，这里会显示通知面板
  };

  // 退出登录
  const handleLogout = (e: React.MouseEvent) => {
    if (confirm('确定要退出登录吗？')) {
      // 继续默认行为，跳转到登录页
    } else {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="bg-bg-light shadow-sm z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* 左侧Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-user-shield text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">软院项目通</h1>
              <p className="text-xs text-text-muted">管理员后台</p>
            </div>
          </div>
          
          {/* 右侧用户信息 */}
          <div className="flex items-center space-x-4">
            <div 
              className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100"
              onClick={handleNotificationClick}
            >
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleUserProfileClick}
            >
              <div className="w-8 h-8 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center text-green-600">
                <i className="fas fa-user"></i>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-text-primary">管理员</p>
                <p className="text-xs text-text-muted">系统管理员</p>
              </div>
              <i className="fas fa-chevron-down text-xs text-text-muted"></i>
            </div>
          </div>
        </div>
      </header>
      
      {/* 主内容区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧导航栏 */}
        <aside className={`w-64 bg-bg-light shadow-sidebar flex-shrink-0 hidden md:block ${
          isMobileMenuOpen ? 'fixed inset-0 z-40' : ''
        }`}>
          <nav className="py-4">
            <div className="px-4 mb-6">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">主要功能</h3>
              <ul className="space-y-1">
                <li>
                  <Link 
                    to="/admin-home" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${
                      activeNavItem === 'dashboard' ? styles.sidebarItemActive : ''
                    }`}
                    onClick={() => handleNavItemClick('dashboard')}
                  >
                    <i className="fas fa-tachometer-alt w-5 text-center mr-3"></i>
                    <span>控制台</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/carousel-management" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-green-600 rounded-r-lg ${
                      activeNavItem === 'carousel' ? styles.sidebarItemActive : ''
                    }`}
                    onClick={() => handleNavItemClick('carousel')}
                  >
                    <i className="fas fa-images w-5 text-center mr-3"></i>
                    <span>轮播图管理</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/news-management" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${
                      activeNavItem === 'news' ? styles.sidebarItemActive : ''
                    }`}
                    onClick={() => handleNavItemClick('news')}
                  >
                    <i className="fas fa-newspaper w-5 text-center mr-3"></i>
                    <span>新闻管理</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/achievement-library-management" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${
                      activeNavItem === 'achievements' ? styles.sidebarItemActive : ''
                    }`}
                    onClick={() => handleNavItemClick('achievements')}
                  >
                    <i className="fas fa-award w-5 text-center mr-3"></i>
                    <span>成果库管理</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/knowledge-base-management" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${
                      activeNavItem === 'knowledge' ? styles.sidebarItemActive : ''
                    }`}
                    onClick={() => handleNavItemClick('knowledge')}
                  >
                    <i className="fas fa-book w-5 text-center mr-3"></i>
                    <span>知识库管理</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="px-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">系统设置</h3>
              <ul className="space-y-1">
                <li>
                  <Link 
                    to="/user-management" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${
                      activeNavItem === 'users' ? styles.sidebarItemActive : ''
                    }`}
                    onClick={() => handleNavItemClick('users')}
                  >
                    <i className="fas fa-users w-5 text-center mr-3"></i>
                    <span>用户管理</span>
                  </Link>
                </li>
                <li>
                  <button 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg w-full text-left ${
                      activeNavItem === 'settings' ? styles.sidebarItemActive : ''
                    }`}
                    onClick={() => handleNavItemClick('settings', '#')}
                  >
                    <i className="fas fa-cog w-5 text-center mr-3"></i>
                    <span>系统设置</span>
                  </button>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${
                      activeNavItem === 'logout' ? styles.sidebarItemActive : ''
                    }`}
                    onClick={(e) => {
                      handleNavItemClick('logout');
                      handleLogout(e);
                    }}
                  >
                    <i className="fas fa-sign-out-alt w-5 text-center mr-3"></i>
                    <span>退出登录</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>
        
        {/* 移动端菜单按钮 */}
        <button 
          className="md:hidden fixed bottom-4 right-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg z-50"
          onClick={handleMobileMenuToggle}
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
        
        {/* 主内容 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* 页面标题 */}
          <div className={`mb-6 ${styles.fadeIn}`}>
            <h2 className="text-2xl font-bold text-text-primary">轮播图管理</h2>
            <p className="text-text-muted mt-1">管理网站首页展示的轮播图内容</p>
          </div>
          
          {/* 搜索和添加按钮 */}
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 ${styles.fadeInDelay1}`}>
            <div className="relative w-full md:w-64 mb-4 md:mb-0">
              <input 
                type="text" 
                placeholder="搜索轮播图..." 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
            </div>
            
            <button 
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              onClick={handleAddCarousel}
            >
              <i className="fas fa-plus mr-2"></i>
              <span>添加轮播图</span>
            </button>
          </div>
          
          {/* 轮播图列表 */}
          <div className={`bg-bg-light rounded-xl shadow-card p-4 md:p-6 mb-6 ${styles.fadeInDelay2}`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-text-primary">图片URL</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-text-primary">文字内容</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-text-primary">文字跳转链接</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-text-primary">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {carouselItems.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`${index < carouselItems.length - 1 ? 'border-b border-border-light' : ''} ${styles.tableRowHover}`}
                    >
                      <td className="py-4 px-4 text-sm text-text-primary">
                        <div className="flex items-center">
                          <img 
                            src={item.imageUrl} 
                            alt={item.imageAlt} 
                            data-category={item.imageCategory}
                            className="w-16 h-10 object-cover rounded mr-3"
                          />
                          <span className="truncate max-w-[150px]">{item.displayUrl}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-text-primary">{item.textContent}</td>
                      <td className="py-4 px-4 text-sm text-green-600 hover:underline">
                        <a href={item.linkUrl} target="_blank" rel="noopener noreferrer">
                          {item.linkUrl}
                        </a>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditCarousel(item.id)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteCarousel(item.id)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页控件 */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-text-muted">
                显示 1-5 条，共 12 条
              </div>
              
              <div className="flex items-center space-x-1">
                <button 
                  className={`${styles.paginationItem} ${activePage === 1 ? styles.paginationItemDisabled : ''} w-8 h-8 flex items-center justify-center rounded text-text-muted`}
                  onClick={() => handlePageChange('prev')}
                  disabled={activePage === 1}
                >
                  <i className="fas fa-chevron-left text-xs"></i>
                </button>
                <button 
                  className={`${styles.paginationItem} ${activePage === 1 ? styles.paginationItemActive : ''} w-8 h-8 flex items-center justify-center rounded`}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
                <button 
                  className={`${styles.paginationItem} ${activePage === 2 ? styles.paginationItemActive : ''} w-8 h-8 flex items-center justify-center rounded`}
                  onClick={() => handlePageChange(2)}
                >
                  2
                </button>
                <button 
                  className={`${styles.paginationItem} ${activePage === 3 ? styles.paginationItemActive : ''} w-8 h-8 flex items-center justify-center rounded`}
                  onClick={() => handlePageChange(3)}
                >
                  3
                </button>
                <button 
                  className={`${styles.paginationItem} w-8 h-8 flex items-center justify-center rounded text-text-primary`}
                  onClick={() => handlePageChange('next')}
                >
                  <i className="fas fa-chevron-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CarouselManagement;

