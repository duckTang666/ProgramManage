

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface TreeNode {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  children?: TreeNode[];
  isOpen?: boolean;
  leader?: string;
}

interface User {
  id: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  className: string;
  email: string;
  status: 'active' | 'inactive';
  isLeader?: boolean;
}

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // 组织架构数据
  const [organizationTree, setOrganizationTree] = useState<TreeNode[]>([
    {
      id: 'root',
      name: '软件学院',
      icon: 'fas fa-university',
      iconColor: 'text-secondary',
      isOpen: false,
      children: [
        {
          id: 'admin',
          name: '管理员',
          icon: 'fas fa-user-shield',
          iconColor: 'text-red-500',
          isOpen: false,
          children: [
            {
              id: 'admin-1',
              name: '系统管理员',
              icon: 'fas fa-user',
              iconColor: 'text-red-400'
            }
          ]
        },
        {
          id: 'teachers',
          name: '教师',
          icon: 'fas fa-chalkboard-teacher',
          iconColor: 'text-blue-500',
          isOpen: false,
          children: [
            {
              id: 'teacher-1',
              name: '张教授',
              icon: 'fas fa-user',
              iconColor: 'text-blue-400'
            },
            {
              id: 'teacher-2',
              name: '李讲师',
              icon: 'fas fa-user',
              iconColor: 'text-blue-400'
            }
          ]
        },
        {
          id: 'class-1',
          name: '软件工程1班',
          icon: 'fas fa-graduation-cap',
          iconColor: 'text-green-500',
          isOpen: false,
          leader: '张教授',
          children: [
            {
              id: 'student-1',
              name: '王同学',
              icon: 'fas fa-user',
              iconColor: 'text-green-400'
            },
            {
              id: 'student-2',
              name: '陈同学',
              icon: 'fas fa-user',
              iconColor: 'text-green-400'
            }
          ]
        },
        {
          id: 'class-2',
          name: '软件工程2班',
          icon: 'fas fa-graduation-cap',
          iconColor: 'text-green-500',
          isOpen: false,
          leader: '李讲师',
          children: [
            {
              id: 'student-3',
              name: '赵同学',
              icon: 'fas fa-user',
              iconColor: 'text-green-400'
            },
            {
              id: 'student-4',
              name: '刘同学',
              icon: 'fas fa-user',
              iconColor: 'text-green-400'
            }
          ]
        }
      ]
    }
  ]);

  // 用户列表数据
  const [usersList] = useState<User[]>([
    {
      id: '1',
      name: '系统管理员',
      role: 'admin',
      className: '-',
      email: 'admin@example.com',
      status: 'active'
    },
    {
      id: '2',
      name: '张教授',
      role: 'teacher',
      className: '软件工程1班',
      email: 'zhang@example.com',
      status: 'active',
      isLeader: true
    },
    {
      id: '3',
      name: '李讲师',
      role: 'teacher',
      className: '软件工程2班',
      email: 'li@example.com',
      status: 'active',
      isLeader: true
    },
    {
      id: '4',
      name: '王同学',
      role: 'student',
      className: '软件工程1班',
      email: 'wang@example.com',
      status: 'active'
    },
    {
      id: '5',
      name: '陈同学',
      role: 'student',
      className: '软件工程1班',
      email: 'chen@example.com',
      status: 'inactive'
    }
  ]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '软院项目通 - 用户管理';
    return () => { document.title = originalTitle; };
  }, []);

  // 移动端菜单切换
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 树节点展开/收起
  const handleTreeNodeToggle = (nodeId: string, nodes: TreeNode[] = organizationTree): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, isOpen: !node.isOpen };
      }
      if (node.children) {
        return { ...node, children: handleTreeNodeToggle(nodeId, node.children) };
      }
      return node;
    });
  };

  // 展开全部
  const handleExpandAll = () => {
    const expandAllNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => ({
        ...node,
        isOpen: true,
        children: node.children ? expandAllNodes(node.children) : undefined
      }));
    };
    setOrganizationTree(expandAllNodes(organizationTree));
  };

  // 收起全部
  const handleCollapseAll = () => {
    const collapseAllNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => ({
        ...node,
        isOpen: false,
        children: node.children ? collapseAllNodes(node.children) : undefined
      }));
    };
    setOrganizationTree(collapseAllNodes(organizationTree));
  };

  // 渲染树节点
  const renderTreeNode = (node: TreeNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className={`${styles.treeNode} p-2 rounded-lg cursor-pointer`}>
        <div className="flex items-center">
          {hasChildren && (
            <i 
              className={`fas fa-chevron-right ${styles.treeToggle} ${node.isOpen ? styles.open : ''} w-4 h-4 text-text-muted mr-2`}
              onClick={(e) => {
                e.stopPropagation();
                setOrganizationTree(prev => handleTreeNodeToggle(node.id, prev));
              }}
            ></i>
          )}
          {!hasChildren && <div className="w-6"></div>}
          <i className={`${node.icon} ${node.iconColor} mr-2`}></i>
          <span className="font-medium">{node.name}</span>
          {node.leader && (
            <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
              Leader: {node.leader}
            </span>
          )}
        </div>
        {hasChildren && node.isOpen && (
          <div className={`${styles.treeChildren} ml-6 mt-2 space-y-2`}>
            {node.children!.map(childNode => renderTreeNode(childNode, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // 获取角色样式
  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'admin':
        return 'px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full';
      case 'teacher':
        return 'px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full';
      case 'student':
        return 'px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full';
      default:
        return 'px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full';
    }
  };

  // 获取用户图标
  const getUserIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return 'fas fa-user-shield text-red-500 bg-red-100';
      case 'teacher':
        return 'fas fa-chalkboard-teacher text-blue-500 bg-blue-100';
      case 'student':
        return 'fas fa-user-graduate text-green-500 bg-green-100';
      default:
        return 'fas fa-user text-gray-500 bg-gray-100';
    }
  };

  // 退出登录
  const handleLogout = (e: React.MouseEvent) => {
    if (!confirm('确定要退出登录吗？')) {
      e.preventDefault();
    }
  };

  // 操作按钮处理
  const handleCreateClass = () => {
    console.log('创建班级');
  };

  const handleAddUser = () => {
    console.log('添加用户');
  };

  const handleImportUsers = () => {
    console.log('导入用户');
  };

  const handleExportUsers = () => {
    console.log('导出用户');
  };

  const handleUserProfileClick = () => {
    console.log('打开用户菜单');
  };

  const handleNotificationClick = () => {
    console.log('打开通知面板');
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
        <aside className={`w-64 bg-bg-light shadow-sidebar flex-shrink-0 hidden md:block ${isMobileMenuOpen ? 'fixed inset-0 z-40' : ''}`}>
          <nav className="py-4">
            <div className="px-4 mb-6">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">主要功能</h3>
              <ul className="space-y-1">
                <li>
                  <Link 
                    to="/admin-home" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg`}
                  >
                    <i className="fas fa-tachometer-alt w-5 text-center mr-3"></i>
                    <span>控制台</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/carousel-management" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg`}
                  >
                    <i className="fas fa-images w-5 text-center mr-3"></i>
                    <span>轮播图管理</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/news-management" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg`}
                  >
                    <i className="fas fa-newspaper w-5 text-center mr-3"></i>
                    <span>新闻管理</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/achievement-library-management" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg`}
                  >
                    <i className="fas fa-award w-5 text-center mr-3"></i>
                    <span>成果库管理</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/knowledge-base-management" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg`}
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
                    className={`${styles.sidebarItem} ${styles.active} flex items-center px-4 py-3 text-green-600 rounded-r-lg`}
                  >
                    <i className="fas fa-users w-5 text-center mr-3"></i>
                    <span>用户管理</span>
                  </Link>
                </li>
                <li>
                  <button className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg w-full text-left`}>
                    <i className="fas fa-cog w-5 text-center mr-3"></i>
                    <span>系统设置</span>
                  </button>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className={`${styles.sidebarItem} flex items-center px-4 py-3 text-text-secondary hover:text-green-600 rounded-r-lg`}
                    onClick={handleLogout}
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
            <h2 className="text-2xl font-bold text-text-primary">用户管理</h2>
            <p className="text-text-muted mt-1">管理用户权限和组织架构</p>
          </div>
          
          {/* 操作按钮区域 */}
          <div className={`flex flex-wrap gap-3 mb-6 ${styles.fadeIn}`} style={{animationDelay: '0.1s'}}>
            <button 
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={handleCreateClass}
            >
              <i className="fas fa-plus mr-2"></i>
              <span>创建班级</span>
            </button>
            <button 
              className="flex items-center px-4 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              onClick={handleAddUser}
            >
              <i className="fas fa-user-plus mr-2"></i>
              <span>添加用户</span>
            </button>
            <button 
              className="flex items-center px-4 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              onClick={handleImportUsers}
            >
              <i className="fas fa-file-import mr-2"></i>
              <span>导入用户</span>
            </button>
            <button 
              className="flex items-center px-4 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              onClick={handleExportUsers}
            >
              <i className="fas fa-file-export mr-2"></i>
              <span>导出用户</span>
            </button>
          </div>
          
          {/* 搜索和筛选区域 */}
          <div className={`bg-bg-light rounded-xl shadow-card p-4 mb-6 ${styles.fadeIn}`} style={{animationDelay: '0.2s'}}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="搜索用户姓名、学号或邮箱..." 
                    className="w-full px-4 py-2 pl-10 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                </div>
              </div>
              <div className="flex gap-3">
                <select 
                  className="px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">所有角色</option>
                  <option value="admin">管理员</option>
                  <option value="teacher">教师</option>
                  <option value="student">学生</option>
                </select>
                <select 
                  className="px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600"
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                >
                  <option value="">所有班级</option>
                  <option value="class1">软件工程1班</option>
                  <option value="class2">软件工程2班</option>
                  <option value="class3">计算机科学1班</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* 组织架构和用户列表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 组织架构树状图 */}
            <div className={`lg:col-span-1 bg-bg-light rounded-xl shadow-card p-5 ${styles.fadeIn}`} style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">组织架构</h3>
                <div className="flex gap-2">
                  <button 
                    className="text-sm text-green-600 hover:text-green-700"
                    onClick={handleExpandAll}
                  >
                    <i className="fas fa-expand-alt mr-1"></i>展开全部
                  </button>
                  <button 
                    className="text-sm text-green-600 hover:text-green-700"
                    onClick={handleCollapseAll}
                  >
                    <i className="fas fa-compress-alt mr-1"></i>收起全部
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {organizationTree.map(node => renderTreeNode(node))}
              </div>
            </div>
            
            {/* 用户列表 */}
            <div className={`lg:col-span-2 bg-bg-light rounded-xl shadow-card p-5 ${styles.fadeIn}`} style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">用户列表</h3>
                <div className="flex items-center">
                  <span className="text-sm text-text-muted mr-2">显示</span>
                  <select 
                    className="px-2 py-1 text-sm border border-border-light rounded focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span className="text-sm text-text-muted ml-2">条/页</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className={`${styles.userTable} w-full min-w-[600px]`}>
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">姓名</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">角色</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">班级</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">邮箱</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">状态</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(user => (
                      <tr key={user.id} className="border-t border-border-light">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 ${getUserIcon(user.role)} rounded-full flex items-center justify-center mr-3`}>
                              <i className={getUserIcon(user.role).split(' ')[0]}></i>
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={getRoleStyle(user.role)}>
                            {user.role === 'admin' ? '管理员' : user.role === 'teacher' ? '教师' : '学生'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {user.className === '-' ? '-' : `${user.className}${user.isLeader ? ' (Leader)' : ''}`}
                        </td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center ${user.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                            <i className="fas fa-circle text-xs mr-1"></i>
                            {user.status === 'active' ? '活跃' : '未激活'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button className="text-green-600 hover:text-green-700" title="编辑">
                              <i className="fas fa-edit"></i>
                            </button>
                            {(user.role === 'teacher' && user.isLeader) && (
                              <button className="text-green-600 hover:text-green-700" title="管理班级">
                                <i className="fas fa-users-cog"></i>
                              </button>
                            )}
                            {user.role === 'student' && (
                              <button className="text-green-600 hover:text-green-700" title="调整班级">
                                <i className="fas fa-exchange-alt"></i>
                              </button>
                            )}
                            <button className="text-gray-500 hover:text-gray-700" title="重置密码">
                              <i className="fas fa-key"></i>
                            </button>
                            <button className="text-gray-500 hover:text-gray-700" title="查看详情">
                              <i className="fas fa-eye"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 分页 */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-text-muted">
                  显示 1 至 5 条，共 24 条
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded border border-border-light text-text-muted hover:border-green-600 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled
                  >
                    <i className="fas fa-chevron-left text-xs"></i>
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-green-600 bg-green-600 text-white">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-border-light text-text-primary hover:border-green-600 hover:text-green-600">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-border-light text-text-primary hover:border-green-600 hover:text-green-600">3</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-border-light text-text-muted hover:border-green-600 hover:text-green-600">
                    <i className="fas fa-chevron-right text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;

