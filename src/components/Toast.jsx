import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => {
      const newList = [...prev, { id, message, type }];
      return newList.length > 3 ? newList.slice(-3) : newList;
    });
    
    // Auto remove after 3 seconds (matched with progress bar animation)
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-4 max-w-[calc(100%-3rem)] pointer-events-none">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const theme = {
    success: {
      color: '#4CAF50',
      title: 'Success!',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    },
    error: {
      color: '#F44336',
      title: 'Sorry...',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )
    },
    info: {
      color: '#2196F3',
      title: 'Did you know?',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
    },
    warning: {
      color: '#FFC107',
      title: 'Warning!',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    }
  }[toast.type] || { color: '#4CAF50', title: 'Success!', icon: null };

  return (
    <div
      className="relative pointer-events-auto bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-lg overflow-hidden min-w-[320px] max-w-sm flex items-start p-5 border border-gray-100 group animate-slide-in"
      role="alert"
    >
      {/* Icon Section */}
      <div 
        className="mr-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center translate-y-0.5" 
        style={{ color: 'white', backgroundColor: theme.color }}
      >
        {theme.icon}
      </div>

      {/* Content Section */}
      <div className="flex-grow">
        <h4 className="font-bold text-[15px] mb-0.5" style={{ color: theme.color }}>
          {theme.title}
        </h4>
        <p className="text-gray-600 font-medium text-sm leading-snug">
          {toast.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="ml-3 text-gray-400 hover:text-gray-800 transition-colors"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Bottom Progress Bar Background */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-50 opacity-50"></div>
      
      {/* Animated Active Progress Bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 origin-left"
        style={{ 
          backgroundColor: theme.color,
          width: '100%',
          animation: 'toast-progress 3000ms linear forwards'
        }}
      ></div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0, 0, 0.2, 1);
        }
      `}} />
    </div>
  );
}

export default ToastProvider;