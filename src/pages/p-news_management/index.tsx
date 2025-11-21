

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface NewsItem {
  id: string;
  title: string;
  category: 'notice' | 'activity' | 'achievement' | 'other';
  categoryText: string;
  categoryColor: string;
  time: string;
  content?: string;
  images?: string[];
}

const NewsManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string>('');
  const [activeNavItem, setActiveNavItem] = useState('news-link');
  
  // 搜索和筛选状态
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  
  // 表单状态
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('');
  const [newsContent, setNewsContent] = useState('请输入新闻内容...');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // 模拟新闻数据
  const [newsList, setNewsList] = useState<NewsItem[]>([
    {
      id: '1',
      title: '2024年软件学院项目展示会顺利举行',
      category: 'notice',
      categoryText: '通知公告',
      categoryColor: 'bg-green-100 text-secondary',
      time: '2024-05-20 10:23'
    },
    {
      id: '2',
      title: '我院教师在全国计算机大赛中获得佳绩',
      category: 'activity',
      categoryText: '活动新闻',
      categoryColor: 'bg-blue-100 text-blue-600',
      time: '2024-05-18 15:47'
    },
    {
      id: '3',
      title: '我院学生团队研发的智能助手应用上线',
      category: 'achievement',
      categoryText: '成果展示',
      categoryColor: 'bg-purple-100 text-purple-600',
      time: '2024-05-15 09:15'
    },
    {
      id: '4',
      title: '软件学院与多家企业签署校企合作协议',
      category: 'other',
      categoryText: '其他新闻',
      categoryColor: 'bg-amber-100 text-amber-600',
      time: '2024-05-10 14:30'
    },
    {
      id: '5',
      title: '关于2024年暑期社会实践活动的通知',
      category: 'notice',
      categoryText: '通知公告',
      categoryColor: 'bg-green-100 text-secondary',
      time: '2024-05-05 11:20'
    }
  ]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '软院项目通 - 新闻管理';
    return () => { 
      document.title = originalTitle; 
    };
  }, []);

  // 移动端菜单切换
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 导航项点击处理
  const handleNavItemClick = (itemId: string, href: string) => {
    setActiveNavItem(itemId);
    
    // 如果是当前页面的链接，阻止跳转
    if (itemId === activeNavItem) {
      return;
    }
    
    // 对于其他页面，执行跳转
    if (href === '/login') {
      if (confirm('确定要退出登录吗？')) {
        navigate(href);
      }
    } else {
      navigate(href);
    }
  };

  // 打开新增新闻模态框
  const handleAddNewsClick = () => {
    setIsEditing(false);
    setEditingNewsId('');
    setNewsTitle('');
    setNewsCategory('');
    setNewsContent('请输入新闻内容...');
    setUploadedImages([]);
    setIsNewsModalOpen(true);
  };

  // 打开编辑新闻模态框
  const handleEditNewsClick = (newsId: string) => {
    setIsEditing(true);
    setEditingNewsId(newsId);
    
    // 模拟填充表单数据
    const newsItem = newsList.find(item => item.id === newsId);
    if (newsItem) {
      setNewsTitle(newsItem.title);
      setNewsCategory(newsItem.category);
      
      // 模拟内容
      if (newsId === '1') {
        setNewsContent('5月20日，软件学院成功举办了2024年项目展示会，展示了我院学生在各个领域的创新成果。\n\n本次展示会吸引了众多师生和企业代表前来参观，获得了广泛好评。');
        setUploadedImages(['https://s.coze.cn/image/ShRPvcUoHf0/']);
      } else {
        setNewsContent('请输入新闻内容...');
        setUploadedImages([]);
      }
    }
    
    setIsNewsModalOpen(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsNewsModalOpen(false);
  };

  // 保存新闻
  const handleSaveNews = () => {
    if (!newsTitle || !newsCategory || newsContent === '请输入新闻内容...') {
      alert('请填写所有必填字段！');
      return;
    }

    if (isEditing && editingNewsId) {
      // 编辑新闻
      setNewsList(prevList => 
        prevList.map(item => 
          item.id === editingNewsId 
            ? { 
                ...item, 
                title: newsTitle, 
                category: newsCategory as any,
                categoryText: getCategoryText(newsCategory as any),
                categoryColor: getCategoryColor(newsCategory as any)
              }
            : item
        )
      );
      alert('新闻编辑成功！');
    } else {
      // 新增新闻
      const newId = String(Date.now());
      const newNews: NewsItem = {
        id: newId,
        title: newsTitle,
        category: newsCategory as any,
        categoryText: getCategoryText(newsCategory as any),
        categoryColor: getCategoryColor(newsCategory as any),
        time: new Date().toLocaleString('zh-CN', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        }).replace(/\//g, '-'),
        content: newsContent,
        images: uploadedImages
      };
      
      setNewsList(prevList => [newNews, ...prevList]);
      alert('新闻新增成功！');
    }
    
    handleCloseModal();
  };

  // 删除新闻
  const handleDeleteNews = (newsId: string) => {
    if (confirm('确定要删除这条新闻吗？')) {
      setNewsList(prevList => prevList.filter(item => item.id !== newsId));
      alert('新闻删除成功！');
    }
  };

  // 搜索处理
  const handleSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('搜索: ' + nameSearch);
      // 在实际应用中，这里会执行搜索
    }
  };

  // 获取栏目文本
  const getCategoryText = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      notice: '通知公告',
      activity: '活动新闻',
      achievement: '成果展示',
      other: '其他新闻'
    };
    return categoryMap[category] || '其他新闻';
  };

  // 获取栏目颜色
  const getCategoryColor = (category: string): string => {
    const colorMap: { [key: string]: string } = {
      notice: 'bg-green-100 text-secondary',
      activity: 'bg-blue-100 text-blue-600',
      achievement: 'bg-purple-100 text-purple-600',
      other: 'bg-amber-100 text-amber-600'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-600';
  };

  // 处理富文本编辑
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setNewsContent(target.innerText);
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // 模拟上传成功
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        newImages.push(`https://example.com/image-${Date.now()}-${i}.jpg`);
      }
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  // 删除已上传图片
  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
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
            <div className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100">
              <i className="fas fa-bell text-text-secondary"></i>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            
            <div className="flex items-center space-x-2 cursor-pointer">
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
        <aside className={`w-64 bg-bg-light shadow-sidebar flex-shrink-0 hidden md:block ${isMobileMenuOpen ? 'fixed inset-0 z-40' : ''}`}>
          <nav className="py-4">
            <div className="px-4 mb-6">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">主要功能</h3>
              <ul className="space-y-1">
                <li>
                  <Link 
                    to="/admin-home"
                    onClick={() => handleNavItemClick('dashboard-link', '/admin-home')}
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${activeNavItem === 'dashboard-link' ? styles.sidebarItemActive : ''}`}
                  >
                    <i className="fas fa-tachometer-alt w-5 text-center mr-3"></i>
                    <span>控制台</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/carousel-management"
                    onClick={() => handleNavItemClick('carousel-link', '/carousel-management')}
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${activeNavItem === 'carousel-link' ? styles.sidebarItemActive : ''}`}
                  >
                    <i className="fas fa-images w-5 text-center mr-3"></i>
                    <span>轮播图管理</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/news-management"
                    onClick={() => handleNavItemClick('news-link', '/news-management')}
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-green-600 rounded-r-lg ${activeNavItem === 'news-link' ? styles.sidebarItemActive : ''}`}
                  >
                    <i className="fas fa-newspaper w-5 text-center mr-3"></i>
                    <span>新闻管理</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/achievement-library-management"
                    onClick={() => handleNavItemClick('achievements-link', '/achievement-library-management')}
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${activeNavItem === 'achievements-link' ? styles.sidebarItemActive : ''}`}
                  >
                    <i className="fas fa-award w-5 text-center mr-3"></i>
                    <span>成果库管理</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/knowledge-base-management"
                    onClick={() => handleNavItemClick('knowledge-link', '/knowledge-base-management')}
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${activeNavItem === 'knowledge-link' ? styles.sidebarItemActive : ''}`}
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
                    onClick={() => handleNavItemClick('users-link', '/user-management')}
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${activeNavItem === 'users-link' ? styles.sidebarItemActive : ''}`}
                  >
                    <i className="fas fa-users w-5 text-center mr-3"></i>
                    <span>用户管理</span>
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavItemClick('settings-link', '#')}
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg w-full text-left ${activeNavItem === 'settings-link' ? styles.sidebarItemActive : ''}`}
                  >
                    <i className="fas fa-cog w-5 text-center mr-3"></i>
                    <span>系统设置</span>
                  </button>
                </li>
                <li>
                  <Link 
                    to="/login"
                    onClick={() => handleNavItemClick('logout-link', '/login')}
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${activeNavItem === 'logout-link' ? styles.sidebarItemActive : ''}`}
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
          onClick={handleMobileMenuToggle}
          className="md:hidden fixed bottom-4 right-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg z-50"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
        
        {/* 主内容 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* 页面标题 */}
          <div className={`mb-6 ${styles.fadeIn}`}>
            <h2 className="text-2xl font-bold text-text-primary">新闻管理</h2>
            <p className="text-text-muted mt-1">管理系统中的所有新闻内容</p>
          </div>
          
          {/* 搜索栏 */}
          <div className={`bg-bg-light rounded-xl shadow-card p-4 mb-6 ${styles.fadeInDelay1}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex flex-wrap gap-3 flex-1">
                {/* 栏目选择 */}
                <div className="w-full md:w-auto">
                  <label htmlFor="category-select" className="block text-sm font-medium text-text-secondary mb-1">栏目</label>
                  <select 
                    id="category-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full md:w-40 px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  >
                    <option value="">全部栏目</option>
                    <option value="notice">通知公告</option>
                    <option value="activity">活动新闻</option>
                    <option value="achievement">成果展示</option>
                    <option value="other">其他新闻</option>
                  </select>
                </div>
                
                {/* 类型选择 */}
                <div className="w-full md:w-auto">
                  <label htmlFor="type-select" className="block text-sm font-medium text-text-secondary mb-1">类型</label>
                  <select 
                    id="type-select"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full md:w-40 px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  >
                    <option value="">全部类型</option>
                    <option value="important">重要</option>
                    <option value="normal">普通</option>
                  </select>
                </div>
                
                {/* 日期选择 */}
                <div className="w-full md:w-auto">
                  <label htmlFor="date-select" className="block text-sm font-medium text-text-secondary mb-1">日期</label>
                  <select 
                    id="date-select"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full md:w-40 px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  >
                    <option value="">全部日期</option>
                    <option value="today">今天</option>
                    <option value="week">本周</option>
                    <option value="month">本月</option>
                    <option value="year">今年</option>
                  </select>
                </div>
                
                {/* 名称搜索 */}
                <div className="w-full md:flex-1">
                  <label htmlFor="name-search" className="block text-sm font-medium text-text-secondary mb-1">名称</label>
                  <div className="relative">
                    <input 
                      type="text"
                      id="name-search"
                      value={nameSearch}
                      onChange={(e) => setNameSearch(e.target.value)}
                      onKeyUp={handleSearchKeyUp}
                      placeholder="搜索新闻名称..." 
                      className="w-full pl-10 pr-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                  </div>
                </div>
              </div>
              
              {/* 新增按钮 */}
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-transparent mb-1">操作</label>
                <button 
                  onClick={handleAddNewsClick}
                  className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <i className="fas fa-plus mr-2"></i>
                  <span>新增</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* 列表展示 */}
          <div className={`bg-bg-light rounded-xl shadow-card p-4 mb-6 ${styles.fadeInDelay2}`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-text-primary">类型</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-text-primary">新闻名</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-text-primary">时间</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-text-primary">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {newsList.map((newsItem, index) => (
                    <tr 
                      key={newsItem.id} 
                      className={`${index < newsList.length - 1 ? 'border-b border-border-light' : ''} hover:bg-gray-50`}
                    >
                      <td className="py-3 px-4 text-sm text-text-secondary">
                        <span className={`px-2 py-1 ${newsItem.categoryColor} rounded-full text-xs`}>
                          {newsItem.categoryText}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-primary">{newsItem.title}</td>
                      <td className="py-3 px-4 text-sm text-text-muted">{newsItem.time}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditNewsClick(newsItem.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <i className="fas fa-edit"></i>
                            <span className="ml-1">编辑</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteNews(newsItem.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <i className="fas fa-trash"></i>
                            <span className="ml-1">删除</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页 */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-text-muted">
                显示 1 至 {newsList.length} 条，共 48 条
              </div>
              <div className="flex space-x-1">
                <button className="px-3 py-1 border border-border-light rounded-md text-text-secondary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  <i className="fas fa-chevron-left text-xs"></i>
                </button>
                <button className="px-3 py-1 border border-green-600 bg-green-600 text-white rounded-md">1</button>
                <button className="px-3 py-1 border border-border-light rounded-md text-text-secondary hover:bg-gray-50">2</button>
                <button className="px-3 py-1 border border-border-light rounded-md text-text-secondary hover:bg-gray-50">3</button>
                <button className="px-3 py-1 border border-border-light rounded-md text-text-secondary hover:bg-gray-50">4</button>
                <button className="px-3 py-1 border border-border-light rounded-md text-text-secondary hover:bg-gray-50">5</button>
                <button className="px-3 py-1 border border-border-light rounded-md text-text-secondary hover:bg-gray-50">
                  <i className="fas fa-chevron-right text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* 新增/编辑新闻模态框 */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className={styles.modalBackdrop} onClick={handleCloseModal}></div>
          <div className="bg-bg-light rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10">
            <div className="p-5 border-b border-border-light">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-text-primary">
                  {isEditing ? '编辑新闻' : '新增新闻'}
                </h3>
                <button onClick={handleCloseModal} className="text-text-muted hover:text-text-primary">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-5">
              <form>
                {/* 新闻名称 */}
                <div className="mb-4">
                  <label htmlFor="news-title" className="block text-sm font-medium text-text-secondary mb-1">
                    新闻名称 <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    id="news-title"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600" 
                    placeholder="请输入新闻名称"
                  />
                </div>
                
                {/* 新闻类型 */}
                <div className="mb-4">
                  <label htmlFor="news-category" className="block text-sm font-medium text-text-secondary mb-1">
                    新闻类型 <span className="text-red-500">*</span>
                  </label>
                  <select 
                    id="news-category"
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  >
                    <option value="">请选择新闻类型</option>
                    <option value="notice">通知公告</option>
                    <option value="activity">活动新闻</option>
                    <option value="achievement">成果展示</option>
                    <option value="other">其他新闻</option>
                  </select>
                </div>
                
                {/* 新闻内容 */}
                <div className="mb-4">
                  <label htmlFor="news-content" className="block text-sm font-medium text-text-secondary mb-1">
                    新闻内容 <span className="text-red-500">*</span>
                  </label>
                  <div 
                    id="news-content"
                    className={`${styles.editorContent} w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 p-3`}
                    contentEditable="true"
                    onInput={handleContentChange}
                    suppressContentEditableWarning={true}
                  >
                    {newsContent}
                  </div>
                </div>
                
                {/* 上传图片 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-secondary mb-1">上传图片</label>
                  <div className="border-2 border-dashed border-border-light rounded-lg p-4 text-center hover:border-green-600 transition-colors">
                    <input 
                      type="file"
                      id="image-upload"
                      onChange={handleFileUpload}
                      className="hidden" 
                      accept="image/*" 
                      multiple
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <i className="fas fa-cloud-upload-alt text-2xl text-text-muted mb-2"></i>
                      <p className="text-sm text-text-secondary">点击或拖拽图片到此处上传</p>
                      <p className="text-xs text-text-muted mt-1">支持 JPG、PNG、GIF 格式，单张不超过5MB</p>
                    </label>
                  </div>
                </div>
                
                {/* 已上传图片预览 */}
                {uploadedImages.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-secondary mb-1">已上传图片</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`上传图片 ${index + 1}`} 
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button 
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>
            
            <div className="p-5 border-t border-border-light flex justify-end space-x-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:bg-gray-50"
              >
                取消
              </button>
              <button 
                onClick={handleSaveNews}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsManagement;

