import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

interface AchievementSummary {
  id: string;
  title: string;
  projectTeam: string;
  summary: string;
  coreTechnology: string[];
  applicationValue: string;
  projectType: 'research' | 'development' | 'design' | 'competition';
  completionDate: string;
  status: 'completed' | 'ongoing' | 'award-winning';
  awards?: string[];
}

const AchievementSummariesView: React.FC = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('knowledge-link');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // 模拟成果提炼数据
  const summaries: AchievementSummary[] = [
    {
      id: '1',
      title: '基于深度学习的图像识别系统',
      projectTeam: 'AI创新实验室',
      summary: '设计并实现了一个基于深度学习的图像识别系统，能够准确识别多种场景下的物体，识别准确率达到95%以上，广泛应用于智能安防和工业质检领域。',
      coreTechnology: ['深度学习', '卷积神经网络', '图像处理', 'TensorFlow'],
      applicationValue: '在智能安防监控、工业产品质量检测、医疗影像诊断等领域具有广泛应用前景，已成功部署于3家企业，产生经济效益超过500万元。',
      projectType: 'research',
      completionDate: '2024-05-15',
      status: 'award-winning',
      awards: ['国家级创新创业大赛银奖', '省级科技成果一等奖']
    },
    {
      id: '2',
      title: '智能校园管理平台',
      projectTeam: '智慧校园团队',
      summary: '开发了一套集学生管理、课程安排、资源调配于一体的智能校园管理平台，实现了校园管理的数字化和智能化，提高了管理效率30%。',
      coreTechnology: ['React', 'Node.js', 'MongoDB', '微服务架构'],
      applicationValue: '已在本校和周边5所高校投入使用，服务师生超过2万人，显著提升了校园管理效率和服务质量。',
      projectType: 'development',
      completionDate: '2024-04-20',
      status: 'completed'
    },
    {
      id: '3',
      title: '基于区块链的数字版权保护系统',
      projectTeam: '区块链研究小组',
      summary: '利用区块链技术构建了数字版权保护系统，为原创作品提供不可篡改的版权证明和时间戳服务，有效保护创作者权益。',
      coreTechnology: ['区块链', '智能合约', '加密算法', '分布式存储'],
      applicationValue: '为数字内容创作者提供可靠的版权保护服务，已保护作品超过10万件，得到行业广泛认可。',
      projectType: 'research',
      completionDate: '2024-03-25',
      status: 'ongoing'
    },
    {
      id: '4',
      title: '虚拟现实教育培训系统',
      projectTeam: 'VR教育创新团队',
      summary: '开发了基于VR技术的教育培训系统，提供沉浸式学习体验，特别适用于专业技能培训和实践教学，学习效果提升40%。',
      coreTechnology: ['Unity3D', 'VR开发', '3D建模', '交互设计'],
      applicationValue: '在职业教育、技能培训、医疗教学等领域应用前景广阔，已与多家培训机构达成合作意向。',
      projectType: 'development',
      completionDate: '2024-05-10',
      status: 'completed'
    },
    {
      id: '5',
      title: '智能交通信号优化系统',
      projectTeam: '智能交通实验室',
      summary: '基于机器学习算法开发了智能交通信号优化系统，能够根据实时车流量自动调整信号配时，减少城市交通拥堵20%。',
      coreTechnology: ['机器学习', '数据分析', '交通仿真', '物联网'],
      applicationValue: '在试点城市应用后，显著缓解了交通拥堵问题，提升了道路通行效率，具有重要的社会价值和经济效益。',
      projectType: 'development',
      completionDate: '2024-04-15',
      status: 'award-winning',
      awards: ['智慧城市创新大赛金奖']
    },
    {
      id: '6',
      title: '移动应用UI/UX设计系统',
      projectTeam: '用户体验设计工作室',
      summary: '创建了一套完整的移动应用UI/UX设计系统和组件库，提供标准化的设计规范和可复用的设计组件，提升开发效率50%。',
      coreTechnology: ['UI设计', 'UX研究', '设计系统', '原型设计'],
      applicationValue: '被多家创业公司和设计团队采用，显著提升了产品设计和开发的一致性及效率。',
      projectType: 'design',
      completionDate: '2024-03-30',
      status: 'completed'
    }
  ];

  const projectTypes = [
    { id: 'all', name: '全部类型', icon: 'fas fa-th' },
    { id: 'research', name: '科研创新', icon: 'fas fa-flask' },
    { id: 'development', name: '系统开发', icon: 'fas fa-code' },
    { id: 'design', name: '设计作品', icon: 'fas fa-palette' },
    { id: 'competition', name: '竞赛成果', icon: 'fas fa-trophy' }
  ];

  const statusTypes = [
    { id: 'all', name: '全部状态', icon: 'fas fa-list' },
    { id: 'completed', name: '已完成', icon: 'fas fa-check-circle' },
    { id: 'ongoing', name: '进行中', icon: 'fas fa-spinner' },
    { id: 'award-winning', name: '获奖作品', icon: 'fas fa-award' }
  ];

  const typeColors = {
    research: 'text-purple-600 bg-purple-100',
    development: 'text-blue-600 bg-blue-100',
    design: 'text-pink-600 bg-pink-100',
    competition: 'text-yellow-600 bg-yellow-100'
  };

  const typeLabels = {
    research: '科研创新',
    development: '系统开发',
    design: '设计作品',
    competition: '竞赛成果'
  };

  const statusColors = {
    completed: 'text-green-600 bg-green-100',
    ongoing: 'text-yellow-600 bg-yellow-100',
    'award-winning': 'text-red-600 bg-red-100'
  };

  const statusLabels = {
    completed: '已完成',
    ongoing: '进行中',
    'award-winning': '获奖作品'
  };

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '软院项目通 - 成果内容提炼';
    return () => { 
      document.title = originalTitle; 
    };
  }, []);

  const filteredSummaries = summaries.filter(summary => {
    const matchesType = selectedType === 'all' || summary.projectType === selectedType;
    const matchesStatus = selectedStatus === 'all' || summary.status === selectedStatus;
    const matchesSearch = summary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         summary.projectTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         summary.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleSummaryClick = (summaryId: string) => {
    console.log('查看成果提炼: ' + summaryId);
    // 在实际应用中，这里会跳转到详情页或显示详细内容
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
              <span className="text-text-primary">成果内容提炼</span>
            </nav>
          </div>

          {/* 页面标题 */}
          <div className={`mb-6 ${styles.fadeIn}`}>
            <h2 className="text-2xl font-bold text-text-primary">成果内容提炼</h2>
            <p className="text-text-muted mt-1">汇总项目成果的核心内容、技术亮点和应用价值</p>
          </div>

          {/* 搜索和筛选栏 */}
          <div className="bg-bg-light rounded-xl shadow-card p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* 搜索框 */}
              <div className="flex-1">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                  <input
                    type="text"
                    placeholder="搜索项目名称、团队或内容..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* 统计信息 */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-text-muted">
                  共找到 <span className="text-green-600 font-semibold">{filteredSummaries.length}</span> 个成果
                </span>
              </div>
            </div>
          </div>

          {/* 筛选项 */}
          <div className="mb-6 space-y-4">
            {/* 项目类型筛选 */}
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3">项目类型</h4>
              <div className="flex flex-wrap gap-2">
                {projectTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedType === type.id
                        ? 'bg-green-600 text-white'
                        : 'bg-bg-light text-text-secondary hover:bg-bg-secondary'
                    }`}
                  >
                    <i className={`${type.icon} mr-2`}></i>
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 状态筛选 */}
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3">项目状态</h4>
              <div className="flex flex-wrap gap-2">
                {statusTypes.map(status => (
                  <button
                    key={status.id}
                    onClick={() => setSelectedStatus(status.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedStatus === status.id
                        ? 'bg-green-600 text-white'
                        : 'bg-bg-light text-text-secondary hover:bg-bg-secondary'
                    }`}
                  >
                    <i className={`${status.icon} mr-2`}></i>
                    {status.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 成果列表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSummaries.map((summary, index) => (
              <div
                key={summary.id}
                className={`bg-bg-light rounded-xl shadow-card p-6 cursor-pointer ${styles.summaryCard} ${styles.cardHover} ${styles.fadeIn}`}
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => handleSummaryClick(summary.id)}
              >
                {/* 头部信息 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${typeColors[summary.projectType]}`}>
                      {typeLabels[summary.projectType]}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[summary.status]}`}>
                      {statusLabels[summary.status]}
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">{summary.completionDate}</span>
                </div>
                
                {/* 项目标题和团队 */}
                <h3 className="text-xl font-semibold text-text-primary mb-2">{summary.title}</h3>
                <div className="flex items-center text-sm text-text-muted mb-4">
                  <i className="fas fa-users mr-2"></i>
                  <span>{summary.projectTeam}</span>
                </div>
                
                {/* 项目摘要 */}
                <p className="text-text-secondary text-sm mb-4 line-clamp-3">{summary.summary}</p>
                
                {/* 核心技术 */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-text-primary mb-2">核心技术</h4>
                  <div className="flex flex-wrap gap-2">
                    {summary.coreTechnology.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* 应用价值 */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-text-primary mb-2">应用价值</h4>
                  <p className="text-text-secondary text-sm line-clamp-2">{summary.applicationValue}</p>
                </div>
                
                {/* 获奖情况 */}
                {summary.awards && summary.awards.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-text-primary mb-2">获奖情况</h4>
                    <div className="space-y-1">
                      {summary.awards.map((award, idx) => (
                        <div key={idx} className="flex items-center text-sm text-text-muted">
                          <i className="fas fa-award text-yellow-500 mr-2"></i>
                          <span>{award}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 底部操作 */}
                <div className="flex justify-between items-center pt-4 border-t border-border-light">
                  <button className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium">
                    <span>查看详情</span>
                    <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredSummaries.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                <i className="fas fa-search text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">未找到相关成果</h3>
              <p className="text-text-secondary">尝试调整搜索关键词或选择其他筛选条件</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AchievementSummariesView;