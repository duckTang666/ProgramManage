

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface FormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordStrength {
  level: 'weak' | 'medium' | 'strong' | '';
  text: string;
}

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 表单数据状态
  const [formData, setFormData] = useState<FormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 密码可见性状态
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 错误状态
  const [formErrors, setFormErrors] = useState<FormErrors>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 密码强度状态
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    level: '',
    text: '请输入密码'
  });

  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '修改密码 - 软院项目通';
    return () => { 
      document.title = originalTitle; 
    };
  }, []);

  // 自动聚焦到旧密码输入框
  useEffect(() => {
    const timer = setTimeout(() => {
      const oldPasswordInput = document.getElementById('old-password') as HTMLInputElement;
      if (oldPasswordInput) {
        oldPasswordInput.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // ESC键关闭弹窗
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 关闭模态弹窗
  const handleCloseModal = () => {
    navigate('/personal-center');
  };

  // 点击遮罩层关闭弹窗
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  // 密码显示/隐藏切换
  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    switch (field) {
      case 'old':
        setShowOldPassword(!showOldPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  // 密码强度检测
  const checkPasswordStrength = (password: string): PasswordStrength => {
    let strength = 0;
    let strengthText = '';
    let strengthLevel: 'weak' | 'medium' | 'strong' | '' = '';

    // 长度检查
    if (password.length >= 8) strength++;

    // 包含小写字母
    if (/[a-z]/.test(password)) strength++;

    // 包含大写字母
    if (/[A-Z]/.test(password)) strength++;

    // 包含数字
    if (/[0-9]/.test(password)) strength++;

    // 包含特殊字符
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // 确定强度等级
    switch (strength) {
      case 0:
      case 1:
      case 2:
        strengthText = '弱';
        strengthLevel = 'weak';
        break;
      case 3:
      case 4:
        strengthText = '中';
        strengthLevel = 'medium';
        break;
      case 5:
        strengthText = '强';
        strengthLevel = 'strong';
        break;
      default:
        strengthText = '请输入密码';
        strengthLevel = '';
    }

    return { level: strengthLevel, text: strengthText };
  };

  // 表单输入处理
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // 清除对应字段的错误信息
    setFormErrors(prev => ({ ...prev, [field]: '' }));

    // 密码强度检测
    if (field === 'newPassword') {
      if (value.length === 0) {
        setPasswordStrength({ level: '', text: '请输入密码' });
      } else {
        const strength = checkPasswordStrength(value);
        setPasswordStrength(strength);
      }
    }

    // 确认密码验证
    if (field === 'confirmPassword') {
      if (value.length > 0 && value !== formData.newPassword) {
        setFormErrors(prev => ({ ...prev, confirmPassword: '两次输入的密码不一致' }));
      } else {
        setFormErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    const errors: FormErrors = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    let isValid = true;

    // 旧密码验证
    if (formData.oldPassword.length < 6) {
      errors.oldPassword = '旧密码至少需要6位字符';
      isValid = false;
    }

    // 新密码验证
    if (formData.newPassword.length < 8) {
      errors.newPassword = '密码至少需要8位字符';
      isValid = false;
    }

    // 确认密码验证
    if (formData.confirmPassword !== formData.newPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // 模拟API调用
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 显示成功提示
      setShowSuccessMessage(true);

      // 2秒后关闭弹窗
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (error) {
      setFormErrors(prev => ({ ...prev, oldPassword: '修改失败，请重试' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 检查表单是否可提交
  const isFormValid = formData.oldPassword.length >= 6 && 
                     formData.newPassword.length >= 8 && 
                     formData.newPassword === formData.confirmPassword &&
                     !formErrors.oldPassword &&
                     !formErrors.newPassword &&
                     !formErrors.confirmPassword;

  return (
    <div className={styles.pageWrapper}>
      {/* 模态弹窗遮罩层 */}
      <div 
        className={`fixed inset-0 ${styles.modalBackdrop} z-50 flex items-center justify-center p-4`}
        onClick={handleBackdropClick}
      >
        {/* 模态弹窗内容 */}
        <div className={`bg-bg-light rounded-2xl shadow-modal w-full max-w-md ${styles.modalEnter}`}>
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <h2 className="text-xl font-bold text-text-primary flex items-center">
              <i className="fas fa-key text-orange-500 mr-3"></i>
              修改密码
            </h2>
            <button 
              onClick={handleCloseModal}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          
          {/* 弹窗内容 */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 旧密码 */}
              <div className="space-y-2">
                <label htmlFor="old-password" className="block text-sm font-medium text-text-primary">
                  旧密码 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type={showOldPassword ? 'text' : 'password'}
                    id="old-password" 
                    name="old-password"
                    className={`w-full pl-10 pr-12 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    placeholder="请输入旧密码"
                    value={formData.oldPassword}
                    onChange={(e) => handleInputChange('oldPassword', e.target.value)}
                    required
                  />
                  <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                  <button 
                    type="button" 
                    onClick={() => togglePasswordVisibility('old')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    <i className={`fas ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {formErrors.oldPassword && (
                  <div className={styles.errorMessage}>{formErrors.oldPassword}</div>
                )}
              </div>
              
              {/* 新密码 */}
              <div className="space-y-2">
                <label htmlFor="new-password" className="block text-sm font-medium text-text-primary">
                  新密码 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? 'text' : 'password'}
                    id="new-password" 
                    name="new-password"
                    className={`w-full pl-10 pr-12 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    placeholder="请输入新密码（至少8位）"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    required
                    minLength={8}
                  />
                  <i className="fas fa-key absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                  <button 
                    type="button" 
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {/* 密码强度指示器 */}
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className={`${styles.passwordStrength} ${
                        passwordStrength.level ? styles[`strength${passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}`] : ''
                      }`}
                    ></div>
                  </div>
                  <div className="text-xs text-text-muted">
                    {'密码强度：'}{passwordStrength.text}
                  </div>
                </div>
                {formErrors.newPassword && (
                  <div className={styles.errorMessage}>{formErrors.newPassword}</div>
                )}
              </div>
              
              {/* 确认新密码 */}
              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-text-primary">
                  确认新密码 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirm-password" 
                    name="confirm-password"
                    className={`w-full pl-10 pr-12 py-3 border border-border-light rounded-lg ${styles.formInputFocus}`}
                    placeholder="请再次输入新密码"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                  <i className="fas fa-check-circle absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"></i>
                  <button 
                    type="button" 
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <div className={styles.errorMessage}>{formErrors.confirmPassword}</div>
                )}
              </div>
              
              {/* 操作按钮 */}
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-border-light text-text-secondary rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  disabled={!isFormValid || isSubmitting}
                  className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      修改中...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      确认修改
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* 成功提示 */}
            {showSuccessMessage && (
              <div className={`${styles.successMessage} text-center py-2`}>
                <i className="fas fa-check-circle mr-2"></i>
                密码修改成功！
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

