

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface ForgotPasswordFormData {
  email: string;
}

interface ValidationErrors {
  email: string;
}

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('操作失败，请稍后再试');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('重置链接已发送，请查收邮箱');
  const [isShaking, setIsShaking] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '软院项目通 - 忘记密码';
    return () => { document.title = originalTitle; };
  }, []);

  // 自动聚焦到邮箱输入框
  useEffect(() => {
    const timer = setTimeout(() => {
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // 邮箱验证函数
  const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // 清除错误状态
  const clearErrorState = () => {
    setShowErrorMessage(false);
    setIsShaking(false);
  };

  // 显示错误信息
  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorMessage(true);
    setIsShaking(true);
    
    // 移除抖动类
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  // 显示成功信息
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    
    // 5秒后隐藏成功信息
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  // 处理邮箱输入变化
  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setFormData({ email: value });
    
    if (value && validateEmail(value)) {
      setValidationErrors({ email: '' });
    }
    clearErrorState();
  };

  // 处理邮箱失焦验证
  const handleEmailBlur = () => {
    if (!formData.email.trim()) {
      setValidationErrors({ email: '请输入邮箱' });
    } else if (!validateEmail(formData.email.trim())) {
      setValidationErrors({ email: '请输入有效的邮箱地址' });
    } else {
      setValidationErrors({ email: '' });
    }
    clearErrorState();
  };

  // 处理表单提交
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 清除之前的错误
    clearErrorState();
    
    // 验证邮箱
    let isValid = true;
    
    if (!formData.email.trim()) {
      setValidationErrors({ email: '请输入邮箱' });
      isValid = false;
    } else if (!validateEmail(formData.email.trim())) {
      setValidationErrors({ email: '请输入有效的邮箱地址' });
      isValid = false;
    } else {
      setValidationErrors({ email: '' });
    }
    
    if (!isValid) {
      return;
    }
    
    // 设置提交状态
    setIsSubmitting(true);
    
    // 模拟发送请求
    setTimeout(() => {
      // 显示成功信息
      showSuccess('重置链接已发送，请查收邮箱');
      
      // 重置提交状态
      setIsSubmitting(false);
      
      // 清空输入框
      setFormData({ email: '' });
    }, 1500);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter键触发发送
    if (e.key === 'Enter' && !isSubmitting) {
      const form = document.getElementById('forgot-password-form') as HTMLFormElement;
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    }
  };

  return (
    <div className={styles.pageWrapper} onKeyDown={handleKeyDown}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500 bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500 bg-opacity-10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-500 bg-opacity-5 rounded-full blur-lg"></div>
      </div>

      {/* 忘记密码容器 */}
      <div className="relative w-full max-w-md">
        {/* 忘记密码卡片 */}
        <div className={`bg-bg-light rounded-2xl shadow-login p-8 ${styles.fadeIn} ${isShaking ? styles.errorShake : ''}`}>
          {/* Logo区域 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-2xl"></i>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-text-primary">河北师范大学</h1>
                <p className="text-sm text-text-muted">软件学院</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">软院项目通</h2>
            <p className="text-text-muted">重置您的密码</p>
          </div>

          {/* 忘记密码表单 */}
          <form id="forgot-password-form" className="space-y-6" onSubmit={handleFormSubmit}>
            {/* 邮箱输入 */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                <i className="fas fa-envelope mr-2 text-orange-500"></i>邮箱
              </label>
              <input 
                ref={emailInputRef}
                type="email" 
                id="email" 
                name="email" 
                className={`w-full px-4 py-3 border rounded-lg ${styles.loginInputFocus} bg-white text-text-primary placeholder-text-muted ${validationErrors.email ? 'border-red-300' : 'border-border-light'}`}
                placeholder="请输入您注册时使用的邮箱"
                value={formData.email}
                onChange={handleEmailInputChange}
                onBlur={handleEmailBlur}
                required
                autoComplete="email"
              />
              {validationErrors.email && (
                <div className="text-sm text-red-500">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  <span>{validationErrors.email}</span>
                </div>
              )}
            </div>

            {/* 提示信息 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-orange-500 mr-2 mt-0.5"></i>
                <span className="text-orange-700 text-sm">我们将向您的邮箱发送重置密码的链接，请查收并按照提示操作。</span>
              </div>
            </div>

            {/* 错误提示 */}
            {showErrorMessage && (
              <div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <i className="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                    <span className="text-red-700 text-sm">{errorMessage}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 成功提示 */}
            {showSuccessMessage && (
              <div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    <span className="text-green-700 text-sm">{successMessage}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 发送按钮 */}
              <button 
              type="submit" 
              className={`w-full py-3 bg-orange-500 text-white font-medium rounded-lg ${styles.loginButtonHover} ${styles.loginButtonActive} transition-all duration-300 flex items-center justify-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              <i className="fas fa-paper-plane mr-2"></i>
              <span>{isSubmitting ? '发送中...' : '发送重置链接'}</span>
              {isSubmitting && (
                <i className="fas fa-spinner fa-spin ml-2"></i>
              )}
            </button>
          </form>

          {/* 返回登录链接 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              记得密码了？
              <Link to="/login" className="text-orange-500 hover:text-orange-600 transition-colors ml-1">
                返回登录
              </Link>
            </p>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="text-center mt-8">
          <p className="text-text-muted text-sm">
            © 2024 河北师范大学软件学院
          </p>
          <p className="text-text-muted text-xs mt-1">
            软院项目通 v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

