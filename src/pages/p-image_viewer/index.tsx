

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

export default function ImageViewer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '软院项目通 - 图片查看器';
    return () => { document.title = originalTitle; };
  }, []);

  // 获取URL参数
  const imageUrl = searchParams.get('imageUrl') || 'https://s.coze.cn/image/jbmcnT7ObCQ/';
  const imageTitle = searchParams.get('title') || '项目图片';
  const imageDescription = searchParams.get('description') || '项目相关图片展示';
  const sourcePage = searchParams.get('source') || '/project-detail';
  const projectId = searchParams.get('projectId');

  // 关闭图片查看器的函数
  const handleCloseImageViewer = () => {
    setIsExiting(true);
    
    // 动画完成后跳转回项目详情页
    setTimeout(() => {
      if (projectId) {
        navigate(`${sourcePage}?projectId=${projectId}`);
      } else {
        navigate(sourcePage);
      }
    }, 300);
  };

  // 背景遮罩点击事件
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseImageViewer();
    }
  };

  // 图片点击事件
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    handleCloseImageViewer();
  };

  // 防止图片拖拽
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
  };

  // 防止右键菜单
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // ESC键关闭事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseImageViewer();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 窗口大小调整时重新计算图片位置
  useEffect(() => {
    const handleResize = () => {
      const imageContainer = document.querySelector('#image-container') as HTMLElement;
      if (imageContainer) {
        imageContainer.style.maxHeight = '90vh';
        imageContainer.style.maxWidth = '90vw';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.pageWrapper} onContextMenu={handleContextMenu}>
      {/* 模态弹窗背景遮罩 */}
      <div 
        className={`fixed inset-0 ${styles.modalBackdrop} z-50 flex items-center justify-center p-4`}
        onClick={handleBackdropClick}
      >
        {/* 图片查看器内容 */}
        <div 
          className={`${styles.modalContent} relative w-full max-w-7xl ${isExiting ? styles.imageViewerExitActive : ''}`}
        >
          {/* 关闭按钮 */}
          <button 
            className={`absolute top-4 right-4 w-12 h-12 bg-orange-500 bg-opacity-80 text-white rounded-full flex items-center justify-center ${styles.closeBtnHover} z-10`}
            aria-label="关闭图片查看器"
            onClick={(e) => {
              e.stopPropagation();
              handleCloseImageViewer();
            }}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
          
          {/* 图片容器 */}
          <div id="image-container" className={`${styles.imageContainer} mx-auto`}>
            <img 
              src={imageUrl}
              alt={imageTitle}
              className="w-full h-full object-contain rounded-lg shadow-2xl"
              loading="lazy"
              onClick={handleImageClick}
              onDragStart={handleDragStart}
            />
          </div>
          
          {/* 图片信息 */}
          <div className="absolute bottom-4 left-4 right-4 bg-orange-500 bg-opacity-80 text-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{imageTitle}</h3>
            <p className="text-sm text-white">{imageDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

