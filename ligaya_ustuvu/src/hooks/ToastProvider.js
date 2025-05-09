import { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

// Create context
const ToastContext = createContext();

/**
 * Provider component that wraps your app and makes toast functions available
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Function to add a toast
  const addToast = useCallback(({ message, type = 'error', duration = 3000 }) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  }, []);

  // Function to remove a toast
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Helper functions for different toast types
  const showError = useCallback((message, duration = 3000) => {
    return addToast({ message, type: 'error', duration });
  }, [addToast]);

  const showSuccess = useCallback((message, duration = 3000) => {
    return addToast({ message, type: 'success', duration });
  }, [addToast]);

  const showWarning = useCallback((message, duration = 3000) => {
    return addToast({ message, type: 'warning', duration });
  }, [addToast]);

  const showInfo = useCallback((message, duration = 3000) => {
    return addToast({ message, type: 'info', duration });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ showError, showSuccess, showWarning, showInfo, removeToast }}>
      {children}
      
      {/* Render all active toasts */}
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
    </ToastContext.Provider>
  );
}

// Custom hook to use the toast context
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}