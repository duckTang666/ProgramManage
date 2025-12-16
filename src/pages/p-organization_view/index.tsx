import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './styles.module.css';

interface Department {
  id: string;
  name: string;
  description: string;
  responsibilities: string[];
  head: string;
  members: number;
  location: string;
}

interface ProjectTeam {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  leader: string;
  members: string[];
  currentProject: string;
  achievements: string[];
}

const OrganizationView: React.FC = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('knowledge-link');
  const [activeTab, setActiveTab] = useState<'departments' | 'teams'>('departments');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // 模拟部门数据
  const departments: Department[] = [
    {
      id: '1',
      name: '软件工程系',
      description: '负责软件工程专业教学、科研和人才培养，涵盖软件开发、项目管理、软件测试等方向。',
      responsibilities: [
        '软件工程专业课程教学',
        '软件工程科研项目研发',
        '学生实践能力培养',
        '产学研合作推进',
        '专业建设和课程改革'
      ],
      head: '张教授',
      members: 25,
      location: '教学楼A座3层'
    },
    {
      id: '2',
      name: '计算机科学系',
      description: '专注于计算机科学与技术研究，包括算法设计、人工智能、数据科学等前沿领域。',
      responsibilities: [
        '计算机科学基础理论教学',
        '前沿技术研究与开发',
        '学术交流与合作',
        '研究生培养',
        '实验室建设与管理'
      ],
      head: '李教授',
      members: 30,
      location: '科研楼B座2层'
    },
    {
      id: '3',
      name: '数字媒体技术系',
      description: '致力于数字媒体技术教学与研究，涵盖图形图像处理、动画设计、游戏开发等领域。',
      responsibilities: [
        '数字媒体专业教学',
        '创意设计项目开发',
        '多媒体技术研究',
        '校企合作项目',
        '学生创意作品指导'
      ],
      head: '王教授',
      members: 20,
      location: '艺术楼C座4层'
    },
    {
      id: '4',
      name: '网络工程系',
      description: '负责网络工程相关教学与研究，包括网络安全、云计算、物联网等方向。',
      responsibilities: [
        '网络工程专业课程教学',
        '网络安全技术研究',
        '校园网络建设维护',
        '网络实验室管理',
        '网络安全人才培养'
      ],
      head: '刘教授',
      members: 22,
      location: '实验楼D座1层'
    },
    {
      id: '5',
      name: '实验教学中心',
      description: '为全院提供实验技术支持和实验设备管理，保障教学实验顺利进行。',
      responsibilities: [
        '实验设备管理维护',
        '实验教学技术支持',
        '实验室安全管理',
        '实验教师培训',
        '实验条件改善'
      ],
      head: '陈主任',
      members: 15,
      location: '实验楼E座1-3层'
    }
  ];

  // 模拟项目团队数据
  const projectTeams: ProjectTeam[] = [
    {
      id: '1',
      name: 'AI创新实验室',
      description: '专注于人工智能算法研究和应用开发，在机器学习、深度学习等领域有丰富经验。',
      specialties: ['机器学习', '深度学习', '计算机视觉', '自然语言处理'],
      leader: '张博士',
      members: ['张博士', '李研究员', '王工程师', '赵博士生', '钱硕士生'],
      currentProject: '智能图像识别系统开发',
      achievements: [
        '国家级创新创业大赛银奖',
        '发表SCI论文5篇',
        '申请专利3项',
        '与企业合作项目2项'
      ]
    },
    {
      id: '2',
      name: '智慧校园团队',
      description: '致力于校园信息化建设，开发智能校园管理系统，提升校园管理效率。',
      specialties: ['Web开发', '移动应用开发', '数据库设计', '系统架构'],
      leader: '刘工程师',
      members: ['刘工程师', '陈开发者', '杨设计师', '周测试员', '吴运维'],
      currentProject: '智能校园管理平台V2.0',
      achievements: [
        '省级教育信息化项目一等奖',
        '服务师生2万余人',
        '提升管理效率30%',
        '获得多项软件著作权'
      ]
    },
    {
      id: '3',
      name: '区块链研究小组',
      description: '探索区块链技术在教育、金融等领域的应用，开发创新的区块链解决方案。',
      specialties: ['区块链技术', '智能合约', '加密算法', '分布式系统'],
      leader: '王教授',
      members: ['王教授', '孙博士生', '李硕士生', '周研究员', '吴开发者'],
      currentProject: '基于区块链的学历认证系统',
      achievements: [
        '发表顶级会议论文2篇',
        '获得国家自然科学基金资助',
        '与金融机构合作项目',
        '技术专利申请2项'
      ]
    },
    {
      id: '4',
      name: 'VR教育创新团队',
      description: '运用VR技术开发沉浸式教育应用，改变传统教学模式，提升学习体验。',
      specialties: ['VR开发', '3D建模', '交互设计', '游戏引擎'],
      leader: '赵教授',
      members: ['赵教授', '钱设计师', '孙开发者', '李美术师', '周策划'],
      currentProject: '虚拟现实职业技能培训系统',
      achievements: [
        '获得VR教育创新大赛金奖',
        '产品应用于10余所学校',
        '用户满意度95%以上',
        '获得风投机构投资'
      ]
    },
    {
      id: '5',
      name: '网络安全实验室',
      description: '专注于网络安全技术研究，为校园网络安全提供技术支持和防护方案。',
      specialties: ['网络安全', '渗透测试', '安全审计', '应急响应'],
      leader: '陈专家',
      members: ['陈专家', '黄安全员', '林分析师', '刘工程师', '张研究员'],
      currentProject: '校园网络安全防护体系升级',
      achievements: [
        '成功防御多次网络攻击',
        '发现并修复安全漏洞50+',
        '建立完善的安全防护体系',
        '培养网络安全人才20余名'
      ]
    }
  ];

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '软院项目通 - 组织架构说明';
    return () => { 
      document.title = originalTitle; 
    };
  }, []);

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeams = projectTeams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.leader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDepartmentClick = (deptId: string) => {
    console.log('查看部门详情: ' + deptId);
    // 在实际应用中，这里会跳转到部门详情页
  };

  const handleTeamClick = (teamId: string) => {
    console.log('查看团队详情: ' + teamId);
    // 在实际应用中，这里会跳转到团队详情页
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
              <span className="text-text-primary">组织架构说明</span>
            </nav>
          </div>

          {/* 页面标题 */}
          <div className={`mb-6 ${styles.fadeIn}`}>
            <h2 className="text-2xl font-bold text-text-primary">组织架构说明</h2>
            <p className="text-text-muted mt-1">详细介绍软件学院各部门和项目团队的组成与职责</p>
          </div>

          {/* 搜索框 */}
          <div className="bg-bg-light rounded-xl shadow-card p-4 mb-6">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
              <input
                type="text"
                placeholder="搜索部门、团队或负责人..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 选项卡切换 */}
          <div className="mb-6">
            <div className="flex border-b border-border-light">
              <button
                onClick={() => setActiveTab('departments')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'departments'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <i className="fas fa-building mr-2"></i>
                部门结构
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'teams'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-text-muted hover:text-text-primary'
                }`}
              >
                <i className="fas fa-users mr-2"></i>
                项目团队
              </button>
            </div>
          </div>

          {/* 部门结构内容 */}
          {activeTab === 'departments' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDepartments.map((dept, index) => (
                <div
                  key={dept.id}
                  className={`bg-bg-light rounded-xl shadow-card p-6 cursor-pointer ${styles.orgCard} ${styles.cardHover} ${styles.fadeIn}`}
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => handleDepartmentClick(dept.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
                        <i className="fas fa-building text-xl"></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">{dept.name}</h3>
                        <p className="text-sm text-text-muted">负责人：{dept.head}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text-muted">{dept.members} 人</div>
                      <div className="text-xs text-text-muted">{dept.location}</div>
                    </div>
                  </div>
                  
                  <p className="text-text-secondary text-sm mb-4">{dept.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-text-primary mb-2">主要职责</h4>
                    <ul className="space-y-1">
                      {dept.responsibilities.slice(0, 3).map((resp, idx) => (
                        <li key={idx} className="text-xs text-text-secondary flex items-start">
                          <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                          <span>{resp}</span>
                        </li>
                      ))}
                      {dept.responsibilities.length > 3 && (
                        <li className="text-xs text-text-muted">还有 {dept.responsibilities.length - 3} 项职责...</li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-border-light">
                    <button className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium">
                      <span>查看详情</span>
                      <i className="fas fa-arrow-right ml-1"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 项目团队内容 */}
          {activeTab === 'teams' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTeams.map((team, index) => (
                <div
                  key={team.id}
                  className={`bg-bg-light rounded-xl shadow-card p-6 cursor-pointer ${styles.orgCard} ${styles.cardHover} ${styles.fadeIn}`}
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => handleTeamClick(team.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                        <i className="fas fa-users text-xl"></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">{team.name}</h3>
                        <p className="text-sm text-text-muted">负责人：{team.leader}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text-muted">{team.members.length} 人</div>
                    </div>
                  </div>
                  
                  <p className="text-text-secondary text-sm mb-4">{team.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-text-primary mb-2">技术专长</h4>
                    <div className="flex flex-wrap gap-2">
                      {team.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-text-primary mb-2">当前项目</h4>
                    <p className="text-xs text-text-secondary">{team.currentProject}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-text-primary mb-2">主要成就</h4>
                    <div className="space-y-1">
                      {team.achievements.slice(0, 2).map((achievement, idx) => (
                        <div key={idx} className="flex items-start">
                          <i className="fas fa-trophy text-yellow-500 mr-2 mt-0.5 text-xs"></i>
                          <span className="text-xs text-text-secondary">{achievement}</span>
                        </div>
                      ))}
                      {team.achievements.length > 2 && (
                        <div className="text-xs text-text-muted">还有 {team.achievements.length - 2} 项成就...</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-border-light">
                    <button className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium">
                      <span>查看详情</span>
                      <i className="fas fa-arrow-right ml-1"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 空状态 */}
          {(activeTab === 'departments' && filteredDepartments.length === 0) || 
           (activeTab === 'teams' && filteredTeams.length === 0) ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                <i className="fas fa-search text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">未找到相关信息</h3>
              <p className="text-text-secondary">尝试调整搜索关键词</p>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default OrganizationView;