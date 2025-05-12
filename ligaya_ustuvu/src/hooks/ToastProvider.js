import { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

// Create context
const ToastContext = createContext();

// Default shorter duration for all toasts
const DEFAULT_DURATION = 1500; // 1.5 seconds instead of 3 seconds

/**
 * Provider component that wraps your app and makes toast functions available
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  // Function to add a toast
  const addToast = useCallback(({ message, type = 'error', duration = DEFAULT_DURATION }) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
    return id;
  }, []);

  // Function to remove a toast
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Helper functions for different toast types
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
      
      {/* Render all active toasts stacked with spacing */}
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

// Custom hook to use the toast context
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}