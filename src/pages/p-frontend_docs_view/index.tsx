import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  lastUpdated: string;
  readTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const FrontendDocsView: React.FC = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('knowledge-link');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // 模拟文档数据
  const documents: Document[] = [
    {
      id: '1',
      title: '系统界面概览',
      description: '介绍系统整体界面布局、导航结构和主要功能模块，帮助新用户快速熟悉系统界面。',
      category: 'getting-started',
      lastUpdated: '2024-05-20',
      readTime: 5,
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: '登录认证流程',
      description: '详细说明用户登录、注册、忘记密码等认证相关功能的使用方法和注意事项。',
      category: 'getting-started',
      lastUpdated: '2024-05-18',
      readTime: 8,
      difficulty: 'beginner'
    },
    {
      id: '3',
      title: '个人中心使用指南',
      description: '介绍个人信息管理、密码修改、头像上传等个人中心功能的使用方法。',
      category: 'user-guide',
      lastUpdated: '2024-05-19',
      readTime: 6,
      difficulty: 'beginner'
    },
    {
      id: '4',
      title: '项目展示模块操作说明',
      description: '详细说明项目浏览、搜索、筛选、详情查看等功能的使用方法和操作技巧。',
      category: 'user-guide',
      lastUpdated: '2024-05-17',
      readTime: 10,
      difficulty: 'intermediate'
    },
    {
      id: '5',
      title: '成果发布功能详解',
      description: '介绍成果发布、编辑、状态管理等功能的详细操作步骤和注意事项。',
      category: 'user-guide',
      lastUpdated: '2024-05-16',
      readTime: 12,
      difficulty: 'intermediate'
    },
    {
      id: '6',
      title: '数据可视化模块使用',
      description: '详细介绍系统数据可视化功能，包括图表类型选择、数据配置、导出等功能。',
      category: 'features',
      lastUpdated: '2024-05-15',
      readTime: 15,
      difficulty: 'advanced'
    },
    {
      id: '7',
      title: '消息通知中心',
      description: '说明系统消息通知的接收、查看、处理等功能的使用方法和设置选项。',
      category: 'features',
      lastUpdated: '2024-05-14',
      readTime: 7,
      difficulty: 'beginner'
    },
    {
      id: '8',
      title: '响应式设计与移动端适配',
      description: '介绍系统在不同设备上的显示效果和移动端特殊功能的使用方法。',
      category: 'technical',
      lastUpdated: '2024-05-13',
      readTime: 10,
      difficulty: 'intermediate'
    },
    {
      id: '9',
      title: '浏览器兼容性说明',
      description: '详细说明系统支持的浏览器版本、兼容性问题和优化建议。',
      category: 'technical',
      lastUpdated: '2024-05-12',
      readTime: 8,
      difficulty: 'advanced'
    },
    {
      id: '10',
      title: '常见问题排查',
      description: '汇总用户常见问题、错误信息和解决方法，提供快速故障排除指南。',
      category: 'troubleshooting',
      lastUpdated: '2024-05-11',
      readTime: 12,
      difficulty: 'intermediate'
    },
    {
      id: '11',
      title: '快捷键和操作技巧',
      description: '提供系统快捷键列表、操作技巧和效率提升建议，帮助用户更高效地使用系统。',
      category: 'troubleshooting',
      lastUpdated: '2024-05-10',
      readTime: 6,
      difficulty: 'beginner'
    },
    {
      id: '12',
      title: '新功能更新说明',
      description: '定期更新系统新功能介绍、界面改版说明和使用指南。',
      category: 'updates',
      lastUpdated: '2024-05-20',
      readTime: 5,
      difficulty: 'beginner'
    }
  ];

  const categories = [
    { id: 'all', name: '全部', icon: 'fas fa-folder-open' },
    { id: 'getting-started', name: '快速入门', icon: 'fas fa-rocket' },
    { id: 'user-guide', name: '用户指南', icon: 'fas fa-book-open' },
    { id: 'features', name: '功能说明', icon: 'fas fa-star' },
    { id: 'technical', name: '技术文档', icon: 'fas fa-cog' },
    { id: 'troubleshooting', name: '问题排查', icon: 'fas fa-tools' },
    { id: 'updates', name: '更新说明', icon: 'fas fa-bell' }
  ];

  const difficultyColors = {
    beginner: 'text-green-600 bg-green-100',
    intermediate: 'text-yellow-600 bg-yellow-100',
    advanced: 'text-red-600 bg-red-100'
  };

  const difficultyLabels = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级'
  };

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '软院项目通 - 前端系统使用说明';
    return () => { 
      document.title = originalTitle; 
    };
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDocumentClick = (docId: string) => {
    console.log('查看文档: ' + docId);
    // 在实际应用中，这里会跳转到文档详情页或显示文档内容
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <i className="fas fa-user"></i>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-text-primary">{user?.full_name || user?.username || '管理员'}</p>
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
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${activeNavItem === 'dashboard-link' ? styles.sidebarItemActive : ''}`}
                    onClick={() => setActiveNavItem('dashboard-link')}
                  >
                    <i className="fas fa-tachometer-alt w-5 text-center mr-3"></i>
                    <span>控制台</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/knowledge-base-management" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg ${activeNavItem === 'knowledge-link' ? styles.sidebarItemActive : ''}`}
                    onClick={() => setActiveNavItem('knowledge-link')}
                  >
                    <i className="fas fa-book w-5 text-center mr-3"></i>
                    <span>知识库管理</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>
        
        {/* 主内容 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* 面包屑导航 */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/knowledge-base-management" className="text-text-muted hover:text-green-600">
                <i className="fas fa-home mr-1"></i>
                知识库管理
              </Link>
              <span className="text-text-muted">/</span>
              <span className="text-text-primary">前端系统使用说明</span>
            </nav>
          </div>

          {/* 页面标题 */}
          <div className={`mb-6 ${styles.fadeIn}`}>
            <h2 className="text-2xl font-bold text-text-primary">前端系统使用说明</h2>
            <p className="text-text-muted mt-1">详细介绍系统前端界面的使用方法、功能模块和操作流程</p>
          </div>

          {/* 搜索和筛选栏 */}
          <div className="bg-bg-light rounded-xl shadow-card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* 搜索框 */}
              <div className="flex-1">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                  <input
                    type="text"
                    placeholder="搜索文档标题或内容..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* 统计信息 */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-text-muted">
                  共找到 <span className="text-green-600 font-semibold">{filteredDocuments.length}</span> 篇文档
                </span>
              </div>
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-bg-light text-text-secondary hover:bg-bg-secondary'
                  }`}
                >
                  <i className={`${category.icon} mr-2`}></i>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* 文档列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc, index) => (
              <div
                key={doc.id}
                className={`bg-bg-light rounded-xl shadow-card p-6 cursor-pointer ${styles.knowledgeCard} ${styles.cardHover} ${styles.fadeIn}`}
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => handleDocumentClick(doc.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[doc.difficulty]}`}>
                    {difficultyLabels[doc.difficulty]}
                  </span>
                  <span className="text-xs text-text-muted">{doc.readTime} 分钟阅读</span>
                </div>
                
                <h3 className="text-lg font-semibold text-text-primary mb-2">{doc.title}</h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-3">{doc.description}</p>
                
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span><i className="far fa-calendar mr-1"></i>{doc.lastUpdated}</span>
                  <button className="text-green-600 hover:text-green-700 flex items-center">
                    <span>查看详情</span>
                    <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                <i className="fas fa-search text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">未找到相关文档</h3>
              <p className="text-text-secondary">尝试调整搜索关键词或选择其他分类</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FrontendDocsView;