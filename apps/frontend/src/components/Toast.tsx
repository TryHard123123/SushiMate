import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColors = {
    success: 'bg-gradient-to-r from-green-600 to-emerald-700',
    error: 'bg-gradient-to-r from-red-600 to-red-700',
    info: 'bg-gradient-to-r from-orange-500 to-red-600'
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: '🍣'
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 animate-slide-up ${bgColors[type]} text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20`}>
      <span className="text-xl">{icons[type]}</span>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 text-white/70 hover:text-white">✕</button>
    </div>
  );
};

export default Toast;