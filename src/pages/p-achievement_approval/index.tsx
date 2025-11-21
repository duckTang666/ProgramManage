

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface Achievement {
  id: string;
  name: string;
  type: string;
  studentName: string;
  studentAvatar: string;
  teacherName: string;
  submitTime: string;
}

const AchievementApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [currentAchievementId, setCurrentAchievementId] = useState<string | null>(null);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [score, setScore] = useState('');
  
  // 搜索条件状态
  const [classFilter, setClassFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  
  // 模拟成果数据
  const achievements: Achievement[] = [
    {
      id: '1',
      name: '基于深度学习的图像识别系统',
      type: '软件作品',
      studentName: '李明',
      studentAvatar: 'https://s.coze.cn/image/KE8k0CYyEsc/',
      teacherName: '张教授',
      submitTime: '2024-06-15 09:30'
    },
    {
      id: '2',
      name: '大数据分析在教育领域的应用研究',
      type: '论文',
      studentName: '王华',
      studentAvatar: 'https://s.coze.cn/image/JUin9ZwQCH8/',
      teacherName: '李教授',
      submitTime: '2024-06-14 16:45'
    },
    {
      id: '3',
      name: '智能校园管理系统设计与实现',
      type: '软件作品',
      studentName: '张伟',
      studentAvatar: 'https://s.coze.cn/image/pRypxB1qnno/',
      teacherName: '张教授',
      submitTime: '2024-06-14 14:20'
    },
    {
      id: '4',
      name: 'Web前端框架性能比较研究',
      type: '论文',
      studentName: '刘洋',
      studentAvatar: 'https://s.coze.cn/image/YxScAmR1LvM/',
      teacherName: '王教授',
      submitTime: '2024-06-13 11:10'
    },
    {
      id: '5',
      name: '移动应用开发实践报告',
      type: '实验报告',
      studentName: '陈明',
      studentAvatar: 'https://s.coze.cn/image/Ywrmz6dOJck/',
      teacherName: '张教授',
      submitTime: '2024-06-12 15:30'
    }
  ];
  
  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '软院项目通 - 成果审批';
    return () => { document.title = originalTitle; };
  }, []);
  
  // 移动端菜单切换
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // 通知按钮点击
  const handleNotificationClick = () => {
    alert('通知功能开发中...');
  };
  
  // 搜索功能
  const handleSearch = () => {
    alert('搜索功能开发中...');
  };
  
  // 批改按钮点击
  const handleReviewClick = (achievement: Achievement) => {
    setCurrentAchievementId(achievement.id);
    setCurrentAchievement(achievement);
    setShowPreviewModal(true);
  };
  
  // 关闭预览模态框
  const handleClosePreviewModal = () => {
    setShowPreviewModal(false);
    setCurrentAchievementId(null);
    setCurrentAchievement(null);
  };
  
  // 驳回按钮点击
  const handleRejectClick = () => {
    setShowRejectModal(true);
  };
  
  // 取消驳回
  const handleCancelReject = () => {
    setShowRejectModal(false);
    setRejectReason('');
  };
  
  // 确认驳回
  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      alert('请输入驳回原因');
      return;
    }
    
    alert(`成果ID: ${currentAchievementId} 已驳回，原因: ${rejectReason}`);
    
    setShowRejectModal(false);
    setShowPreviewModal(false);
    setRejectReason('');
    setCurrentAchievementId(null);
    setCurrentAchievement(null);
  };
  
  // 通过按钮点击
  const handleApproveClick = () => {
    setShowScoreModal(true);
  };
  
  // 取消评分
  const handleCancelScore = () => {
    setShowScoreModal(false);
    setScore('');
  };
  
  // 确认评分
  const handleConfirmScore = () => {
    const scoreValue = parseInt(score);
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
      alert('请输入有效的分数（0-100）');
      return;
    }
    
    alert(`成果ID: ${currentAchievementId} 已通过，分数: ${scoreValue}`);
    
    setShowScoreModal(false);
    setShowPreviewModal(false);
    setScore('');
    setCurrentAchievementId(null);
    setCurrentAchievement(null);
  };
  
  // 获取类型样式
  const getTypeStyle = (type: string) => {
    switch (type) {
      case '软件作品':
        return 'px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full';
      case '论文':
        return 'px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full';
      case '实验报告':
        return 'px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full';
      default:
        return 'px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full';
    }
  };
  
  // 模态框外部点击关闭
  const handleModalBackdropClick = (e: React.MouseEvent, closeModal: () => void) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
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
                  className={`flex items-center px-6 py-3 text-text-secondary ${styles.sidebarItemHover}`}
                >
                  <i className="fas fa-chart-line w-6 text-center"></i>
                  <span className="ml-3 font-medium">数据看板</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/achievement-approval" 
                  className={`flex items-center px-6 py-3 text-secondary ${styles.sidebarItemActive}`}
                >
                  <i className="fas fa-tasks w-6 text-center"></i>
                  <span className="ml-3">成果审批</span>
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">12</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/achievement-publish" 
                  className={`flex items-center px-6 py-3 text-text-secondary ${styles.sidebarItemHover}`}
                >
                  <i className="fas fa-paper-plane w-6 text-center"></i>
                  <span className="ml-3">成果发布</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/achievement-management" 
                  className={`flex items-center px-6 py-3 text-text-secondary ${styles.sidebarItemHover}`}
                >
                  <i className="fas fa-cog w-6 text-center"></i>
                  <span className="ml-3">成果管理</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/achievement-view" 
                  className={`flex items-center px-6 py-3 text-text-secondary ${styles.sidebarItemHover}`}
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
                <button className={`flex items-center px-6 py-3 text-text-secondary ${styles.sidebarItemHover} w-full text-left`}>
                  <i className="fas fa-user-cog w-6 text-center"></i>
                  <span className="ml-3">设置</span>
                </button>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className={`flex items-center px-6 py-3 text-text-secondary ${styles.sidebarItemHover}`}
                >
                  <i className="fas fa-sign-out-alt w-6 text-center"></i>
                  <span className="ml-3">退出登录</span>
                </Link>
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
              <h2 className="text-xl font-semibold text-text-primary hidden md:block">成果审批</h2>
              
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
                    src="https://s.coze.cn/image/W9aKtpJZs9s/" 
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
            {/* 搜索栏 */}
            <div className={`bg-white rounded-xl shadow-card p-6 mb-6 ${styles.fadeIn}`}>
              <h3 className="text-lg font-semibold text-text-primary mb-4">搜索条件</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 班级选择 */}
                <div className="form-group">
                  <label htmlFor="class-select" className="block text-sm font-medium text-text-secondary mb-1">班级</label>
                  <select 
                    id="class-select"
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
                  >
                    <option value="">全部班级</option>
                    <option value="class1">软件工程1班</option>
                    <option value="class2">软件工程2班</option>
                    <option value="class3">计算机科学与技术1班</option>
                    <option value="class4">计算机科学与技术2班</option>
                  </select>
                </div>
                
                {/* 类型选择 */}
                <div className="form-group">
                  <label htmlFor="type-select" className="block text-sm font-medium text-text-secondary mb-1">类型</label>
                  <select 
                    id="type-select"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
                  >
                    <option value="">全部类型</option>
                    <option value="project">项目报告</option>
                    <option value="paper">论文</option>
                    <option value="software">软件作品</option>
                    <option value="experiment">实验报告</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                
                {/* 成果名称 */}
                <div className="form-group">
                  <label htmlFor="name-input" className="block text-sm font-medium text-text-secondary mb-1">成果名称</label>
                  <input 
                    type="text" 
                    id="name-input"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    placeholder="请输入成果名称" 
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
                
                {/* 学生姓名 */}
                <div className="form-group">
                  <label htmlFor="student-input" className="block text-sm font-medium text-text-secondary mb-1">学生姓名</label>
                  <input 
                    type="text" 
                    id="student-input"
                    value={studentFilter}
                    onChange={(e) => setStudentFilter(e.target.value)}
                    placeholder="请输入学生姓名" 
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
                  />
                </div>
              </div>
              
              {/* 搜索按钮 */}
              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleSearch}
                  className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors"
                >
                  <i className="fas fa-search mr-2"></i>搜索
                </button>
              </div>
            </div>
            
            {/* 成果列表 */}
            <div className={`bg-white rounded-xl shadow-card p-6 ${styles.fadeIn}`} style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-text-primary">待审批成果列表</h3>
                <div className="text-sm text-text-muted">共 <span>12</span> 条记录</div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">成果名称</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">类型</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">学生姓名</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">指导老师</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">提交时间</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievements.map((achievement, index) => (
                      <tr key={achievement.id} className={`${index < achievements.length - 1 ? 'border-b border-border-light' : ''} hover:bg-bg-gray`}>
                        <td className="py-3 px-4 text-sm text-text-primary">{achievement.name}</td>
                        <td className="py-3 px-4 text-sm text-text-primary">
                          <span className={getTypeStyle(achievement.type)}>{achievement.type}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-primary">
                          <div className="flex items-center">
                            <img 
                              src={achievement.studentAvatar} 
                              alt="学生头像" 
                              className="w-6 h-6 rounded-full mr-2"
                            />
                            {achievement.studentName}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-text-primary">{achievement.teacherName}</td>
                        <td className="py-3 px-4 text-sm text-text-muted">{achievement.submitTime}</td>
                        <td className="py-3 px-4">
                          <button 
                            onClick={() => handleReviewClick(achievement)}
                            className="px-3 py-1 bg-secondary text-white text-sm rounded-lg hover:bg-accent transition-colors"
                          >
                            批改
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 分页 */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-text-muted">显示 1-5 条，共 12 条</div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-border-light rounded-lg text-text-secondary hover:bg-bg-gray disabled:opacity-50" disabled>
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button className="px-3 py-1 bg-secondary text-white rounded-lg">1</button>
                  <button className="px-3 py-1 border border-border-light rounded-lg text-text-secondary hover:bg-bg-gray">2</button>
                  <button className="px-3 py-1 border border-border-light rounded-lg text-text-secondary hover:bg-bg-gray">3</button>
                  <button className="px-3 py-1 border border-border-light rounded-lg text-text-secondary hover:bg-bg-gray">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* 成果预览模态框 */}
      {showPreviewModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={(e) => handleModalBackdropClick(e, handleClosePreviewModal)}
        >
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* 模态框头部 */}
            <div className="p-6 border-b border-border-light flex justify-between items-center">
              <h3 className="text-xl font-semibold text-text-primary">
                {currentAchievement ? `成果预览: ${currentAchievement.name}` : '成果预览'}
              </h3>
              <button 
                onClick={handleClosePreviewModal}
                className="text-text-muted hover:text-text-primary"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            {/* 模态框内容 */}
            <div className="p-6 overflow-y-auto flex-grow">
              {currentAchievement ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-text-primary">成果信息</h4>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-text-muted">成果名称</p>
                        <p className="text-text-primary">{currentAchievement.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">类型</p>
                        <p className="text-text-primary">{currentAchievement.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">学生姓名</p>
                        <p className="text-text-primary">{currentAchievement.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">指导老师</p>
                        <p className="text-text-primary">{currentAchievement.teacherName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">提交时间</p>
                        <p className="text-text-primary">{currentAchievement.submitTime}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-text-primary">成果内容</h4>
                    <div className="mt-2 p-4 bg-bg-gray rounded-lg">
                      <p className="text-text-primary">这里是成果的详细内容预览。在实际应用中，这里会显示学生提交的完整成果内容，包括文字、图片、代码等。</p>
                      <p className="text-text-primary mt-2">系统支持多种格式的成果预览，方便教师进行在线审批。</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-text-primary">附件列表</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center p-3 bg-bg-gray rounded-lg">
                        <i className="fas fa-file-pdf text-red-500 mr-3"></i>
                        <div className="flex-grow">
                          <p className="text-text-primary">成果报告.pdf</p>
                          <p className="text-xs text-text-muted">2.5MB</p>
                        </div>
                        <button className="text-secondary hover:text-accent">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                      <div className="flex items-center p-3 bg-bg-gray rounded-lg">
                        <i className="fas fa-file-image text-blue-500 mr-3"></i>
                        <div className="flex-grow">
                          <p className="text-text-primary">系统截图.png</p>
                          <p className="text-xs text-text-muted">1.2MB</p>
                        </div>
                        <button className="text-secondary hover:text-accent">
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-text-muted">
                  <i className="fas fa-file-alt text-4xl mb-4"></i>
                  <p>请选择一个成果进行预览</p>
                </div>
              )}
            </div>
            
            {/* 模态框底部 */}
            <div className="p-6 border-t border-border-light flex justify-end space-x-4">
              <button 
                onClick={handleRejectClick}
                className="px-6 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              >
                驳回
              </button>
              <button 
                onClick={handleApproveClick}
                className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors"
              >
                通过
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 驳回原因模态框 */}
      {showRejectModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={(e) => handleModalBackdropClick(e, handleCancelReject)}
        >
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">驳回原因</h3>
            <textarea 
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请输入驳回原因..." 
              className="w-full px-4 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button 
                onClick={handleCancelReject}
                className="px-6 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-bg-gray transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmReject}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                确认驳回
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 评分模态框 */}
      {showScoreModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={(e) => handleModalBackdropClick(e, handleCancelScore)}
        >
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">评分</h3>
            <div className="mb-4">
              <label htmlFor="score-input" className="block text-sm font-medium text-text-secondary mb-1">分数</label>
              <input 
                type="number" 
                id="score-input"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                min="0" 
                max="100" 
                step="1" 
                placeholder="请输入分数" 
                className="w-full px-4 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={handleCancelScore}
                className="px-6 py-2 border border-border-light text-text-secondary rounded-lg hover:bg-bg-gray transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleConfirmScore}
                className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-accent transition-colors"
              >
                确认通过
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementApprovalPage;

