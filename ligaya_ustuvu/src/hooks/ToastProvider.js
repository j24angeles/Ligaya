import { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext();
const DEFAULT_DURATION = 1500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'error', duration = DEFAULT_DURATION }) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const showError = useCallback((message, duration = DEFAULT_DURATION) => {
    return addToast({ message, type: 'error', duration });
  }, [addToast]);

  const showSuccess = useCallback((message, duration = DEFAULT_DURATION) => {
    return addToast({ message, type: 'success', duration });
  }, [addToast]);

  const showWarning = useCallback((message, duration = DEFAULT_DURATION) => {
    return addToast({ message, type: 'warning', duration });
  }, [addToast]);

  const showInfo = useCallback((message, duration = DEFAULT_DURATION) => {
    return addToast({ message, type: 'info', duration });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ showError, showSuccess, showWarning, showInfo, removeToast }}>
      {children}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            show={true}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}