import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

/**
 * 模态框组件
 * @param {Object} props
 * @param {boolean} props.visible - 是否显示
 * @param {string} props.title - 标题
 * @param {Function} props.onClose - 关闭回调
 * @param {Function} props.onConfirm - 确认回调
 * @param {string} props.confirmText - 确认按钮文字
 * @param {string} props.cancelText - 取消按钮文字
 * @param {string} props.confirmType - 确认按钮类型
 * @param {boolean} props.loading - 加载状态
 * @param {boolean} props.showFooter - 是否显示底部按钮
 * @param {string} props.width - 宽度 (sm/md/lg/xl)
 * @param {React.ReactNode} props.children - 内容
 */
const Modal = ({
  visible,
  title,
  onClose,
  onConfirm,
  confirmText = '确定',
  cancelText = '取消',
  confirmType = 'primary',
  loading = false,
  showFooter = true,
  width = 'md',
  children,
}) => {
  // 宽度配置
  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  // 按 ESC 关闭
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && visible) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  // 禁止背景滚动
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* 模态框容器 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-xl shadow-xl w-full ${widthClasses[width]} transform transition-all`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* 内容 */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {children}
          </div>

          {/* 底部按钮 */}
          {showFooter && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <Button type="secondary" onClick={onClose}>
                {cancelText}
              </Button>
              {onConfirm && (
                <Button type={confirmType} onClick={onConfirm} loading={loading}>
                  {confirmText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
