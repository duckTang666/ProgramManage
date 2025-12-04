import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './AdminUserInfo.module.css';

interface AdminUserInfoProps {
  className?: string;
}

const AdminUserInfo: React.FC<AdminUserInfoProps> = ({ className = '' }) => {
  const { user } = useAuth();

  return (
    <div className={`flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 ${className}`}>
      <div className="w-8 h-8 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center text-green-600">
        <i className="fas fa-user"></i>
      </div>
      <div className="hidden md:block">
        <p className="text-sm font-medium text-text-primary">{user?.full_name || '管理员'}</p>
        <p className="text-xs text-text-muted">系统管理员</p>
      </div>
      <i className="fas fa-chevron-down text-xs text-text-muted"></i>
    </div>
  );
};

export default AdminUserInfo;